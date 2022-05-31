"use strict";

// Closure function to control pollution of global objects
const todoWrapper = function(todoList = [], completedList = []) {
  const taskInput = document.getElementById("new-task");
  const incompleteTasksHolder = document.getElementById("incomplete-tasks");
  const completedTasksHolder = document.getElementById("completed-tasks");
  const todoForm = document.getElementById("todo-input-form");
  const TODO = "incomplete-tasks";
  const COMPLETED = "completed-tasks";

  /**
   * Puts todo string in a list element and returns it
   * @param {string} taskString - a todo string
   * @param {boolean} checked - sets the 'checked' type for checkbox
   * @returns list element
   */
  const createNewTaskElement = function(taskString, checked=false) {
    let listItem = document.createElement("li");
    let checkBox = document.createElement("input");
    let label = document.createElement("label");
    let editInput = document.createElement("input");
    let editButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    checkBox.type = "checkbox";
    checkBox.checked = checked;
    editInput.type = "text";
    editButton.innerText = "Edit";
    editButton.className = "edit";
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";
    label.innerText = taskString;

    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
  };

  /**
   * 
   * @param {string} list - name of key to get values from local storage
   * @returns an array of strings (todos) or an empty array if there are entries
   * in local storage
   */
  const getItemsFromLocalStorage = function(list) {
    let items = JSON.parse(localStorage.getItem(list));
    return items || [];
  };

  /**
   * 
   * @param {string} list - name of key to set values in local storage
   * @param {string} item - todo item to add to local storage
   */
  const setTodoInLocalStorage = function(list, item) {
    let items = getItemsFromLocalStorage(list);
    items.push(item);
    localStorage.setItem(list, JSON.stringify(items));
  };

  /**
   * 
   * @param {string} list - name of key to delete from in local storage
   * @param {string} item - value to delete
   */
  const deleteItemFromLocalStorage = function(list, item) {
    let items = getItemsFromLocalStorage(list);
    let filteredItems = items.filter(el => el !== item);
    localStorage.setItem(list, JSON.stringify(filteredItems));
  };

  /**
   * Adds tasks to todo list; puts tasks into localstorage
   */
  const addTask = function() {
    // Validate input
    if (!taskInput.value || taskInput.value.length === 0) {
      console.error('Invalid input for addTask');
      return;
    }
    
    // Empty form cannot be submitted, taskInput.value will always contain a string
    const todoItemValue = taskInput.value;
    const todoListItem = createNewTaskElement(todoItemValue);
    incompleteTasksHolder.appendChild(todoListItem);
    bindTaskEvents(todoListItem, taskCompleted);
    setTodoInLocalStorage(TODO, todoItemValue);
    taskInput.value = "";
  };
  
  /**
   * Toggles edit mode for todo item when the button is clicked
   * this function will also update localstorage values
   */
  const editTask = function() {
    let listItem = this.parentNode;
    let editInput = listItem.querySelectorAll("input[type=text")[0];
    let currentTodoValue = listItem.querySelector("label");
    let editSaveToggle = listItem.getElementsByTagName("button")[0];

    const listName = listItem.parentNode.id;
  
    let editMode = listItem.classList.contains("editMode");
    if (editMode) {
      if (currentTodoValue.innerText !== editInput.value) {
        deleteItemFromLocalStorage(listName, currentTodoValue.innerText);
        setTodoInLocalStorage(listName, editInput.value);
      }
      currentTodoValue.innerText = editInput.value;
      editSaveToggle.innerText = "Edit";
    } else {
       editInput.value = currentTodoValue.innerText;
       editSaveToggle.innerText = "Save";
    }
    
    listItem.classList.toggle("editMode");
  };
  
  /**
   * Deletes todo item from the current list and in local storage
   */
  const deleteTask = function() {
    let listItem = this.parentNode;
    let currentTodoValue = listItem.querySelector("label");
    let currentList = listItem.parentNode;
    
    const listName = currentList.id;
    const item = currentTodoValue.innerText;
    currentList.removeChild(listItem);
    deleteItemFromLocalStorage(listName, item);
  };
  
  /**
   * Puts the todo item in completed list
   */
  const taskCompleted = function() {
    const listItem = this.parentNode;
    let currentTodoValue = listItem.querySelector("label");
    completedTasksHolder.appendChild(listItem);
    const item = currentTodoValue.innerText;
    
    setTodoInLocalStorage(COMPLETED, item);
    deleteItemFromLocalStorage(TODO, item);
    bindTaskEvents(listItem, taskIncomplete);
  };
  
  /**
   * Puts the todo item in 'todo' list
   */
  const taskIncomplete = function() {
    let listItem = this.parentNode;
    let currentTodoValue = listItem.querySelector("label");
    incompleteTasksHolder.appendChild(listItem);
    const item = currentTodoValue.innerText;
    
    setTodoInLocalStorage(TODO, item);
    deleteItemFromLocalStorage(COMPLETED, item);
    bindTaskEvents(listItem, taskCompleted);
  };
  
  /**
   * binds events to checkboxes, buttons for the todo item
   * @param taskListItem - list element
   * @param checkBoxEventHandler - a function to handle checking/unchecking check box
   */
  const bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
    const checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
    const editButton = taskListItem.getElementsByClassName("edit")[0];
    const deleteButton = taskListItem.getElementsByClassName("delete")[0];
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    checkBox.onchange = checkBoxEventHandler;
  };

  /**
   * These for loops are no longer needed
   for (let i = 0; i < incompleteTasksHolder.children.length; i++) {
     bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
   }
   
   for (let i = 0; i < completedTasksHolder.children.length; i++) {
     bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
   }
   */
  
  const onSubmitForm = (e) => {
    e.preventDefault();
    addTask();
  }
  
  localStorage.removeItem(TODO);
  for (let todoItemValue of todoList) {
    const todoListItem = createNewTaskElement(todoItemValue);
    incompleteTasksHolder.appendChild(todoListItem);
    bindTaskEvents(todoListItem, taskCompleted);
    setTodoInLocalStorage(TODO, todoItemValue);
  }

  localStorage.removeItem(COMPLETED);
  for (let todoItemValue of completedList) {
    const todoListItem = createNewTaskElement(todoItemValue, true);
    completedTasksHolder.appendChild(todoListItem);
    bindTaskEvents(todoListItem, taskIncomplete);
    setTodoInLocalStorage(COMPLETED, todoItemValue);
  }

  todoForm.addEventListener("submit", onSubmitForm);
}

window.onload = () => {
  const getListFromLocalStorage = function(listName) {
    const items = JSON.parse(localStorage.getItem(listName))
    return items;
  }

  const todoList = getListFromLocalStorage('incomplete-tasks') || ["Pay Bills", "Go Shopping"];
  const completedList = getListFromLocalStorage('completed-tasks') || ["See the Doctor"];
  todoWrapper(todoList, completedList);
}