const inputbox = document.getElementById("input-box");
const listcontainer = document.getElementById("list-container");

let taskId = 0;

function addtask() {
    if (inputbox.value === '') {
        alert("You must write something!");
    } else {
        let li = createTaskElement(inputbox.value);
        listcontainer.appendChild(li);
        inputbox.value = "";  // Clear input field after adding
        saveData();
    }
}

function createTaskElement(taskText) {
    let li = document.createElement("li");
    li.innerHTML = taskText;
    li.setAttribute("draggable", "true");
    li.setAttribute("ondragstart", "drag(event)");
    li.setAttribute("id", `task-${taskId++}`);

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    return li;
}

inputbox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addtask();
    }
});

document.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData() {
    const data = {
        list: listcontainer.innerHTML,
        sections: {}
    };

    document.querySelectorAll('.section').forEach(section => {
        data.sections[section.id] = section.innerHTML;
    });

    localStorage.setItem("data", JSON.stringify(data));
}

function showTask() {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
        listcontainer.innerHTML = data.list;
        document.querySelectorAll("#list-container li").forEach(li => {
            setTaskAttributes(li);
        });

        Object.keys(data.sections).forEach(id => {
            document.getElementById(id).innerHTML = data.sections[id];
            document.querySelectorAll(`#${id} li`).forEach(li => {
                setTaskAttributes(li);
            });
        });
    }
}

function setTaskAttributes(li) {
    li.setAttribute("draggable", "true");
    li.setAttribute("ondragstart", "drag(event)");
}

showTask();

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.target.classList.add('dragging');
}

function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    let draggedElement = document.getElementById(data);

    if (event.target.classList.contains('section')) {
        event.target.appendChild(draggedElement);
    } else {
        listcontainer.appendChild(draggedElement);
    }

    draggedElement.classList.remove('dragging');
    saveData();
}

function clearAll() {
    listcontainer.innerHTML = "";
    document.querySelectorAll('.section').forEach(section => {
        section.innerHTML = "";
    });
    saveData();
}
