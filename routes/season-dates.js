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

const title = "Season Dates";

// Object containing display and form data
const obj = {
    seasonDatesID: {
        display: "ID",
        form: false,
    },
    seasonStart: {
        display: "Season Start Date",
        filter: true,
        form: true,
        input: {
            type: "date",
            required: "true",
            placeholder: "Season Start Date",
        },
        fromTable: undefined,
    },
    seasonEnd: {
        display: "Season End Date",
        filter: true,
        form: true,
        input: {
            type: "date",
            required: "true",
            placeholder: "Season End Date",
        },
        fromTable: undefined,
    },
};

// Name of the table column containing the ID
const idField = "seasonDatesID";

// Order for columns to appear, must correlate to keys in obj
const order = ["seasonDatesID", "seasonStart", "seasonEnd"];

// Parse json post requests
router.use(express.json());

router.get("/", async (req, res) => {
    const filterEnabled = false;

    const query = `SELECT * FROM SeasonDates;`;

    root(res, query, title, obj, idField, order, filterEnabled);
});

// Create
router.post("/create", (req, res) => {
    console.log("Received", req.body);
    pool.query(
        `INSERT INTO SeasonDates (seasonStart, seasonEnd) VALUES
            ("${req.body.seasonStart}","${req.body.seasonEnd}");
        `,
        (err, result) => handleCreate(err, result, req, res)
    );
});

// Update
router.post("/update/:id", (req, res) => {
    console.log("Received:", req.body);

    pool.query(
        `
        UPDATE SeasonDates 
            SET 
            seasonStart = "${req.body.seasonStart}",
            seasonEnd = ${req.body.seasonEnd}
        WHERE seasonDatesID = ${req.params.id};
        `,
        (err, result) => handleUpdate(err, result, req, res)
    );
});

// Delete
router.post("/delete/:id", (req, res) => {
    pool.query(
        `DELETE FROM SeasonDates WHERE seasonDatesID = ${req.params.id};`,
        (err, result) => handleDelete(err, result, req, res)
    );
});

module.exports = router;
