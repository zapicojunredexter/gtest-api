const admin = require('firebase-admin');
const collectionsService = require('../../services/collections.service');

const {getUsersCollection} = collectionsService;

class User {
    static async create (params) {
        const toBeAdded = {
            ...params,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            deleted: false
        };
    
        const added = await getUsersCollection().add(toBeAdded);
    
        const newlyAdded = {
            id: added.id,
            ...toBeAdded
        };
    
        return newlyAdded;
    }
    
    static async retrieve (id) {
        const result = await getUsersCollection()
            .doc(id)
            .get();
        if (result.exists) {
            return {Id: id,
                ...result.data()};
        }

        return null;
    }
    
    static async update (id, params) {
        const toBeUpdated = {
            ...params,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await getUsersCollection()
            .doc(id)
            .update(toBeUpdated);

        return toBeUpdated;
    }
    
    static async delete (id) {
        const toBeUpdated = {    
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            deleted: true
        };
    
        await getUsersCollection()
          .doc(id)
          .update(toBeUpdated);
    
        return toBeUpdated;
    }
    
    static async retrieveAll () {
        const result = await getUsersCollection().get();
    
        return result.docs.map((data) => ({Id: data.id,
            ...data.data()}));
    }
}

module.exports = User;
