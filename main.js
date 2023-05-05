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

    
    

}

console.log(todos);

clearBtn.addEventListener("click", () => {
    localStorage.removeItem('todos');
    todos = [];
    DisplayTodos();
})

// Calendar App


const calendar = document.querySelector('#calendar');
const monthElement = document.querySelector('#month');

const months = [
   'January',
   'February',
   'March',
   'April',
   'May',
   'June',
   'July',
   'August',
   'September',
   'October',
   'November',
   'December'
];

const days = [
 'Sun',
 'Mon',
 'Tue',
 'Wed',
 'Thu',
 'Fri',
 'Sat']

let events;

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

//  const loadEvents = async () => {
//     const res = await fetch(STORYBLOK_URL);
//     const data = await res.json();
//     const stories = data.stories;
//     events = stories.reduce((accumulator, story) => {
//         const storyTime = new Date(story.content.time);
//         const storyDate = new Date(storyTime.toDateString());
//         accumulator[storyDate] = story.content;
//         return accumulator;
//     }, {});
//  };

//  loadEvents();

const drawBlankCalendar = () => {
   for(let i = 0; i < 42; i++) {
       const day = document.createElement('div');
       day.classList.add('day');
       

       const dayText = document.createElement('p');
       dayText.classList.add('day-text');
       dayText.innerText = days[i % 7];

       const dayNumber = document.createElement('p');
       dayNumber.classList.add('day-number');
       
       const eventName = document.createElement('small');
       eventName.classList.add('event-name');

       day.appendChild(dayText);
       day.appendChild(dayNumber);
       day.appendChild(eventName);

       calendar.appendChild(day);
   }
}

const updateCalendar = (month, year, events) => {
   let theFirst = new Date();
   theFirst.setDate(1);
   theFirst.setMonth(0);
   theFirst.setFullYear(year);

   const monthName = months[month];
   const monthWithYear = `${year} - ${monthName}`;
   monthElement.innerText = monthWithYear;

   // Asigning days dates and adding events
   

   const daysInJan = new Date(year, 0 + 1, 0).getDate();
   const daysInFeb = new Date(year, 1 + 1, 0).getDate();
   const daysInMar = new Date(year, 2 + 1, 0).getDate();
   const daysInApr = new Date(year, 3 + 1, 0).getDate();
   const daysInMay = new Date(year, 4 + 1, 0).getDate();
   const daysInJun = new Date(year, 5 + 1, 0).getDate();
   const daysInJul = new Date(year, 6 + 1, 0).getDate();
   const daysInAug = new Date(year, 7 + 1, 0).getDate();
   const daysInSep = new Date(year, 8 + 1, 0).getDate();
   const daysInOct = new Date(year, 9 + 1, 0).getDate();
   const daysInNov = new Date(year, 10 + 1, 0).getDate();
   const daysInDec = new Date(year, 11 + 1, 0).getDate();

   const daysInMonth = [daysInJan, daysInFeb, daysInMar, daysInApr, daysInMay, daysInJun, daysInJul, daysInAug, daysInSep, daysInOct, daysInNov, daysInDec]; 


   const theFirstDayOfWeek = theFirst.getDay();

   let dayCounter = 1;
   let monthCounter = 0;

   const daysInYear = [...document.querySelectorAll('.day')];
   
 daysInYear.forEach((day) => {
   const dayNumber = day.querySelector('.day-number');
   
   if (dayCounter <= daysInMonth[monthCounter]) {
     dayNumber.innerText = dayCounter;
     dayCounter++;
     console.log(daysInMonth[monthCounter]);
   } else {
     dayCounter = 1;
     dayNumber.innerText = dayCounter;
     dayCounter++;
     monthCounter++;
     
   }
   
 });
}


const previousMonth = () => {
   currentMonth--;
   if (currentMonth < 0) {
       currentYear--,
       currentMonth = 11;
   }
   updateCalendar(currentMonth, currentYear, events);
}

const nextMonth = () => {
   currentMonth++;
   if (currentMonth > 11) {
       currentYear++,
       currentMonth = 0;
   }
   updateCalendar(currentMonth, currentYear, events);
}

const load = async () => {
   // await loadEvents();
   drawBlankCalendar();
   updateCalendar(currentMonth, currentYear, events);   
     
}

load();
