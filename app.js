const express = require("express");
const { pool } = require("./db-connector.js");
const bodyParser = require("body-parser");

// Import routers
const customers = require("./routes/customers.js");

const PORT = 3000;

const app = express();

// Use bodyParser to parse json requests
app.use(bodyParser.json());

// Serve static files in the public directory
app.use(express.static("public"));

// Use imported routers
app.use("/customers", customers);

// Set the server to listen
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
