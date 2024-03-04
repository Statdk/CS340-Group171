const express = require("express");
const fs = require("fs");
const path = require("path");

const { pool } = require("./db-connector.js");

// Import routers
const customers = require("./routes/customers.js");

const PORT = 3805;

const app = express();

// Parse json post requests
app.use(express.json());
// Parse get data encoded in url
app.use(express.urlencoded({ extended: false }));

// Views set up
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Log access to the server
app.use((req, res, next) => {
    console.log(`[${req.method}] (${req.ip}): ${req.url}`);
    next();
});

// Serve static files in the public directory
app.use(express.static("public"));

// Use imported routers
app.use("/customers", customers);

// Reset the database
app.post("/reset", (req, res) => {
    fs.readFile("./db/DDL.sql", (err, data) => {
        let query = data.toString();

        // this needs CHANGED, I *HATE* this
        // Sending the .sql file line by line so it
        // doesn't take thirty years is aweful
        query.split(";").forEach((line) => {
            // console.log("line:", line);
            pool.query(line, (err, result) => {
                if (err == null) {
                    // res.sendStatus(500);
                    console.log("Error resetting DB:", err);
                } else {
                    // res.sendStatus(200);
                    console.log("Reset DB:", result);
                }
            });
        });
        res.sendStatus(200);
    });
});

// No responses sent; not found
app.use((req, res) => {
    res.sendStatus(404);
});

// Start server
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
    pool.query("show tables", (err, result) => {
        console.log("err:", err);
        console.log("tables:", result);
    });
});
