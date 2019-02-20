const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.fetchRecentChunks = functions.https.onRequest((req, res) => {
    const contractId = req.query.contractId;
    if(!contractId){
        res.send({errorMessage : "contract id not defined"});
    }

    var currentMonth = new Date().getMonth();
    var timestamp3MonthsPrior = new Date().setMonth(currentMonth - 3);
    return admin
        .database()
        .ref(`/contractList/${contractId}/chunkList`)
        .orderByChild('inAtMs')
        .startAt(timestamp3MonthsPrior)
        .once('value', 
            snap =>  {
                const chunkList = [];
                // snap.val();
                snap.forEach(chunk => {
                    const dt = chunk.val();
                    chunkList.push(dt);
                });
                res.send(chunkList);
                // return res.json(snap.val());
            },
            err => res.json(err)
        )
});


exports.fetchMembers = functions.https.onRequest((req, res) => {
    const contractId = req.query.contractId;
    if(!contractId){
        res.send({errorMessage : "contract id not defined"});
    }
    const database = admin.database();

    let currentMonth = new Date().getMonth();
    let timestamp3MonthsPrior = new Date().setMonth(currentMonth - 3);
    let chunkList = [];
    database
        .ref(`/contractList/${contractId}/chunkList`)
        .orderByChild('inAtMs')
        .startAt(timestamp3MonthsPrior)
        .once('value', 
            snap =>  {
                const chunkList = [];
                // snap.val();
                snap.forEach(chunk => {
                    const dt = chunk.val();
                    chunkList.push(dt);
                });
                // res.send(chunkList);
            },
            err => res.json(err)
        );
    // res.send(chunkList);
    let members = {};
    database
        .ref(`/contractList/${contractId}/memberList`)
        .orderByChild('inAtMs')
        .startAt(timestamp3MonthsPrior)
        .once('value', 
            snap =>  {
                members = snap.val();
            },
            err => res.json(err)
        );

    let response = {
        members,
        chunkList,
    };
    
    /*
    res.send(response);
    */
});
