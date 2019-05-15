/* eslint-disable max-statements */
const admin = require('firebase-admin');
const responses = require('../models/Response');
const Trip = require('./Trip');
const ArrayObjectUtil = require('../../utils/array.object.util');

const collectionsService = require('../../services/collections.service');
const User = require('../users/User');
const Route = require('../routes/Route');
const Vehicle = require('../vehicles/Vehicle');

const {getBookingsCollection,getUsersCollection,getTripsCollection} = collectionsService;
const {arrayToObject} = ArrayObjectUtil;

const {
    NotFoundResponse,
    SuccessResponse,
    ServerErrorResponse
} = responses;

const UserNotFound = new NotFoundResponse('Trip could not be found','Trip could not be found');
const ServerSuccess = new SuccessResponse('Success', {"success": true});
const ServerError = new ServerErrorResponse('Error', {"success": false});


exports.fetchTrips = async (req, res) => {
    try {
        const result = await Trip.retrieveAll();

        return res.status(ServerSuccess.status).send(result);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.fetchTrip = async (req, res) => {
    try {
        const {id} = req.params;
        
        const trip = await Trip.retrieve(id);

        if (!trip) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }

        const bookingsCollection = getBookingsCollection();
        const usersCollection = getUsersCollection();
        
        const bookingsResponse = await bookingsCollection
            .where("TripId","==",id)
            .get();
        const bookings = bookingsResponse.docs.map((data) => ({Id: data.id,
            ...data.data()}));

        const usersRef = bookings.map((booking) => usersCollection.doc(booking.CommuterId));

        const usersResponse = await Promise.all(usersRef.map((userRef) => userRef.get()));
        const users = usersResponse.map((data) => ({Id: data.id,
            ...data.data()}));
        const usersObject = arrayToObject(users,"Id");
        const Commuters = bookings.map((data) => ({
            ...data,
            Commuter: usersObject[data.CommuterId]
        }));
        const responseData = {
            ...trip,
            Commuters
        };

        return res.status(ServerSuccess.status).send(responseData);    
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.add = async (req, res) => {
    try {
        const {body} = req;
        const {
            DriverId,
            RouteId,
            DepartTime,
            DepartDate,
            VehicleId,
            Price
        } = body;

        const [
            user,
            route,
            vehicle
        ] = await Promise.all([
            User.retrieve(DriverId),
            Route.retrieve(RouteId),
            Vehicle.retrieve(VehicleId)
        ]);
        if (!user) {
            throw new Error('Driver not found');
        }
        if (!route) {
            throw new Error('Route not found');
        }
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        const nDriver = {
            Id: user.Id,
            LastName: user.LastName,
            FirstName: user.FirstName,
            BirthDate: user.BirthDate,
            Gender: user.Gender,
            ContactNum: user.ContactNum
        };
        const nRoute = {
            Id: route.Id,
            Route: route.Route,
            FromLocation: route.FromLocation,
            ToLocation: route.ToLocation
        };
        const nSchedule = {
            DepartTime,
            DepartDate
        };
        const vehicleSeatsArray = Object.keys(vehicle.Seats);
        const vehicleSeatsObject = vehicleSeatsArray.reduce((acc, curr) => ({
            ...acc,
            [curr]: false
        }),{});
        const nVehicle = {
            Id: vehicle.Id,
            PlateNumber: vehicle.PlateNumber,
            Seats: vehicleSeatsObject
        }

        const toBeAdded = {
            Status: "Waiting",
            Price,
            Driver: nDriver,
            Route: nRoute,
            Schedule: nSchedule,
            Vehicle: nVehicle
        };
        await Trip.create(toBeAdded);

        /*
        const scheme = {
            Id,
            Status,//defaults to waiting
            Price
            Driver: {
                Id, // passed as params
                LastName,
                FirstName,
                BirthDate,
                Gender,
                ContactNum,
            },
            Route: {
                Id, // passed as params
                Route,
                FromLocation:[],
                ToLocation: [],
            },
            Schedule: {
                DepartTime,// passed as params
                DepartDate,// passed as params
            },
            Vehicle: {
                Id, // passed as params
                PlateNumber,
                Seats: { // kung unsai porma ani niya jud
                    seat_name_1:false,
                    seat_name_2:false,
                },
            }
        };
        */

        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};

exports.update = async (req, res) => {
    try {
        // status should either be Waiting, Travelling, Cancelled, Finished
        const {id} = req.params;
        const {body} = req;

        const result = await Trip.retrieve(id);

        if (!result) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }
        await Trip.update(id,{
            ...body,
            TripId: id
        });
    
        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.error).send({"error": error.message});
    }
};

exports.delete = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await Trip.retrieve(id);

        if (!result) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }
        await Trip.delete(id);

        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};

exports.cancelTrip = async (req, res) => {
    try {
        const {id} = req.params;
        const batch = admin.firestore().batch();
        const trip = await Trip.retrieve(id);

        if (!trip) {
            throw new Error('Trip does not exist');
        }

        // update actual trip
        const updateTripRef = getTripsCollection().doc(id);
        const newTrip = {
            Status: 'Cancelled',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        batch.update(updateTripRef, newTrip);

        // update bookings under trip
        const bookingsCollection = getBookingsCollection().where('TripId','==',id);
        const bookingsRefs = await bookingsCollection.get();
        const bookings = bookingsRefs.docs.map((data) => ({Id: data.id,
            ...data.data()}));
        bookings.forEach((booking) => {
            const newBooking = {
                Status: 'Cancelled',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            batch.update(getBookingsCollection().doc(booking.Id),newBooking);
        }); 

        // update commuter balances
        const users = await Promise.all(bookings.map((booking) => User.retrieve(booking.CommuterId)));
        users.forEach((user) => {
            const newUser = {
                WalletBalance: user.WalletBalance + trip.Price,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            batch.update(getUsersCollection().doc(user.Id), newUser);
        });
        // to do send notification to user

        await batch.commit();

        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}
