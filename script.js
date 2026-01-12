const lists = document.querySelectorAll(".list");
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const resetBtn = document.getElementById("resetBtn");

// -------------------- STATE --------------------
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// -------------------- EVENTS --------------------
form.addEventListener("submit", addTask);
resetBtn.addEventListener("click", resetBoard);

lists.forEach(list => {
  list.addEventListener("dragover", dragOver);
  list.addEventListener("drop", dragDrop);
});

// -------------------- FUNCTIONS --------------------

function addTask(e) {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    status: "todo"
  });

  saveAndRender();
  form.reset();
}

function renderTasks() {
  // Clear all lists
  lists.forEach(list => {
    list.querySelectorAll(".card").forEach(card => card.remove());
  });

  // Render from state
  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = task.text;
    card.draggable = true;
    card.id = task.id;

    card.addEventListener("dragstart", dragStart);

    document.getElementById(task.status).appendChild(card);
  });
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(e) {
  e.preventDefault();

  const taskId = Number(e.dataTransfer.getData("text/plain"));
  const newStatus = this.id;

  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, status: newStatus } : task
  );

  saveAndRender();
}

function resetBoard() {
  tasks = [];
  localStorage.removeItem("tasks");
  renderTasks();
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

renderTasks();
