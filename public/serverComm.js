function reset(tableName) {
    fetch("/reset", {
        method: "post",
    })
        .then(
            (res) => {
                if (res.status == 200) {
                    console.log("Successfully reset database");
                    setTimeout(() => {
                        resetTable(tableName);
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

function resetTable() {
    let table = document.getElementById("table");
    fetch(document.URL + "/table", {
        method: "get",
    })
        .then((res) => res.text())
        .then((html) => {
            table.innerHTML = html;
        });
}

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
            } else {
                console.error(`Could not update entry ${id} with:`, data);
            }
        })
        .catch((err) => {
            console.error("Fetch error:", err);
        });
}

function deleteLine(id) {
    fetch(document.URL + `/delete/${id}`, {
        method: "post",
    }).then((res) => {
        if (res.status == 200) {
            console.log("Deleted", id);
            resetTable();
        }
    });
}
