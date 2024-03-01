const express = require("express");
const { pool } = require("./db-connector.js");
const bodyParser = require("body-parser");

// Import routers
const customers = require("./routes/customers.js");

const PORT = 3805;

const app = express();

// Use bodyParser to parse json requests
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`[${req.method}] (${req.ip}): ${req.url}`);
    next();
})

// Serve static files in the public directory
app.use(express.static("public"));

// Use imported routers
app.use("/customers", customers);

// No responses sent; not found
app.use((req, res) => {
    res.sendStatus(404);
})

// Start server
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
    pool.query("show tables", (err, result) => {
        console.log("err:", err);
        console.log("tables:", result);
    });
});
