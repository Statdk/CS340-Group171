const express = require("express");
const router = express.Router();

const { root } = require("../scripts/commonRoutes.js");
const {
    handleCreate,
    handleUpdate,
    handleDelete,
} = require("../scripts/queryHandling.js");
const { pool } = require("../db-connector.js");

// helper func to format 0.XX to XX%
// function formatFloatToPercent(floatValue) { return `${(floatValue * 100).toFixed(2)}%`; }

const title = "Discounts";

// Object containing display and form data
const obj = {
    discountID: {
        display: "ID",
        form: false,
    },
    discountType: {
        display: "Discount Type",
        filter: true,
        form: true,
        input: {
            type: "text",
            required: "true",
            placeholder: "Discount Type",
        },
        fromTable: undefined,
    },
    discountPercentage: {
        display: "Discount Percentage",
        filter: true,
        form: true,
        input: {
            type: "float",
            required: "true",
            placeholder: "Discount Percentage (0.XX)",
            pattern: "0+\.+[0-9]{2}",
            max: "1",
        },
        fromTable: undefined,
    },
};

// Name of the table column containing the ID
const idField = "discountID";

// Order for columns to appear, must correlate to keys in obj
const order = ["discountID", "discountType", "discountPercentage"];

// Parse json post requests
router.use(express.json());

router.get("/", async (req, res) => {
    const filterEnabled = false;

    const query = `SELECT * FROM Discounts;`;

    root(res, query, title, obj, idField, order, filterEnabled);
});

// Create
router.post("/create", (req, res) => {
    console.log("Received", req.body);
    pool.query(
        `INSERT INTO Discounts (discountType, discountPercentage) VALUES
            ("${req.body.discountType}","${req.body.discountPercentage}");
        `,
        (err, result) => handleCreate(err, result, req, res)
    );
});

// Update
router.post("/update/:id", (req, res) => {
    console.log("Received:", req.body);

    pool.query(
        `
        UPDATE Discounts 
            SET 
                discountType = "${req.body.discountType}",
                discountPercentage = ${req.body.discountPercentage}
        WHERE discountID = ${req.params.id};
        `,
        (err, result) => handleUpdate(err, result, req, res)
    );
});

// Delete
router.post("/delete/:id", (req, res) => {
    pool.query(
        `DELETE FROM Discounts WHERE discountID = ${req.params.id};`,
        (err, result) => handleDelete(err, result, req, res)
    );
});

module.exports = router;
