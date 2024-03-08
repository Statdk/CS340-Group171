const express = require("express");
const router = express.Router();

const { root } = require("../scripts/commonRoutes.js");
const {
    handleCreate,
    handleUpdate,
    handleDelete,
} = require("../scripts/queryHandling.js");
const { pool } = require("../db-connector.js");

const title = "Items";

// Object containing display and form data
const obj = {
    itemID: {
        display: "ID",
        form: false,
    },
    itemName: {
        display: "Item Name",
        filter: true,
        form: true,
        input: {
            type: "text",
            required: "true",
            placeholder: "Item Name",
        },
    },
    quantityOwned: {
        display: "Quantity Owned",
        filter: true,
        form: true,
        input: {
            type: "number",
            required: "true",
            placeholder: "Quantity Owned",
        },
    },
    size: {
        display: "Size (cm)",
        filter: true,
        form: true,
        input: {
            type: "number",
            required: "true",
            placeholder: "Size (cm)",
            min: "0",
        },
    },
    listPrice: {
        display: "List Price",
        filter: true,
        form: true,
        input: {
            type: "float",
            required: "true",
            placeholder: "List Price",
            min: "0",
        },
    },
};

// Name of the table column containing the ID
const idField = "itemID";

// Order for columns to appear, must correlate to keys in obj
const order = ["itemID", "itemName", "quantityOwned", "size", "listPrice"];

// Parse json post requests
router.use(express.json());

router.get("/", async (req, res) => {
    const filterEnabled = false;

    const query = "select * from Items";

    root(res, query, title, obj, idField, order, filterEnabled);
});

// Create
router.post("/create", (req, res) => {
    console.log("Received", req.body);
    pool.query(
        `
        INSERT INTO Items (itemName, quantityOwned, size, listPrice) VALUES
            (
                "${req.body.itemName}",
                ${req.body.quantityOwned},
                ${req.body.size},
                ${req.body.listPrice});
        `,
        (err, result) => handleCreate(err, result, req, res)
    );
});

// Update
router.post("/update/:id", (req, res) => {
    console.log("Received:", req.body);

    pool.query(
        `
        UPDATE Items
            SET 
                itemName = "${req.body.itemName}",
                quantityOwned = ${req.body.quantityOwned}, 
                size = ${req.body.size}, 
                listPrice = ${req.body.listPrice}
        WHERE itemID = ${req.params.id};
        `,
        (err, result) => handleUpdate(err, result, req, res)
    );
});

// Delete
router.post("/delete/:id", (req, res) => {
    pool.query(
        `DELETE FROM Items WHERE itemID = ${req.params.id};`,
        (err, result) => handleDelete(err, result, req, res)
    );
});

module.exports = router;
