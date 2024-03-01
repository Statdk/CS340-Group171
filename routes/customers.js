const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const { pool } = require("../db-connector.js");

router.use(bodyParser.json());

router.get("/", (req, res) => {
    res.sendFile("customers.html", { root: "./public" });
});

// Get table
router.get("/table", (req, res) => {
    pool.query("select * from Customers", (err, result) => {
        if (err != null) {
            res.sendStatus(500);
            console.log("Error:", err);
        } else {
            console.log("Retrieved:", result);
            res.render("customers-table", { customers: result });
        }
    });
});

// Create
router.post("/create", (req, res) => {
    pool.query(
        `INSERT INTO Customers (firstName, lastName, email, phoneNumber) VALUES
    ("${req.body.first}", "${req.body.last}", "${req.body.email}", "${req.body.phone}");
    `,
        (err, result) => {
            if (err != null) {
                console.log("Could not create entry with:", req.body);
                console.log(err);
                res.sendStatus(500);
            } else {
                console.log("Created entry:", result);
                res.sendStatus(200);
            }
        }
    );
});

// Read
router.get("/get/:id", (req, res) => {
    pool.query(
        `SELECT * FROM Customers WHERE customerID = ${req.params.id};`,
        (err, result) => {
            if (err != null) {
                console.log("Could not get customer:", req.params.id);
                console.log(err);
                res.sendStatus(500);
            } else {
                console.log("Retreived Customer:", req.params.id);
                console.log(result);
                res.send(result);
            }
        }
    );
});

// Update
router.post("/update/:id", (req, res) => {
    pool.query(
        `
        UPDATE Customers
        SET firstName = "${req.body.first}",
        lastName = "${req.body.last}",
        email = "${req.body.email}",
        phoneNumber = "${req.body.phone != "0" ? req.body.phone : ""}"
        WHERE customerID = ${req.params.id};`,
        (err, result) => {
            if (err != null) {
                console.log(
                    `Could not update customer ${req.params.id} with:`,
                    req.body
                );
                console.log(err);
            } else {
                console.log("Updated Customer:", req.params.id);
                console.log(result);
                res.sendStatus(200);
            }
        }
    );
});

// Delete
router.post("/delete/:id", (req, res) => {
    pool.query(
        `DELETE FROM Customers WHERE customerID = ${req.params.id};`,
        (err, result) => {
            if (err != null) {
                res.sendStatus(500);
                console.log("Error:", err);
            } else {
                console.log(result);
                res.sendStatus(200);
            }
        }
    );
});

module.exports = router;
