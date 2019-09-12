const functions = require("firebase-functions");
const express = require("express");
const adminSdk = require("./src/services/admin-sdk.service");
const cors = require("cors");

adminSdk.initDefaultApp();


const main = express();

// /*
main.use(cors({
    origin: true
}));
// */

const userRoutes = require("./src/api/users/user.routes");
const terminalRoutes = require("./src/api/terminals/terminal.routes");
const scheduleRoutes = require("./src/api/schedules/schedule.routes");
const tripRoutes = require("./src/api/trips/trip.routes");
const bookingRoutes = require("./src/api/bookings/booking.routes");
const feedbackRoutes = require("./src/api/feedbacks/feedback.routes");
const walletRoutes = require("./src/api/wallets/wallet.routes");
const routeRoutes = require("./src/api/routes/route.routes");
const vehicleRoutes = require("./src/api/vehicles/vehicle.routes");

// eslint-disable-next-line func-names
/*
main.use((req, res, next) => {

    res.header('Content-Type','application/json');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // eslint-disable-next-line eqeqeq
    if (req.method == 'OPTIONS') {
        return res.status(204).send('');
    }

    return next();
});
*/
main.use(userRoutes);
main.use(terminalRoutes);
main.use(scheduleRoutes);
main.use(tripRoutes);
main.use(bookingRoutes);
main.use(feedbackRoutes);
main.use(walletRoutes);
main.use(routeRoutes);
main.use(vehicleRoutes);

// main.use(cors({origin: true}));

// main.get("/", (req, res) => res.sendFile('docs/output.html', {"root": __dirname}));

/*
main.get("/", (req, res) => {
  const jwtToken = req.headers;//[API_HEADERS.JWT_TOKEN];
    console.log(jwtToken);
    res.send("OKSSS");
    // res.sendFile('docs/output.html', {"root": __dirname});
});
*/
exports.gtestAPI = functions.https.onRequest(main)

