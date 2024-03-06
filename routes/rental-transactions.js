const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const ejs = require("ejs");

// helper func to format saleDate to YYYY-MM-DD
function formatDateToYYYYMMDD(date) { return date.toISOString().split('T')[0]; }

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
        },
        fromTable: undefined,
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
    rentalDuration: {
        display: "Duration",
        filter: true,
        form: true,
        input: {
            type: "number",
            required: "true",
            placeholder: "Rental Duration (days)",
        },
        fromTable: undefined,
    },
};

// Name of the table column containing the ID
const idField = "transactionID";

// Order for columns to appear, must correlate to keys in obj
const order = ["transactionID", "customerID", "discountID", "saleDate", "rentalDuration"];

router.use(bodyParser.json());

router.get("/", async (req, res) => {
    console.log("Accessing /rental-transactions");

    pool.query("select * from RentalTransactions", async (err, result) => {
        if (err != null) {
            console.log("Error:", err);
            res.sendStatus(500);
        } else {
            console.log("Retrieved:", result);

            // Format saleDate for each entry in result
            const formattedResult = result.map(entry => ({
                ...entry,
                saleDate: formatDateToYYYYMMDD(new Date(entry.saleDate)) // format saleDate to YYYY-MM-DD
            }));
            
            let header = [];
            for (const title of order) {
                header.push(obj[title].display);
            }

            let table = await ejs.renderFile("views/table.ejs", {
                data: {
                    header: header,
                    entries: formattedResult, // formattedResult here for datetime formatting
                    order: order,
                    idField: idField,
                },
            });

            let filter = await ejs.renderFile("views/filter.ejs", {
                data: {
                    header: header,
                    form: obj,
                    order: order,
                },
            });

            let formAdd = await ejs.renderFile("views/form-add.ejs", {
                data: {
                    title: title,
                    header: header,
                    form: obj,
                    order: order,
                },
            });

            let formUpdate = await ejs.renderFile("views/form-edit.ejs", {
                data: {
                    title: title,
                    header: header,
                    form: obj,
                    order: order,
                },
            });

            let page = await ejs.renderFile("views/view-table.ejs", {
                data: {
                    title: title,
                    html: {
                        table: table,
                        filter: filter,
                        formAdd: formAdd,
                        formUpdate: formUpdate,
                    },
                },
            });

            res.send(page);
        }
    });
});

// Get table
// router.get("/table", (req, res) => {
// pool.query("select * from Customers", (err, result) => {
//     if (err != null) {
//         res.sendStatus(500);
//         console.log("Error:", err);
//     } else {
//         console.log("Retrieved:", result);
//         res.render("customers-table", { customers: result });
//     }
// });
// });

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

    const updateQuery = `UPDATE RentalTransactions SET customerID = ?, discountID = ?, saleDate = ?, rentalDuration = ? WHERE transactionID = ?`;

    pool.query(updateQuery, [customerID, discountID || null, saleDate, rentalDuration, id], (err, result) => {
        if (err) {
            console.error(`Could not update transaction ${id}:`, err);
            return res.status(500).send("Error updating transaction");
        }
        console.log("Updated transaction:", result);
        res.redirect("/rental-transactions");
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