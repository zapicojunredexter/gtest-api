// const Firestore = require('@google-cloud/firestore');
const express = require("express");

/*
const app = express();
const admin = require('firebase-admin');
const functions = require('firebase-functions');
*/
const userController = require('./user.controller');

const router = express.Router();

router
    .route("/")
    .get(userController.fetchUsers)

router
    .route("/:id")
    .get(userController.fetchUser)

router
    .route("/")
    .post(userController.add)

router
    .route("/")
    .put(userController.update)

router
    .route("/")
    .delete(userController.delete)
    
module.exports = router;

/*
const COLLECTION_NAME = 'Users';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

app.get("/",
    (req, res) => {
        const userRef = db.collection(COLLECTION_NAME);
        userRef
            .get()
            .then(doc => {
                if (doc.empty) {
                    return res.send([]);
                }
                return res.status(200).send(doc.docs.map(obj => obj.data()));
            })
            .catch(error => {
                return res.status(500).send(error);
            });
    }
);

app.get("/:id",
    (req, res) => {
        const id = req.params.id;
        const userRef = db.collection(COLLECTION_NAME);
        userRef
            .doc(id)
            .get()
            .then(doc => {
                if (!doc.exists) {
                    return res.send([]);
                }
                return res.status(200).send(doc.data());
            })
            .catch(error => {
                return res.status(500).send(error);
            });
    }
);

app.post("/",
    async (req, res) => {
        const { body } = req;
        const {
            id
        } = body;
        try {
            const userRef = db.collection(COLLECTION_NAME);
            const addedUser = await userRef.add(body);
            const { id } = addedUser;

            const editedUser = await userRef.doc(id).set({ id }, { merge: true });
            
            return res.status(200).send({ success : true, res: editedUser });
        } catch (error) {
            return res.status(500).send(error);
        }
    }
);

app.put("/",
    (req, res) => {
        const { body } = req;
        const {
            id
        } = body;
        const userRef = db.collection(COLLECTION_NAME);
        userRef
            .doc(id)
            .set(body, { merge: true })
            .then(doc => {
                return res.status(200).send({ success : true });
            })
            .catch(error => {
                return res.status(500).send(error);
            });
    }
);

app.delete("/",
    (req, res) => {
        const { body } = req;
        const {
            id
        } = body;
        const userRef = db.collection(COLLECTION_NAME);
        userRef
            .doc(id)
            .set({ deleted : true }, { merge: true })
            .then(doc => {
                return res.status(200).send({ success : true });
            })
            .catch(error => {
                return res.status(500).send(error);
            });
    }
);

app.get("/testzxc",
    (req, res) => {
    }
);


module.exports = app;
*/