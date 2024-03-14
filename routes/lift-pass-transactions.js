const express = require("express");
const router = express.Router();

const { root } = require("../scripts/commonRoutes.js");
const {
    handleCreate,
    handleUpdate,
    handleDelete,
} = require("../scripts/queryHandling.js");
const { pool } = require("../db-connector.js");

// helper func to format saleDate to YYYY-MM-DD
function formatDateToYYYYMMDD(date) { return date.toISOString().split('T')[0]; }

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
    pool.query(query, async (err, results) => {
        // if (err) {
        //     console.log("Error:", err);
        //     return res.sendStatus(500);
        // }
        const formattedResults = results.map(result => ({
            ...result,
            liftPassID: formatDateToYYYYMMDD(new Date(result.liftPassID)),
        }));
        root(res, query, title, obj, idField, order, filterEnabled);
    });
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
    pool.query(
        `
        UPDATE LiftPassTransactions 
            SET 
            customerID = "${req.body.customerID}",
            seasonDatesID = "${req.body.seasonDatesID}",
            liftPassID = "${req.body.liftPassID}",
            saleDate = "${req.body.saleDate}"
        WHERE transactionID = ${req.params.id};
        `,
        (err, result) => handleUpdate(err, result, req, res)
    );
});

// Delete
router.post("/delete/:id", (req, res) => {
    pool.query(
        `DELETE FROM LiftPassTransactions WHERE transactionID = ${req.params.id};`,
        (err, result) => handleDelete(err, result, req, res)
    );
});

module.exports = router;