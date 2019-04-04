const admin = require('firebase-admin');

const USERS_COLLECTION = 'Users';

const TERMINALS_COLLECTION = 'Terminals';

const getUsersCollection = () => admin.firestore().collection(USERS_COLLECTION);

const getTerminalsCollection = () => admin.firestore().collection(TERMINALS_COLLECTION);

module.exports = {
    getTerminalsCollection,
    getUsersCollection
}