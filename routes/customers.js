const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const { pool } = require("../db-connector.js");

router.use(bodyParser.json());

router.get("/", (req, res) => {
    res.sendFile("customers.html", { root: "./public" });
});

router.get("/table", (req, res) => {
    res.send()
});

module.exports = router;
