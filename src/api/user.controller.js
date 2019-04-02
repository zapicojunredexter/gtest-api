const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const COLLECTION_NAME = 'Users';

exports.fetchAll = async (req, res, next) => {
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


exports.edit = async (req, res, next) => {
    try {
      const user = new User(req.body);
      const result = await user.save();
      const response = new CreatedResponse('User Created.', result);
      return res.status(response.status).send(response.toString());
    } catch (error) {
      console.error(error);
    //   const err = new ServerErrorResponse('Failed to create user');
      return next(error.toString());
    }
  };