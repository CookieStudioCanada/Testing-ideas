const STORAGE_KEY = 'todo-app-v1';

const PRIORITY_LABELS = {
  none: 'Aucune',
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  urgent: 'Urgente',
};

let state = {
  tasks: [],
  lists: ['Général'],
  filter: 'all',
  listFilter: null,
  search: '',
  editingId: null,
};

const els = {
  taskList: document.getElementById('task-list'),
  emptyState: document.getElementById('empty-state'),
  searchInput: document.getElementById('search-input'),
  viewLabel: document.getElementById('view-label'),
  viewTitle: document.getElementById('view-title'),
  countAll: document.getElementById('count-all'),
  countActive: document.getElementById('count-active'),
  countCompleted: document.getElementById('count-completed'),
  statTotal: document.getElementById('stat-total'),
  statDueToday: document.getElementById('stat-due-today'),
  statOverdue: document.getElementById('stat-overdue'),
  listsNav: document.getElementById('lists-nav'),
  listSuggestions: document.getElementById('list-suggestions'),
  taskModal: document.getElementById('task-modal'),
  listModal: document.getElementById('list-modal'),
  taskForm: document.getElementById('task-form'),
  listForm: document.getElementById('list-form'),
  modalTitle: document.getElementById('modal-title'),
  taskTitle: document.getElementById('task-title'),
  taskDescription: document.getElementById('task-description'),
  taskDueDate: document.getElementById('task-due-date'),
  taskPriority: document.getElementById('task-priority'),
  taskListName: document.getElementById('task-list-name'),
  newListName: document.getElementById('new-list-name'),
  themeToggle: document.getElementById('theme-toggle'),
  themeIcon: document.getElementById('theme-icon'),
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      state = { ...state, ...saved };
    }
  } catch {
    /* use defaults */
  }

  if (!state.tasks.length) {
    state.tasks = [
      {
        id: crypto.randomUUID(),
        title: 'Bienvenue sur Todo!',
        description: 'Cliquez sur la case pour marquer une tâche comme terminée. Utilisez le bouton + pour en ajouter d\'autres.',
        dueDate: todayISO(),
        priority: 'medium',
        list: 'Général',
        completed: false,
        createdAt: Date.now(),
      },
    ];
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    tasks: state.tasks,
    lists: state.lists,
  }));
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso) {
  if (!iso) return '';
  const date = new Date(iso + 'T00:00:00');
  return date.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isOverdue(task) {
  return task.dueDate && !task.completed && task.dueDate < todayISO();
}

function isDueToday(task) {
  return task.dueDate && task.dueDate === todayISO();
}

function getFilteredTasks() {
  let tasks = [...state.tasks];

  if (state.filter === 'active') tasks = tasks.filter(t => !t.completed);
  if (state.filter === 'completed') tasks = tasks.filter(t => t.completed);
  if (state.listFilter) tasks = tasks.filter(t => t.list === state.listFilter);

  if (state.search.trim()) {
    const q = state.search.toLowerCase();
    tasks = tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.list.toLowerCase().includes(q)
    );
  }

  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3, none: 4 };
  return tasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const pa = priorityOrder[a.priority] ?? 4;
    const pb = priorityOrder[b.priority] ?? 4;
    if (pa !== pb) return pa - pb;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    return b.createdAt - a.createdAt;
  });
}

function updateCounts() {
  const all = state.tasks.length;
  const active = state.tasks.filter(t => !t.completed).length;
  const completed = state.tasks.filter(t => t.completed).length;
  const dueToday = state.tasks.filter(t => isDueToday(t) && !t.completed).length;
  const overdue = state.tasks.filter(t => isOverdue(t)).length;

  els.countAll.textContent = all;
  els.countActive.textContent = active;
  els.countCompleted.textContent = completed;
  els.statTotal.textContent = all;
  els.statDueToday.textContent = dueToday;
  els.statOverdue.textContent = overdue;
}

function renderListsNav() {
  els.listsNav.innerHTML = '';
  state.lists.forEach(list => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'nav-item' + (state.listFilter === list ? ' active' : '');
    btn.dataset.list = list;
    const count = state.tasks.filter(t => t.list === list && !t.completed).length;
    btn.innerHTML = `<span class="nav-icon">📁</span>${escapeHtml(list)}<span class="nav-count">${count}</span>`;
    btn.addEventListener('click', () => {
      state.listFilter = state.listFilter === list ? null : list;
      state.filter = 'all';
      document.querySelectorAll('.sidebar-nav .nav-item').forEach(n => n.classList.remove('active'));
      updateViewTitle();
      render();
    });
    li.appendChild(btn);
    els.listsNav.appendChild(li);
  });

  els.listSuggestions.innerHTML = state.lists.map(l => `<option value="${escapeAttr(l)}">`).join('');
}

