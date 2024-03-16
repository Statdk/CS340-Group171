const express = require("express");
const router = express.Router();

const { root, formatDateToYYYYMMDD } = require("../scripts/commonRoutes.js");
const {
    handleCreate,
    handleUpdate,
    handleDelete,
} = require("../scripts/queryHandling.js");
const { pool } = require("../db-connector.js");

const title = "Lift Pass Transactions";

// Object containing display and form data
const obj = {
    transactionID: {
        display: "ID",
        form: false,
    },
    customerID: {
        display: "Customer ID",
        filter: true,
        form: true,
        input: {
            type: "number",
            required: "true",
            placeholder: "Customer ID",
            min: "0",
        },
        join: {
            fromTable: "Customers",
            joinWith: ["customerID", "firstName", "lastName"],
            joinOn: "customerID",
        },
        fromTable: undefined,
    },
    seasonDatesID: {
        display: "Season Dates ID",
        filter: true,
        form: true,
        input: {
            type: "number",
            required: "true",
            placeholder: "Season Dates ID",
            min: "0",
        },
        join: {
            fromTable: "SeasonDates",
            joinWith: ["seasonDatesID"],
            joinOn: "seasonDatesID",
        },
        fromTable: undefined,
    },
    liftPassID: {
        display: "Lift Pass ID",
        filter: true,
        form: true,
        input: {
            type: "number",
            required: "true",
            placeholder: "Lift Pass ID",
            min: "0",
        },
        join: {
            fromTable: "LiftPassTypes",
            joinWith: ["liftPassID", "Category"],
            joinOn: "liftPassID",
        },
        fromTable: undefined,
    },
    saleDate: {
        display: "Sale Date",
        filter: true,
        form: true,
        input: {
            type: "date",
            required: "true",
            placeholder: "Sale Date",
        },
        fromTable: undefined,
    },
};

// Name of the table column containing the ID
const idField = "transactionID";

// Order for columns to appear, must correlate to keys in obj
const order = ["transactionID", "customerID", "seasonDatesID", "liftPassID", "saleDate"];

router.use(express.json());

router.get("/", async (req, res) => {
    const filterEnabled = true;

    const query = "SELECT * FROM LiftPassTransactions";
    root(res, query, title, obj, idField, order, filterEnabled);
});

// CREATE
router.post("/create", (req, res) => {
    console.log("Received", req.body);
    const { customerID, seasonDatesID, liftPassID, saleDate} = req.body;
    const insertQuery = `INSERT INTO LiftPassTransactions (customerID, seasonDatesID, liftPassID, saleDate) VALUES (?, ?, ?, ?)`;

    pool.query(insertQuery, [customerID, seasonDatesID || null, liftPassID, saleDate], (err, result) => {
        if (err) {
            console.error("Could not create entry:", err);
            return res.status(500).send("Could not create entry");
        }
        console.log("Created entry:", result);
        res.redirect("/lift-pass-transactions");
    });
});

// Create
router.post("/create", (req, res) => {
    console.log("Received", req.body);
    pool.query(
        `INSERT INTO LiftPassTransactions (customerID, seasonDatesID, liftPassID, saleDate) VALUES
            ("${req.body.customerID}","${req.body.seasonDatesID}","${req.body.liftPassID}","${req.body.saleDate}");
        `,
        (err, result) => handleCreate(err, result, req, res)
    );
});

// READ - Adjusted to retrieve a single lift pass transaction
router.get("/get/:id", (req, res) => {
    const { id } = req.params;
    pool.query(
        `SELECT * FROM LiftPassTransactions WHERE transactionID = ${req.params.id}"
        `,
        (err, result) => res.json(transaction)
    );
});

// Update
router.post("/update/:id", (req, res) => {
    console.log("Received:", req.body);

    const formattedSaleDate = formatDateToYYYYMMDD(req.body.saleDate);

    const updateQuery = `
    UPDATE LiftPassTransactions 
    SET 
        customerID = ?,
        seasonDatesID = ?,
        liftPassID = ?,
        saleDate = ?
    WHERE transactionID = ?;
    `;

    pool.query(updateQuery, [req.body.customerID, req.body.seasonDatesID, req.body.liftPassID, formattedSaleDate, req.params.id], (err, result) => {
        if (err) {
            console.error("Error updating Lift Pass Transactions:", err);
            return res.status(500).send("Error updating Lift Pass Transactions");
        }
        res.redirect("/lift-pass-transactions");  //refresh
    });
});

// Delete
router.post("/delete/:id", (req, res) => {
    pool.query(
        `DELETE FROM LiftPassTransactions WHERE transactionID = ${req.params.id};`,
        (err, result) => handleDelete(err, result, req, res)
    );
});

module.exports = router;