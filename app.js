// DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const taskCountEl = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter');

// App state
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
});
clearCompletedBtn.addEventListener('click', clearCompleted);
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

// Initialize
renderTasks();

// Functions
function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        const task = {
            id: Date.now().toString(),
            text,
            completed: false,
            date: new Date().toISOString()
        };
        tasks.push(task);
        saveTasks();
        taskInput.value = '';
        renderTasks();
    }
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    let filteredTasks = [];
    
    switch(currentFilter) {
        case 'active':
            filteredTasks = tasks.filter(task => !task.completed);
            break;
        case 'completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
        default:
            filteredTasks = tasks;
    }
    
    taskList.innerHTML = '';
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));
        
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        taskList.appendChild(li);
    });
    
    updateTaskCount();
}

function updateTaskCount() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    taskCountEl.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
}