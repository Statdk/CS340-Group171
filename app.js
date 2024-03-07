const express = require("express");
const fs = require("fs");
const path = require("path");

const { pool } = require("./db-connector.js");

// Import routers
const customers = require("./routes/customers.js");
const rentalTransactions = require("./routes/rental-transactions.js");
const items = require("./routes/items.js");
const rentalItems = require("./routes/rental-items.js");

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
app.use("/rental-transactions", rentalTransactions);
app.use("/items", items);
app.use("/rental-items", rentalItems);

// Reset the database
app.post("/reset", (req, res) => {
    fs.readFile("./db/DDL.sql", async (err, data) => {
        let query = data.toString();
        let promises = [];

        query.split(";").forEach((line, i) => {
            // console.log("line:", line);
            let promise = new Promise((resolve) =>
                setTimeout(() => {
                    console.log("Sent line", i);
                    pool.query(line, (err, result) => {
                        if (err != null) {
                            // res.sendStatus(500);
                            console.log("Error resetting DB:", err);
                            resolve();
                        } else {
                            // res.sendStatus(200);
                            console.log("Reset DB:", result);
                            resolve();
                        }
                    });
                }, 100 * i)
            );
            promises.push(promise);
        });

        await Promise.allSettled(promises);
        res.sendStatus(200);
    });
});

// No responses sent; not found
app.use((req, res) => {
    console.log("[Not Found]:", req.url);
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
