const responses = require('../models/Response');
const Booking = require('./Booking');

const {
    NotFoundResponse,
    SuccessResponse,
    ServerErrorResponse
} = responses;

const UserNotFound = new NotFoundResponse('Booking could not be found','Booking could not be found');
const ServerSuccess = new SuccessResponse('Success', {"success": true});
const ServerError = new ServerErrorResponse('Error', {"success": false});


exports.fetchBookings = async (req, res) => {
    try {
        const result = await Booking.retrieveAll();

        return res.status(ServerSuccess.status).send(result);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.fetchBooking = async (req, res) => {
    try {
        const {id} = req.params;
        
        const result = await Booking.retrieve(id);

        if (!result) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }

        return res.status(ServerSuccess.status).send(result);    
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.add = async (req, res) => {
    try {
        const {body} = req;

        const newId = await Booking.create(body);
        const isEdited = await Booking.update(newId,{BookingId: newId});

        if (!isEdited) {
            throw new Error("Could not set ID");
        }

        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};

exports.update = async (req, res) => {
    try {
        const {id} = req.params;
        const {body} = req;

        const result = await Booking.retrieve(id);

        if (!result) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }
        await Booking.update(id,{
            ...body,
            BookingId: id
        });
    
        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.error).send({"error": error.message});
    }
};

exports.delete = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await Booking.retrieve(id);

        if (!result) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }
        await Booking.delete(id);

        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};
