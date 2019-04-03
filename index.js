const functions = require("firebase-functions");
const express = require("express");
const adminSdk = require("./src/services/admin-sdk.service");

adminSdk.initDefaultApp();

const userRoutes = require("./src/api/users/user.routes");
const main = express();
main.use(userRoutes);
main.get("/", (req, res) => res.sendFile('docs/output.html', {"root": __dirname}));

exports.gtestAPI = functions.https.onRequest(main)

