const functions = require("firebase-functions");
const express = require("express");
const Joi = require('joi');
const adminSdk = require("./src/services/admin-sdk.service");

adminSdk.initDefaultApp();

const userRoutes = require("./src/api/users/user.routes");
const main = express();
main.use(userRoutes);
// main.get("/", (req, res) => res.sendFile('docs/output.html', {"root": __dirname}));


main.get("/", (req, res) => {

    const schema = Joi.object().keys({
        "access_token": [
            Joi.string(),
            Joi.number()
        ],
        "birthyear": Joi.number().integer()
            .min(1900)
            .max(2013),
        "email": Joi.string().email({"minDomainAtoms": 2 }),
        "password": Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        "username": Joi.string().alphanum()
            .min(3)
            .max(30)
            .required()
    })
    // .with("username", 'birthyear')
    // .without('password', 'access_token');

    // Return result.
    const result = Joi.validate({ password:"",username: "", birthyear: 1899 }, schema);
    // console.log("WOT",result);
    console.log("WAT",result.error.details);

    return res.send("JAJA");
});

exports.gtestAPI = functions.https.onRequest(main)

