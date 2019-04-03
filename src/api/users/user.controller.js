const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const COLLECTION_NAME = 'Users';

exports.fetchUsers = async (req, res) => {
    try {
        const userRef = db.collection(COLLECTION_NAME);
        const response = await userRef.get();

        return res.status(200).send(response.docs.map((obj) => obj.data()));
    } catch (error) {
        return res.status(500).send({"error": error.message});
    }
}

exports.add = async (req, res) => {
    try {
        const {body} = req;
        const {email, password} = body;

        const registrationRes = await admin.auth().createUser({
            email,
            password
        })
        .catch((error) => {
            throw error;
        });
        const {uid} = registrationRes;

        const userRef = db.collection(COLLECTION_NAME).doc(uid);
        Reflect.deleteProperty(body,"password");
        await userRef
            .set({
                ...body,
                "id": uid,
                "updatedAtMs": admin.firestore.FieldValue.serverTimestamp()
            },{"merge": true});
    
        return res.status(200).send({"success": true});

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
        return res.status(500).send({"error": error.message});
    }
};

exports.fetchUser = async (req, res) => {
    try {
        const {id} = req.params;
        const userRef = db.collection(COLLECTION_NAME);
        const response = await userRef
            .doc(id)
            .get();

        if (!response.exists) {
            return res.status(404).send({"message": "User not found"});
        }

        return res.status(200).send(response.data());    
    } catch (error) {
        return res.status(500).send({"error": error.message});
    }
}

exports.update = async (req, res) => {
    try {
        const {id} = req.params;
        const {body} = req;

        const userRef = db.collection(COLLECTION_NAME).doc(id);
        const user = await userRef.get();
        if (!user.exists) {
            return res.status(404).send({"message": "User not found"});
        }

        await userRef
            .set({
                ...body,
                "updatedAtMs": admin.firestore.FieldValue.serverTimestamp()
            },{"merge": true});
    
        return res.status(200).send({"success": true});
    } catch (error) {
        return res.status(500).send({"error": error.message});
    }
};

exports.delete = async (req, res) => {
    try {
        const {id} = req.params;
        const userRef = db.collection(COLLECTION_NAME).doc(id);

        const user = await userRef.get();
        if (!user.exists) {
            return res.status(404).send({"message": "User not found"});
        }
    
        await userRef
            .set({
                "deleted": true,
                "updatedAtMs": admin.firestore.FieldValue.serverTimestamp()
            },{"merge": true});
    
        return res.status(200).send({"success": true});
    } catch (error) {
        return res.status(500).send({"error": error.message});
    }
};
