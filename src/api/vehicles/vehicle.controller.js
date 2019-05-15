const admin = require('firebase-admin');
const responses = require('../models/Response');
const collectionsService = require('../../services/collections.service');
const Vehicle = require('./Vehicle');

const usersCollection = collectionsService.getUsersCollection();

const {
    NotFoundResponse,
    SuccessResponse,
    ServerErrorResponse
} = responses;

const UserNotFound = new NotFoundResponse('User could not be found','User could not be found');
const ServerSuccess = new SuccessResponse('Success', {"success": true});
const ServerError = new ServerErrorResponse('Error', {"success": false});

exports.fetchUsers = async (req, res) => {
    try {
        const userRef = usersCollection;
        const response = await userRef.get();

        return res.status(ServerSuccess.status).send(response.docs.map((obj) => obj.data()));
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.add = async (req, res) => {
    try {
        const {body} = req;
        await Vehicle.create(body);

        return res.status(ServerSuccess.status).send(ServerSuccess);

        /*
        // if exclude registration flow
        const {body} = req;
        const userRef = db.collection(COLLECTION_NAME);
        const addedUser = await userRef.add({
            ...body,
            "createdAtMs": admin.firestore.FieldValue.serverTimestamp(),
            "deleted": false,
            "updatedAtMs": admin.firestore.FieldValue.serverTimestamp()
        });
        const {id} = addedUser;

        await userRef.doc(id).set({id},{"merge": true});

        return res.status(200).send({"success": true});
        */
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};

exports.fetchUser = async (req, res) => {
    try {
        const {id} = req.params;
        const userRef = usersCollection;
        const response = await userRef
            .doc(id)
            .get();

        if (!response.exists) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }

        return res.status(ServerSuccess.status).send(response.data());    
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.update = async (req, res) => {
    try {
        const {id} = req.params;
        const {body} = req;

        const vehicle = Vehicle.retrieve(id);
        if (!vehicle) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }

        await Vehicle.update(id, body);
    
        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.error).send({"error": error.message});
    }
};

exports.delete = async (req, res) => {
    try {
        const {id} = req.params;
        const userRef = usersCollection.doc(id);

        const user = await userRef.get();
        if (!user.exists) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }
    
        await userRef
            .set({
                "deleted": true,
                "updatedAtMs": admin.firestore.FieldValue.serverTimestamp()
            },{"merge": true});
    
        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};
