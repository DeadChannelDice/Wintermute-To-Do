// Variables connected to Storage
todos = JSON.parse(localStorage.getItem('todos')) || []
const username = localStorage.getItem('username') || '';

// Variables connected to HTML
const nameInput = document.querySelector('#name');
const newTodoForm = document.querySelector('#new-todo-form');
const todoList = document.querySelector('#todo-list');
const saveBtn = document.querySelector('#saveBtn');
const clearBtn = document.querySelector('#clearBtn');


// Render Todos at page load
window.addEventListener('load', () => {
    DisplayTodos();
});

// Listen for name imput
nameInput.value = username;
nameInput.addEventListener('change', event => {
    localStorage.setItem('username', event.target.value);
});

// Listen for Todo submition
newTodoForm.addEventListener('submit', event => {
    event.preventDefault();
    const todo = {
        content: event.target.elements.content.value,
        category: event.target.elements.category.value,
        dateAdded: new Date().toLocaleString('default', {
            weekday:'long', year: 'numeric', month: 'long', day: 'numeric'
        }),
        done: false,
        createAt: new Date().getTime()          
    }
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
    event.target.reset();
    DisplayTodos();
});


function DisplayTodos() {
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item','draggable');
        todoItem.setAttribute("draggable", "true");
        if (todo.done) {
            todoItem.classList.add('done');
        }

        const label = document.createElement('label');

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = todo.done;
        

        const span = document.createElement('span');
        if (todo.category == 'personal') {
            span.classList.add('personal');
        } else {
            span.classList.add('professional');
        }
        span.classList.add('bubble');

        const content = document.createElement('div');
        content.classList.add('todo-content');
        content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;

        const dateAdded = document.createElement('div');
        dateAdded.classList.add('dateAdded');
        dateAdded.innerHTML = `${todo.dateAdded}`;

        const actions = document.createElement('div');
        actions.classList.add('actions');

        const edit = document.createElement('button');
        edit.classList.add('edit');
        edit.innerHTML = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.innerHTML = 'Delete';  
        
        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(dateAdded);
        todoItem.appendChild(actions);
        todoList.appendChild(todoItem);

        
        input.addEventListener('click', event => {
            todo.done = event.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));

            if(todo.done) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }

            DisplayTodos();
        })
        
        edit.addEventListener('click', event => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();
            input.addEventListener('blur', event => {
                input.setAttribute('readonly', true);
                todo.content = event.target.value;
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            })
        })

        deleteButton.addEventListener('click', event => {
            todos = todos.filter(t => t != todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos();
        })
    })

        // Making Tasks Draggable
    // Connect JS to HTML
    const draggables = document.querySelectorAll('.draggable');
    const containers = document.querySelectorAll('.container');

    // Add and remove "dragging" class from selected item
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging')
        } )

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging')
        })
    })

    // Allows for the dragged item to be added to a container and where the dragged item will reside.
    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault()
            const afterElement = getDragAfterElement(container, e.clientY)
            const draggable = document.querySelector('.dragging')
            if (afterElement == null) {
                container.appendChild(draggable)
            } else {
                container.insertBefore(draggable, afterElement)
            }
            
            
        })
    })

    function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging')]

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            if(offset < 0 && offset > closest.offset) {
                return {offset:offset, element: child }
            } else {
                return closest
            }
    }, { offset: Number.NEGATIVE_INFINITY} ).element
    }

    clearBtn.addEventListener("click", () => {
        localStorage.removeItem('todos');
        todos = [];
        DisplayTodos();
    })
    

}



