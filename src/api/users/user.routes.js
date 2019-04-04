const express = require("express");

const userController = require('./user.controller');
const errrorMiddleware = require('../../middlewares/errors');
const validationMiddleware = require('../../middlewares/scheme.validator');
const userValidation = require('./user.validation');

const router = express.Router();

router
    .route("/users")
    .get(userController.fetchUsers)
    .post(
        validationMiddleware.validate(validationMiddleware.CREATE, userValidation.schema),
        userController.add,
    )
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