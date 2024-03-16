/**
 * All of these functions use the browser's url to route properly.
 * Page links will need to have the ".html" extension removed.
 *  (e.g. "HOSTNAME/customers" instead of "HOSTNAME/customers.html")
 */

function getURL() {
    let url = document.URL.split("?")[0];
    return url;
}

/**
 * @brief Function to instruct server to reset the whole database.
 *
 * Use sparingly or we will get rate limited,
 *  due mostly to how the DDL.sql is handled by the sql library.
 */
function reset() {
    let choice = confirm(`
    Please use this sparingly, uploading the DDL.sql through javascript is a rough process that gets rate limited quickly.\n\n
    Are you sure?
    `);

    if (choice == false) return;

    fetch("/reset", {
        method: "post",
    })
        .then(
            (res) => {
                if (res.status == 200) {
                    console.log("Successfully reset database");
                    alert("Successfully reset database");
                    window.location.reload();
                } else {
                    console.log("Could not reset DB code:", res.status);
                    alert(`Could not reset DB with server code: ${res.status}`);
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
 * @brief Gets a specific record's data and calls callback on it.
 *
 * @param {Number} id ID of record to get
 * @param {function( [{}] )} callback Function to call.
 *  arg0 is an array of len 1 containing an object
 */
function getByID(id, callback) {
    fetch(getURL() + `/get/${id}`, {
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
 * @brief Deletes a record by ID
 *
 * @param {Number} id Record ID to delete
 */
function deleteLine(id) {
    fetch(getURL() + `/delete/${id}`, {
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
    hideUpdate()
    let addFormContainer = document.getElementById("addFormContainer");
    addFormContainer.classList.remove("hidden");
    addFormContainer.scrollIntoView({ block: "end", behavior: "smooth" });
}
function hideAdd(event=undefined) {
    if (event) event.preventDefault();
    document.getElementById("addFormContainer").classList.add("hidden");
}

function showUpdate(id, entry) {
    hideAdd()
    let order = JSON.parse(document.getElementById("orderBin").value);

    order.forEach((key) => {
        try {
            let input = document.getElementById(`update${key}`);
            input.value = entry[key];
        } catch (err) {
            console.error(err);
        }
    });

    let updateForm = document.getElementById("updateForm");
    updateForm.action = getURL() + `/update/${id}`;

    document.getElementById("updateFormID").value = id;

    let updateFormContainer = document.getElementById("updateFormContainer");
    updateFormContainer.classList.remove("hidden");
    updateFormContainer.scrollIntoView({ block: "end", behavior: "smooth" });
}
function hideUpdate(event=undefined) {
    if (event) event.preventDefault();
    document.getElementById("updateFormContainer").classList.add("hidden");
}
