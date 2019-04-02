const express = require("express");
const app = express();

app.get("/",
    (req, res) => {
        res.send('HELLO WORLD LISzxcT');
    }
);


app.get("/:id",
    (req, res) => {
        const id = req.params.id;
        res.send('HELLO WORLD'+id);
    }
);


module.exports = app;