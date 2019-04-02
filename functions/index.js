const functions = require("firebase-functions")
const express = require("express")

/* Express */
const main = express();


const chunkRoutes = require("./src/routes/chunkRoutes");
main.use('/api/chunks',chunkRoutes);
// main.get("/test", (req, res) => {
//   res.send("Hello from Express on Firebase!")
// })


exports.attendanceApp = functions.https.onRequest(main)
