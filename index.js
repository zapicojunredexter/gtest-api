const functions = require("firebase-functions");
const express = require("express");
const adminSdk = require("./src/services/admin-sdk.service");

adminSdk.initDefaultApp();

const main = express();
const userRoutes = require("./src/api/users/user.routes");
const terminalRoutes = require("./src/api/terminals/terminal.routes");
const scheduleRoutes = require("./src/api/schedules/schedule.routes");
main.use(userRoutes);
main.use(terminalRoutes);
main.use(scheduleRoutes);
main.get("/", (req, res) => res.sendFile('docs/output.html', {"root": __dirname}));


exports.gtestAPI = functions.https.onRequest(main)

