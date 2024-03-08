const express = require("express");
const router = express.Router();

const { root } = require("../scripts/commonRoutes.js");
const {
    handleCreate,
    handleUpdate,
    handleDelete,
} = require("../scripts/queryHandling.js");
const { pool } = require("../db-connector.js");

const title = "Customers";

// Object containing display and form data
const obj = {
    customerID: {
        display: "ID",
        form: false,
    },
    firstName: {
        display: "First Name",
        filter: true,
        form: true,
        input: {
            type: "text",
            required: "true",
            placeholder: "First Name",
        },
        fromTable: undefined,
    },
    lastName: {
        display: "Last Name",
        filter: true,
        form: true,
        input: {
            type: "text",
            required: "true",
            placeholder: "Last Name",
        },
        fromTable: undefined,
    },
    email: {
        display: "Email",
        filter: true,
        form: true,
        input: {
            type: "text",
            required: "true",
            placeholder: "Email",
        },
        fromTable: undefined,
    },
    phoneNumber: {
        display: "Phone Number",
        filter: true,
        form: true,
        input: {
            type: "number",
            required: "false",
            placeholder: "Phone Number (Optional)",
            min: "0",
            max: "9999999999",
        },
        // input: "table"
        fromTable: undefined,
    },
};

// Name of the table column containing the ID
const idField = "customerID";

// Order for columns to appear, must correlate to keys in obj
const order = ["customerID", "firstName", "lastName", "email", "phoneNumber"];

// Parse json post requests
router.use(express.json());

router.get("/", async (req, res) => {
    const filterEnabled = true;

    // const query = "select * from Customers";
    const query = `
        SELECT * FROM Customers WHERE
            (${
                req.query.firstName == undefined || req.query.firstName == ""
                    ? "NULL"
                    : `\"${req.query.firstName}\"`
            } IS NULL OR firstName like ${`\"${req.query.firstName}\"`}
                ) AND
            (${
                req.query.lastName == undefined || req.query.lastName == ""
                    ? "NULL"
                    : `\"${req.query.lastName}\"`
            } IS NULL OR lastName like ${`\"${req.query.lastName}\"`}
                ) AND
            (${
                req.query.email == undefined || req.query.email == ""
                    ? "NULL"
                    : `\"${req.query.email}\"`
            } IS NULL OR email = ${`\"${req.query.email}\"`}
                ) AND
            (${
                req.query.phoneNumber == undefined ||
                req.query.phoneNumber == ""
                    ? "NULL"
                    : `\"${req.query.phoneNumber}\"`
            } IS NULL OR phoneNumber = ${`\"${req.query.phoneNumber}\"`}
                )
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
        (err, result) => handleCreate(err, result, req, res)
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
