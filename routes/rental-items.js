const express = require("express");
const router = express.Router();

const { root } = require("../scripts/commonRoutes.js");
const {
    handleCreate,
    handleUpdate,
    handleDelete,
} = require("../scripts/queryHandling.js");
const { pool } = require("../db-connector.js");

const title = "Rental Items";

// Object containing display and form data
const obj = {
    rentalID: {
        display: "ID",
        form: false,
    },
    transactionID: {
        display: "Transaction ID",
        filter: true,
        form: true,
        input: {
            type: "number",
            required: "true",
            placeholder: "Transaction ID",
        },
        /**
         * input: {
         *  type: "option",
         *  required: "true",
         * }
         */
        fromTable: undefined,
        // fromTable should be a table name we can give a route to (e.g. /customers/option)
        //  but this is not implemented
    },
    itemID: {
        display: "Item ID",
        filter: true,
        form: true,
        input: {
            type: "number",
            required: "true",
            placeholder: "Item ID",
        },
        fromTable: undefined,
    },
    quantityRented: {
        display: "Quantity Rented",
        filter: true,
        form: true,
        input: {
            type: "number",
            required: "true",
            placeholder: "Quantity Rented",
        },
        fromTable: undefined,
    },
};

// Name of the table column containing the ID
const idField = "rentalID";

// Order for columns to appear, must correlate to keys in obj
const order = ["rentalID", "transactionID", "itemID", "quantityRented"];

// Parse json post requests
router.use(express.json());

router.get("/", async (req, res) => {
    const filterEnabled = false;

    // const query = "select * from Customers";
    const query = `
        SELECT * FROM RentalItems;
    `;

    root(res, query, title, obj, idField, order, filterEnabled);
});

// Create
router.post("/create", (req, res) => {
    console.log("Received", req.body);
    pool.query(
        `INSERT INTO Customers (firstName, lastName, email, phoneNumber) VALUES
    ("${req.body.firstName}", "${req.body.lastName}", "${req.body.email}", "${req.body.phoneNumber}");
    `,
        (err, result) => handleCreate(err, result, res)
    );
});

// Update
router.post("/update/:id", (req, res) => {
    console.log("Received:", req.body);

    pool.query(
        `
        UPDATE Customers
        SET
            firstName = "${req.body.firstName}",
            lastName = "${req.body.lastName}",
            email = "${req.body.email}",
            phoneNumber = "${
                req.body.phoneNumber != "0" ? req.body.phoneNumber : ""
            }"
        WHERE customerID = ${req.params.id};`,
        (err, result) => handleUpdate(err, result, req, res)
    );
});

// Delete
router.post("/delete/:id", (req, res) => {
    pool.query(
        `DELETE FROM Customers WHERE customerID = ${req.params.id};`,
        (err, result) => handleDelete(err, result, req, res)
    );
});

module.exports = router;
