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
        join: {
            fromTable: "Customers",
            joinCustom: "SELECT rt.transactionID, c.firstName, c.lastName FROM RentalTransactions ri JOIN RentalTransactions rt ON ri.transactionID = rt.transactionID JOIN Customers c ON rt.customerID = c.customerID WHERE ri.transactionID = rt.transactionID;",
        },
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
        join: {
            fromTable: "Items",
            joinWith: ["itemID", "itemName", "size"],
            joinOn: "itemID",
            appendUnit: "cm",
        },
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
        `
        INSERT INTO RentalItems (transactionID, itemID, quantityRented) VALUES
            (
                ${req.body.transactionID},
                ${req.body.itemID},
                ${req.body.quantityRented});
        `,
        (err, result) => handleCreate(err, result, req, res)
    );
});

// Update
router.post("/update/:id", (req, res) => {
    console.log("Received:", req.body);

    pool.query(
        `
        UPDATE RentalItems
            SET 
                transactionID = ${req.body.transactionID},
                itemID = ${req.body.itemID},
                quantityRented = ${req.body.quantityRented}
        WHERE rentalID = ${req.params.id};
        `,
        (err, result) => handleUpdate(err, result, req, res)
    );
});

// Delete
router.post("/delete/:id", (req, res) => {
    pool.query(
        `DELETE FROM RentalItems WHERE rentalID = ${req.params.id};`,
        (err, result) => handleDelete(err, result, req, res)
    );
});

module.exports = router;
