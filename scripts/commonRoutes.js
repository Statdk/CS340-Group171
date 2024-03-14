const ejs = require("ejs");
const { pool } = require("../db-connector.js");

function formatDateToYYYYMMDD(dateStr) {
    const date = new Date(dateStr);
    // Check if the date is valid
    if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
    } else {
        // Date is invalid, return original string
        return dateStr;
    }
}


function root(res, query, title, obj, idField, order, filterEnabled) {
    pool.query(query, async (err, result) => {
        if (err != null) {
            console.log("Error:", err);
            res.sendStatus(500);
        } else {
            console.log(`Retrieved ${result.length} entries`);

            // Modify results to format date feilds to YYYY-MM-DD
            const modifiedResults = result.map(entry => {
                let modifiedEntry = { ...entry };
                for (const field of order) {
                    if (obj[field].input && obj[field].input.type === "date" && modifiedEntry[field]) {
                        modifiedEntry[field] = formatDateToYYYYMMDD(new Date(modifiedEntry[field]));
                    }
                }
                return modifiedEntry;
            });

            // Assemble the table header
            let header = [];
            for (const title of order) {
                header.push(obj[title].display);
            }

            // Render the table
            let table = await ejs.renderFile("views/table.ejs", {
                data: {
                    header: header,
                    entries: modifiedResults,
                    order: order,
                    idField: idField,
                },
            });

            // If we have a filter, render it
            let filter;
            if (filterEnabled) {
                filter = await ejs.renderFile("views/filter.ejs", {
                    data: {
                        header: header,
                        form: obj,
                        order: order,
                    },
                });
            } else {
                filter = "";
            }

            // Render the add form
            let formAdd = await ejs.renderFile("views/form-add.ejs", {
                data: {
                    title: title,
                    header: header,
                    form: obj,
                    order: order,
                },
            });

            // Render the update form
            let formUpdate = await ejs.renderFile("views/form-update.ejs", {
                data: {
                    title: title,
                    header: header,
                    form: obj,
                    order: order,
                },
            });

            // Render the collection
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

            // Send it
            res.send(page);
        }
    });
}

module.exports = { root, formatDateToYYYYMMDD };
