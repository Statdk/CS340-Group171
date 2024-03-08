function handleCreate(err, result, req, res) {
    if (err != null) {
        console.log("Could not create entry with:", req.body);
        console.log(err);
        res.sendStatus(500);
    } else {
        console.log("Created entry:", result);
        res.redirect(".");
    }
}

function handleUpdate(err, result, req, res) {
    if (err != null) {
        console.log(
            `Could not update ID ${req.params.id} with:`,
            req.body
        );
        console.log(err);
        res.sendStatus(500);
    } else {
        console.log("Updated ID:", req.params.id);
        console.log(result);
        res.redirect(req.baseUrl);
    }
}

function handleDelete(err, result, req, res) {
    if (err != null) {
        console.log("Error:", err);
        res.sendStatus(500);
    } else {
        console.log(result);
        res.redirect(req.baseUrl);
    }
}

module.exports = { handleCreate, handleUpdate, handleDelete };