function updateViewTitle() {
  const labels = { all: 'Toutes les tâches', active: 'En cours', completed: 'Terminées' };
  els.viewLabel.textContent = state.listFilter ? `Liste · ${state.listFilter}` : labels[state.filter];
  els.viewTitle.textContent = state.listFilter || 'Mes tâches';
}

function renderTasks() {
  const tasks = getFilteredTasks();
  els.taskList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    const tags = [];
    if (task.list) tags.push(`<span class="tag">📁 ${escapeHtml(task.list)}</span>`);
    if (task.priority !== 'none') {
      tags.push(`<span class="tag priority-${task.priority}">${PRIORITY_LABELS[task.priority]}</span>`);
    }
    if (task.dueDate) {
      let cls = '';
      if (isOverdue(task)) cls = ' overdue';
      else if (isDueToday(task)) cls = ' due-today';
      tags.push(`<span class="tag${cls}">📅 ${formatDate(task.dueDate)}</span>`);
    }

    li.innerHTML = `
      <button class="task-check${task.completed ? ' checked' : ''}" aria-label="Marquer comme ${task.completed ? 'non terminée' : 'terminée'}">${task.completed ? '✓' : ''}</button>
      <div class="task-body">
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">${tags.join('')}</div>
      </div>
      <div class="task-actions">
        <button class="icon-btn edit-btn" title="Modifier">✏️</button>
        <button class="icon-btn danger delete-btn" title="Supprimer">🗑</button>
      </div>
    `;

    li.querySelector('.task-check').addEventListener('click', () => toggleComplete(task.id));
    li.querySelector('.edit-btn').addEventListener('click', () => openTaskModal(task.id));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

    els.taskList.appendChild(li);
  });

  els.emptyState.classList.toggle('hidden', tasks.length > 0);
  updateCounts();
}

function render() {
  renderListsNav();
  renderTasks();
  updateViewTitle();

  document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === state.filter && !state.listFilter);
  });
}

function openTaskModal(id = null) {
  state.editingId = id;
  if (id) {
    const task = state.tasks.find(t => t.id === id);
    els.modalTitle.textContent = 'Modifier la tâche';
    els.taskTitle.value = task.title;
    els.taskDescription.value = task.description;
    els.taskDueDate.value = task.dueDate;
    els.taskPriority.value = task.priority;
    els.taskListName.value = task.list;
  } else {
    els.modalTitle.textContent = 'Nouvelle tâche';
    els.taskForm.reset();
    els.taskListName.value = state.listFilter || 'Général';
  }
  els.taskModal.showModal();
  els.taskTitle.focus();
}

function closeTaskModal() {
  els.taskModal.close();
  state.editingId = null;
}

function saveTask(e) {
  e.preventDefault();
  const data = {
    title: els.taskTitle.value.trim(),
    description: els.taskDescription.value.trim(),
    dueDate: els.taskDueDate.value,
    priority: els.taskPriority.value,
    list: els.taskListName.value.trim() || 'Général',
  };

  if (!data.title) return;

  if (!state.lists.includes(data.list)) {
    state.lists.push(data.list);
  }

  if (state.editingId) {
    const task = state.tasks.find(t => t.id === state.editingId);
    Object.assign(task, data);
  } else {
    state.tasks.unshift({
      id: crypto.randomUUID(),
      ...data,
      completed: false,
      createdAt: Date.now(),
    });
  }

  saveState();
  closeTaskModal();
  render();
}

function toggleComplete(id) {
  const task = state.tasks.find(t => t.id === id);
  task.completed = !task.completed;
  saveState();
  render();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveState();
  render();
}

function addList(e) {
  e.preventDefault();
  const name = els.newListName.value.trim();
  if (name && !state.lists.includes(name)) {
    state.lists.push(name);
    saveState();
    render();
  }
  els.listModal.close();
  els.newListName.value = '';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;');
}

function initTheme() {
  const saved = localStorage.getItem('todo-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
  els.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('todo-theme', next);
  els.themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
}

document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    state.filter = btn.dataset.filter;
    state.listFilter = null;
    render();
  });
});

els.searchInput.addEventListener('input', () => {
  state.search = els.searchInput.value;
  renderTasks();
});

document.getElementById('open-add-modal').addEventListener('click', () => openTaskModal());
document.getElementById('empty-add-btn').addEventListener('click', () => openTaskModal());
document.getElementById('add-list-btn').addEventListener('click', () => els.listModal.showModal());
document.getElementById('close-modal').addEventListener('click', closeTaskModal);
document.getElementById('cancel-modal').addEventListener('click', closeTaskModal);
document.getElementById('close-list-modal').addEventListener('click', () => els.listModal.close());
document.getElementById('cancel-list-modal').addEventListener('click', () => els.listModal.close());
els.taskForm.addEventListener('submit', saveTask);
els.listForm.addEventListener('submit', addList);
els.themeToggle.addEventListener('click', toggleTheme);

loadState();
initTheme();
render();
