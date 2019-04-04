const admin = require('firebase-admin');

const USERS_COLLECTION = 'Users';

const TERMINALS_COLLECTION = 'Terminals';

const SCHEDULES_COLLECTION = 'Schedules';

const TRIPS_COLLECTION = 'Trips';

const getUsersCollection = () => admin.firestore().collection(USERS_COLLECTION);

const getTerminalsCollection = () => admin.firestore().collection(TERMINALS_COLLECTION);

const getSchedulesCollection = () => admin.firestore().collection(SCHEDULES_COLLECTION);

const getTripsCollection = () => admin.firestore().collection(TRIPS_COLLECTION);

module.exports = {
    getTerminalsCollection,
    getUsersCollection,
    getSchedulesCollection,
    getTripsCollection
}