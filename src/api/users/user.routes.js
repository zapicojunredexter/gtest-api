const express = require("express");

const userController = require('./user.controller');
const errrorMiddleware = require('../../middlewares/errors');

const router = express.Router();

router
    .route("/users")
    .get(userController.fetchUsers)
    .post(userController.add)
    .all(errrorMiddleware.allowOnly([
        'GET',
        'POST'
    ]))

router
    .route("/users/:id")
    .get(userController.fetchUser)
    .put(userController.update)
    .delete(userController.delete)
    .all(errrorMiddleware.allowOnly([
        'GET',
        'DELETE',
        'POST',
        'PUT'
    ]))
    
module.exports = router;