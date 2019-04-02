const functions = require("firebase-functions")

const express = require("express")

const main = express();

const userRoutes = require("./src/api/users/user.routes");
main.use('/api/users',userRoutes);

exports.gtestAPI = functions.https.onRequest(main)

