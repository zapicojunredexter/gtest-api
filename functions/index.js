const functions = require("firebase-functions")
const express = require("express")

/* Express */
const main = express();

const userRoutes = require("./src/routes/userRoutes");
main.use('/api/users',userRoutes);


exports.gtestAPI = functions.https.onRequest(main)
