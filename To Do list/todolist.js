document.addEventListener('DOMContentLoaded', () => {
  // HTML Elements Selection
  const taskInput = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.getElementById('taskList');

  // Key for localStorage persistence
  const STORAGE_KEY = 'responsive_todo_app_data';

  // Load tasks from Local Storage
  const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    taskList.innerHTML = '';
    savedTasks.forEach(task => renderTaskElement(task));
  };

  // Save tasks array to Local Storage
  const saveTasks = () => {
    const tasks = [];
    const liElements = taskList.querySelectorAll('li');
    
    liElements.forEach(li => {
      tasks.push({
        id: li.dataset.id,
        text: li.querySelector('p').textContent,
        completed: li.classList.contains('completed')
      });
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  };

  // Create & Render task item in DOM
  const renderTaskElement = (taskObj) => {
    const li = document.createElement('li');
    li.dataset.id = taskObj.id;
    if (taskObj.completed) {
      li.classList.add('completed');
    }

    // Left Section (Check Circle + Paragraph)
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    const checkCircle = document.createElement('div');
    checkCircle.className = 'check-circle';

    const checkIcon = document.createElement('i');
    checkIcon.className = 'fa-solid fa-check';
    checkCircle.appendChild(checkIcon);

    const pTag = document.createElement('p');
    pTag.textContent = taskObj.text;

    taskContent.appendChild(checkCircle);
    taskContent.appendChild(pTag);

    // Right Delete Cross Section
    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';

    // Assemble Li
    li.appendChild(taskContent);
    li.appendChild(deleteBtn);

    // Event 1: Toggle Check / Uncheck
    taskContent.addEventListener('click', () => {
      li.classList.toggle('completed');
      saveTasks();
    });

    // Event 2: Delete Task Only on Cross (✕) Click
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevents triggering check/uncheck
      li.remove();
      saveTasks();
    });

    taskList.appendChild(li);
  };

  // Add New Task
  const addTask = () => {
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = {
      id: Date.now().toString(),
      text: text,
      completed: false
    };

    renderTaskElement(newTask);
    saveTasks();

    taskInput.value = '';
    taskInput.focus();
  };

  // Click & Enter Key Listeners
  addBtn.addEventListener('click', addTask);

  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });

  // Initial Load (Initial state bilkul empty rahegi jab tak user input na kare)
  loadTasks();
});