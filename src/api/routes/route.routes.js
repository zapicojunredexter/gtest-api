const express = require("express");

const routesController = require('./route.controller');
// const errrorMiddleware = require('../../middlewares/errors');

// const validationMiddleware = require('../../middlewares/scheme.validator');

// const userValidation = require('./user.validation');

const router = express.Router();

router
    .route("/routes")
    .get(routesController.fetchRoutes);

    /*
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
    */
    
module.exports = router;