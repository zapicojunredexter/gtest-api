const admin = require('firebase-admin');

const USERS_COLLECTION = 'Users';

const getUsersCollection = () => admin.firestore().collection(USERS_COLLECTION);

module.exports = {
    getUsersCollection
}