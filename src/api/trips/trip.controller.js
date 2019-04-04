const responses = require('../models/Response');
const Trip = require('./Trip');

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
        
        const result = await Trip.retrieve(id);

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

        const newId = await Trip.create(body);
        const isEdited = await Trip.update(newId,{TripId: newId});

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
