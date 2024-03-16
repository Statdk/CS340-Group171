const ejs = require("ejs");
const { pool } = require("../db-connector.js");

const fs = require('fs');       //TEMP
const path = require('path');   //TEMP
const logFilePath = path.join("\./", 'debug.log');  //TEMP


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
        if (err) {
            console.log("Error:", err);
            return res.sendStatus(500);
        } 
        
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


        const additionalData = {};
        // Sequentially fetch additional data
        for (const field of order) {
            fs.appendFileSync(logFilePath, '\n'+'-'+field);
            if (obj[field].join && obj[field].join.fromTable) {
                fs.appendFileSync(logFilePath, ' joining now...');
                if (obj[field].join.joinCustom) {       // Handle custom join
                    const customQuery = obj[field].join.joinCustom;
                    const customResults = await executeCustomQuery(customQuery);
                    additionalData[field] = customResults;
                    fs.appendFileSync(logFilePath, ' (customResults): ' + JSON.stringify(additionalData[field], null, 2) + '\n');
                } else {       // Handle easy-format custom join
                    const tableName = obj[field].join.fromTable;
                    const joinOn = obj[field].join.joinOn;
                    const joinWith = Array.isArray(obj[field].join.joinWith) ? obj[field].join.joinWith.join(", ") : obj[field].join.joinWith;
            
                    const query = `SELECT ${joinOn}, ${joinWith} FROM ${tableName}`;
            
                    // Fetch data synchronously within the async function
                    const fetchData = await new Promise((resolve, reject) => {
                        pool.query(query, (error, data) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(data);
                            }
                        });
                    });
                    additionalData[field] = fetchData;
                    fs.appendFileSync(logFilePath, ' (fetchData): ' + JSON.stringify(additionalData[field], null, 2) + '\n');
                }
            }
        }

        // Render the table
        let table = await ejs.renderFile("views/table.ejs", {
            data: {
                header: header,
                entries: modifiedResults,
                order: order,
                idField: idField,
                additionalData: additionalData,
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
                additionalData: additionalData,
            },
        });

        // Render the update form
        let formUpdate = await ejs.renderFile("views/form-update.ejs", {
            data: {
                title: title,
                header: header,
                form: obj,
                order: order,
                additionalData: additionalData,
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
    });
}

async function executeCustomQuery(query) {
    return new Promise((resolve, reject) => {
        pool.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

module.exports = { root, formatDateToYYYYMMDD };
