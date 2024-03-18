const express = require("express");
const router = express.Router();

const { root } = require("../scripts/commonRoutes.js");
const {
    handleCreate,
    handleUpdate,
    handleDelete,
} = require("../scripts/queryHandling.js");
const { pool } = require("../db-connector.js");

const title = "Lift Pass Types";

// Object containing display and form data
const obj = {
    liftPassID: {
        display: "ID",
        form: false,
    },
    category: {
        display: "Category",
        filter: true,
        form: true,
        input: {
            type: "text",
            required: "true",
            placeholder: "Category",
        },
        fromTable: undefined,
    },
    listPrice: {
        display: "List Price ($)",
        filter: true,
        form: true,
        input: {
            type: "float",
            required: "true",
            placeholder: "List Price ($)",
            min: "0",
        },
        fromTable: undefined,
    },
};

// Name of the table column containing the ID
const idField = "liftPassID";

// Order for columns to appear, must correlate to keys in obj
const order = ["liftPassID", "category", "listPrice"];

router.use(express.json());

router.get("/", async (req, res) => {
    const filterEnabled = false;

    const query = "SELECT * FROM LiftPassTypes";

    root(res, query, title, obj, idField, order, filterEnabled);
});

// Create
router.post("/create", (req, res) => {
    console.log("Received", req.body);
    pool.query(`INSERT INTO LiftPassTypes (category, listPrice) VALUES
        ("${req.body.category}","${req.body.listPrice}");
        `,
        (err, result) => handleCreate(err, result, req, res)
    );
});

// Read
router.get("/get/:id", (req, res) => {
    const { id } = req.params;
    pool.query("SELECT * FROM LiftPassTypes WHERE liftPassID = ?", [id], (err, result) => {
        if (err) {
            console.error("Could not retrieve transaction:", err);
            return res.status(500).send("Error retrieving transaction");
        }
        res.json(transaction);
    });
});

// Update
router.post("/update/:id", (req, res) => {
    console.log("Received:", req.body);

    pool.query(
        `
        UPDATE LiftPassTypes 
            SET 
                category = "${req.body.category}",
                listPrice = ${req.body.listPrice}
        WHERE liftPassID = ${req.params.id};
        `,
        (err, result) => handleUpdate(err, result, req, res)
    );
});

// Delete
router.post("/delete/:id", (req, res) => {
    pool.query(
        `DELETE FROM LiftPassTypes WHERE liftPassID = ${req.params.id};`,
        (err, result) => handleDelete(err, result, req, res)
    );
});

module.exports = router;