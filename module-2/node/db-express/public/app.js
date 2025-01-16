function renderTodos(todos) {
    const todoList = document.getElementById("todoList")
    todoList.innerHTML = ''
    todos.forEach(todoItem => {
        const newListElement = document.createElement("li")
        newListElement.innerText = todoItem
        todoList.appendChild(newListElement)
    });
}

async function getTodos() {
    const response = await fetch("/todos")
    const todos = await response.json()
    renderTodos(todos)
}

async function addTodo(todo) {
    console.log(todo)
    const response = await fetch("/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ todo: todo })
    })
    getTodos()
}


/*
// addTodo() sendet eine POST request (mitstringifiziertem json objekt im Body)
function addTodo(todo) {
    fetch("/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        //`{"todoText": "${todo}"}`
        body: JSON.stringify({ todoText: todo })
    })
        .then(response => response.json())
        .then(todos => renderTodos(todos))
        .catch(error => console.error("Es gabe einen fehler bei addTodo:", error))
}
*/

// deleteTodos sendet eine DELETE request
function deleteTodos() {
    fetch("/todos", {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(todos => renderTodos(todos))
        .catch(error => console.error("Es gabe einen fehler bei deleteTodos:", error))
}

// -----------------------------------------------------------------------
// Die event listener für die beiden buttons: 
document.getElementById("addButton").addEventListener('click', () => {
    const todoInput = document.getElementById("todoInput")
    const todoText = todoInput.value

    if (todoText) {
        addTodo(todoText);
        todoInput.value = '';
    }
})

document.getElementById("deleteButton").addEventListener('click', () => {
    deleteTodos()
})


// Beim laden der Website löse einmal direkt getTodos aus, um die
// aktuelle todoliste vom server abzufragen
getTodos()
