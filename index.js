const functions = require("firebase-functions")
const express = require("express")

const main = express();
const userRoutes = require("./src/api/users/user.routes");
main.use(userRoutes);
// main.use('/api/users',userRoutes);
main.get("/", (req, res) => res.sendFile('docs/output.html', {"root": __dirname}));

exports.gtestAPI = functions.https.onRequest(main)

