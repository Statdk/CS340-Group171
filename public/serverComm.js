/**
 * All of these functions use the browser's url to route properly.
 * Page links will need to have the ".html" extension removed.
 *  (e.g. "HOSTNAME/customers" instead of "HOSTNAME/customers.html")
 */

/**
 * @brief Function to instruct server to reset the whole database.
 *
 * Use sparingly or we will get rate limited,
 *  due mostly to how the DDL.sql is handled by the sql library.
 */
function reset() {
    fetch("/reset", {
        method: "post",
    })
        .then(
            (res) => {
                if (res.status == 200) {
                    console.log("Successfully reset database");
                    setTimeout(() => {
                        resetTable();
                    }, 2000);
                } else {
                    console.log("Could not reset DB code:", res.status);
                }
            },
            (err) => {
                console.error("Could not reset DB:", err);
            }
        )
        .catch((err) => {
            console.error("Fetch error:", err);
        });
}

/**
 * @brief Asks the server to render a new table, then replace the document's
 *  table (possesing the id "table") with the response.
 */
// function resetTable() {
//     let table = document.getElementById("table");
//     fetch(document.URL + "/table", {
//         method: "get",
//     })
//         .then((res) => res.text())
//         .then((html) => {
//             table.innerHTML = html;
//         });
// }

/**
 * @brief Gets a specific record's data and calls callback on it.
 *
 * @param {Number} id ID of record to get
 * @param {function( [{}] )} callback Function to call.
 *  arg0 is an array of len 1 containing an object
 */
function getByID(id, callback) {
    fetch(document.URL + `/get/${id}`, {
        method: "get",
    })
        .then((res) => res.json())
        .then((data) => {
            callback(data);
        })
        .catch((err) => {
            console.error("Fetch err:", err);
        });
}

/**
 * @brief Creates a record for the current table
 *
 * @param {{}} data data to use in record creation
 */
function create(data) {
    fetch(document.URL + "/create", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => {
            if (res.status == 200) {
                console.log("Created entry");
                resetTable();
                document.getElementById("addForm").classList.add("hidden");
            } else {
                console.log("Could not add entry:", res.status);
            }
        })
        .catch((err) => {
            console.error("Fetch error:", err);
        });
}

/**
 * @brief Like create(), but takes an id to replace an entry instead of create one
 * @param {Number} id ID of record to replace
 * @param {{}} data Data to use in record
 */
function update(id, data) {
    console.log(id);
    console.log(data);

    fetch(document.URL + `/update/${id}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => {
            if (res.status == 200) {
                console.log("Updated entry", id);
                resetTable();
                document.getElementById("updateForm").classList.add("hidden");
            } else {
                console.error(`Could not update entry ${id} with:`, data);
            }
        })
        .catch((err) => {
            console.error("Fetch error:", err);
        });
}

/**
 * @brief Deletes a record by ID
 *
 * @param {Number} id Record ID to delete
 */
function deleteLine(id) {
    fetch(document.URL + `/delete/${id}`, {
        method: "post",
    }).then((res) => {
        if (res.status == 200) {
            console.log("Deleted", id);
            window.location.reload();
        } else {
            console.log("Unable to delete", id);
            alert(
                `Unable to delete object with id ${id}, server code ${res.status}`
            );
        }
    });
}

function showAdd() {
    document.getElementById("addFormContainer").classList.remove("hidden");
}
function hideAdd(event) {
    event.preventDefault();
    document.getElementById("addFormContainer").classList.add("hidden");
}

function showUpdate() {
    document.getElementById("updateFormContainer").classList.remove("hidden");
}
function hideUpdate(event) {
    event.preventDefault();
    document.getElementById("updateFormContainer").classList.add("hidden");
}
