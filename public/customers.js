function newLine() {
    document.getElementById("addForm").classList.remove("hidden");
}

function editLine(id) {
    let updateForm = document.getElementById("updateForm");

    updateForm.classList.add("hidden");

    let updateFirst = document.getElementById("updateFirst");
    let updateLast = document.getElementById("updateLast");
    let updateEmail = document.getElementById("updateEmail");
    let updatePhone = document.getElementById("updatePhone");
    let updateBtn = document.getElementById("updateBtn");

    updateBtn.outerHTML = updateBtn.outerHTML;

    const data = {
        first: updateFirst.value,
        last: updateLast.value,
        email: updateEmail.value,
        phone: updatePhone.value,
    };

    update(id, data);
}

function editLineSetup(event, id) {
    event.stopPropagation();

    console.log(id);

    let updateForm = document.getElementById("updateForm");

    updateForm.classList.remove("hidden");

    let updateFirst = document.getElementById("updateFirst");
    let updateLast = document.getElementById("updateLast");
    let updateEmail = document.getElementById("updateEmail");
    let updatePhone = document.getElementById("updatePhone");
    let updateBtn = document.getElementById("updateBtn");

    updateBtn.onclick = () => {
        editLine(id);
    };

    getByID(id, (data) => {
        updateFirst.value = data[0].firstName;
        updateLast.value = data[0].lastName;
        updateEmail.value = data[0].email;
        updatePhone.value = Number(data[0].phoneNumber);
    });
}
