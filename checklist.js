const CHECKLIST_KEY = "mcneilnews-checklist";

const form = document.querySelector("#checklist-form");
const input = document.querySelector("#checklist-item");
const list = document.querySelector("#checklist-list");

let items = loadChecklist();
renderChecklist();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const content = input.value.trim();

  if (!content) {
    return;
  }

  items.push({
    id: crypto.randomUUID(),
    content,
    done: false
  });

  saveChecklist(items);
  form.reset();
  renderChecklist();
});

function renderChecklist() {
  list.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No checklist items yet.";
    list.appendChild(empty);
    return;
  }

  for (const item of items) {
    const entry = document.createElement("li");

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;

    checkbox.addEventListener("change", () => {
      items = items.map((candidate) =>
        candidate.id === item.id ? { ...candidate, done: checkbox.checked } : candidate
      );
      saveChecklist(items);
      renderChecklist();
    });

    const text = document.createElement("span");
    text.textContent = ` ${item.content}`;
    if (item.done) {
      text.style.textDecoration = "line-through";
      text.style.opacity = "0.75";
    }

    label.appendChild(checkbox);
    label.appendChild(text);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      items = items.filter((candidate) => candidate.id !== item.id);
      saveChecklist(items);
      renderChecklist();
    });

    entry.appendChild(label);
    entry.appendChild(removeButton);
    list.appendChild(entry);
  }
}

function loadChecklist() {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => item && item.id && item.content && typeof item.done === "boolean");
  } catch {
    return [];
  }
}

function saveChecklist(nextItems) {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(nextItems));
}
