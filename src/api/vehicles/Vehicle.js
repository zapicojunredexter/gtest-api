const admin = require('firebase-admin');
const collectionsService = require('../../services/collections.service');

const {getVehiclesCollection} = collectionsService;

class Vehicle {
    static async create (params) {
        const toBeAdded = {
            ...params,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            deleted: false
        };
    
        const added = await getVehiclesCollection().add(toBeAdded);
    
        const newlyAdded = {
            id: added.id,
            ...toBeAdded
        };
    
        return newlyAdded;
    }
    
    static async retrieve (id) {
        const result = await getVehiclesCollection()
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

        await getVehiclesCollection()
            .doc(id)
            .update(toBeUpdated);

        return toBeUpdated;
    }
    
    static async delete (id) {
        const toBeUpdated = {    
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            deleted: true
        };
    
        await getVehiclesCollection()
          .doc(id)
          .update(toBeUpdated);
    
        return toBeUpdated;
    }
    
    static async retrieveAll () {
        const result = await getVehiclesCollection().get();
    
        return result.docs.map((data) => ({Id: data.id,
            ...data.data()}));
    }
}

module.exports = Vehicle;
