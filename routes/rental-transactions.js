const express = require("express");
const router = express.Router();

const { root, formatDateToYYYYMMDD } = require("../scripts/commonRoutes.js");
const {
    handleCreate,
    handleUpdate,
    handleDelete,
} = require("../scripts/queryHandling.js");
const { pool } = require("../db-connector.js");

const title = "Rental Transactions";

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
    },
    discountID: {
        display: "Discount ID",
        filter: true,
        form: true,
        input: {
            type: "text",
            required: "false",
            placeholder: "Discount ID",
        },
        join: {
            fromTable: "Discounts",
            joinWith: ["discountID", "discountType"],
            joinOn: "discountID",
        },
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
    rentalDuration: {
        display: "Duration",
        filter: true,
        form: true,
        input: {
            type: "number",
            required: "true",
            placeholder: "Rental Duration (days)",
            min: "0",
        },
        fromTable: undefined,
    },
};

// Name of the table column containing the ID
const idField = "transactionID";

// Order for columns to appear, must correlate to keys in obj
const order = ["transactionID", "customerID", "discountID", "saleDate", "rentalDuration"];

router.use(express.json());

router.get("/", async (req, res) => {
    console.log("Accessing /rental-transactions");
    const filterEnabled = true;
    
    // const query = "SELECT * FROM RentalTransactions;";
    const query = `
        SELECT *
        FROM RentalTransactions
        WHERE 
            (${
                req.query.customerID == undefined || req.query.customerID == ""
                    ? "NULL IS NULL"
                    : `customerID = ${req.query.customerID}`
            }
                ) AND
            (${
                req.query.discountID == undefined || req.query.discountID == ""
                    ? "NULL IS NULL"
                    : `discountID = ${req.query.discountID}`
            }
                ) AND
            (${
                req.query.saleDate == undefined || req.query.saleDate == ""
                    ? "NULL IS NULL"
                    : `saleDate = \"${formatDateToYYYYMMDD(req.query.saleDate)}\"`
            }
                ) AND
            (${
                req.query.rentalDuration == undefined || req.query.rentalDuration == ""
                    ? "NULL IS NULL"
                    : `saleDate = ${req.query.rentalDuration}`
            }
                )
    `;
    root(res, query, title, obj, idField, order, filterEnabled);    
});

// CREATE
router.post("/create", (req, res) => {
    console.log("Received", req.body);
    const { customerID, discountID, saleDate, rentalDuration} = req.body;
    const insertQuery = `INSERT INTO RentalTransactions (customerID, discountID, saleDate, rentalDuration) VALUES (?, ?, ?, ?)`;

    pool.query(insertQuery, [customerID, discountID || null, saleDate, rentalDuration], (err, result) => {
        if (err) {
            console.error("Could not create entry:", err);
            return res.status(500).send("Could not create entry");
        }
        console.log("Created entry:", result);
        res.redirect("/rental-transactions");
    });
});

// READ - Adjusted to retrieve a single rental transaction
router.get("/get/:id", (req, res) => {
    const { id } = req.params;
    pool.query("SELECT * FROM RentalTransactions WHERE transactionID = ?", [id], (err, result) => {
        if (err) {
            console.error("Could not retrieve transaction:", err);
            return res.status(500).send("Error retrieving transaction");
        }
        res.json(transaction);
    });
});

// UPDATE - Setup for receiving update form data and updating the database
router.post("/update/:id", (req, res) => {
    const { id } = req.params;
    const { customerID, discountID, saleDate, rentalDuration } = req.body;
    // discountID = discountID ? discountID : null;

    const formattedSaleDate = formatDateToYYYYMMDD(req.body.saleDate);

    const updateQuery = `
    UPDATE RentalTransactions 
    SET 
        customerID = ?,
        discountID = ?,
        saleDate = ?,
        rentalDuration = ?
    WHERE transactionID = ?;
    `;

    pool.query(updateQuery, [customerID, discountID || null, formattedSaleDate, rentalDuration, id], (err, result) => {
        if (err) {
            console.error("Error updating Rental Transactions:", err);
            return res.status(500).send("Error updating Rental Transactions");
        }
        res.redirect("/rental-transactions");  //refresh
    });
});

// DELETE
router.post("/delete/:id", (req, res) => {
    const { id } = req.params;
    pool.query("DELETE FROM RentalTransactions WHERE transactionID = ?", [id], (err, result) => {
        if (err) {
            console.error("Error deleting transaction:", err);
            return res.status(500).send("Error deleting transaction");
        }
        console.log("Deleted transaction:", result);
        res.sendStatus(200);
    });
});

module.exports = router;