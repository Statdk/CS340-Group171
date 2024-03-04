const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const ejs = require("ejs");

const { pool } = require("../db-connector.js");

// Mapping of sql table columns to readable names
const nameMap = {
    customerID: "ID",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phoneNumber: "phone",
};

// Order for columns to appear
const order = ["customerID", "firstName", "lastName", "email", "phoneNumber"];

router.use(bodyParser.json());

router.get("/", async (req, res) => {
    // res.sendFile("customers.html", { root: "./public" });

    // Get sql table data
    let entries = [
        {
            // Sample entry data
            customerID: 2,
            firstName: "Foo",
            lastName: "Bar",
            email: "email@email.com",
            phoneNumber: "1231231234",
        },
    ];

    let header = [];
    for (const title of order) {
        header.push(nameMap[title]);
    }

    let table = await ejs.renderFile("views/table.ejs", {
        data: {
            header: header,
            entries: entries, // Sql table data here
            order: order,
        },
    });

    let filter = await ejs.renderFile("views/filter.ejs", {});
    let formAdd = await ejs.renderFile("views/form-add.ejs", {});

    let page = await ejs.renderFile("views/view-table.ejs", {});
});

// Get table
// router.get("/table", (req, res) => {
//     pool.query("select * from Customers", (err, result) => {
//         if (err != null) {
//             res.sendStatus(500);
//             console.log("Error:", err);
//         } else {
//             console.log("Retrieved:", result);
//             res.render("customers-table", { customers: result });
//         }
//     });
// });

// Create
router.post("/create", (req, res) => {
    pool.query(
        `INSERT INTO Customers (firstName, lastName, email, phoneNumber) VALUES
    ("${req.body.first}", "${req.body.last}", "${req.body.email}", "${req.body.phone}");
    `,
        (err, result) => {
            if (err != null) {
                console.log("Could not create entry with:", req.body);
                console.log(err);
                res.sendStatus(500);
            } else {
                console.log("Created entry:", result);
                res.sendStatus(200);
            }
        }
    );
});

// Read
router.get("/get/:id", (req, res) => {
    pool.query(
        `SELECT * FROM Customers WHERE customerID = ${req.params.id};`,
        (err, result) => {
            if (err != null) {
                console.log("Could not get customer:", req.params.id);
                console.log(err);
                res.sendStatus(500);
            } else {
                console.log("Retreived Customer:", req.params.id);
                console.log(result);
                res.send(result);
            }
        }
    );
});

// Update
router.post("/getEdit/:id", (req, res) => {});
router.post("/edit/:id", (req, res) => {});
// router.post("/update/:id", (req, res) => {
//     pool.query(
//         `
//         UPDATE Customers
//         SET firstName = "${req.body.first}",
//         lastName = "${req.body.last}",
//         email = "${req.body.email}",
//         phoneNumber = "${req.body.phone != "0" ? req.body.phone : ""}"
//         WHERE customerID = ${req.params.id};`,
//         (err, result) => {
//             if (err != null) {
//                 console.log(
//                     `Could not update customer ${req.params.id} with:`,
//                     req.body
//                 );
//                 console.log(err);
//             } else {
//                 console.log("Updated Customer:", req.params.id);
//                 console.log(result);
//                 res.sendStatus(200);
//             }
//         }
//     );
// });

// Delete
router.post("/delete/:id", (req, res) => {
    pool.query(
        `DELETE FROM Customers WHERE customerID = ${req.params.id};`,
        (err, result) => {
            if (err != null) {
                res.sendStatus(500);
                console.log("Error:", err);
            } else {
                console.log(result);
                res.sendStatus(200);
            }
        }
    );
});

module.exports = router;
