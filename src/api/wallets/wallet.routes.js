const express = require("express");

const walletController = require('./wallet.controller');

const router = express.Router();

router
    .route("/wallets/users/:id")
    .get(walletController.fetchUsersWallet)

router
    .route("/wallets")
    .post(walletController.add)
    .get(walletController.fetchWallets)

    
module.exports = router;