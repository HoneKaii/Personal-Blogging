const STORAGE_KEY = "generic-blog-posts";

const form = document.querySelector("#post-form");
const titleInput = document.querySelector("#post-title");
const contentInput = document.querySelector("#post-content");
const feedList = document.querySelector("#feed-list");
const postTemplate = document.querySelector("#post-template");
const monthLabel = document.querySelector("#month-label");
const calendarGrid = document.querySelector("#calendar-grid");
const filterLabel = document.querySelector("#feed-filter-label");

const monthPrevButton = document.querySelector("#month-prev");
const monthNextButton = document.querySelector("#month-next");
const dayPrevButton = document.querySelector("#day-prev");
const dayNextButton = document.querySelector("#day-next");
const showAllButton = document.querySelector("#show-all");

/** @type {{id: string, title: string, content: string, createdAt: string}[]} */
let posts = loadPosts();
let currentMonth = firstOfMonth(new Date());
let selectedDate = null;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    return;
  }

  const post = {
    id: crypto.randomUUID(),
    title,
    content,
    createdAt: new Date().toISOString()
  };

  posts.push(post);
  posts = sortByDate(posts);
  savePosts(posts);

  form.reset();

  const createdDate = new Date(post.createdAt);
  selectedDate = dateKey(createdDate);
  currentMonth = firstOfMonth(createdDate);

  renderAll();
});

monthPrevButton.addEventListener("click", () => {
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  renderCalendar();
});

monthNextButton.addEventListener("click", () => {
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  renderCalendar();
});

dayPrevButton.addEventListener("click", () => moveSelectedDay(-1));
dayNextButton.addEventListener("click", () => moveSelectedDay(1));
showAllButton.addEventListener("click", () => {
  selectedDate = null;
  renderAll();
});

renderAll();

function renderAll() {
  renderCalendar();
  renderFeed();
}

function renderFeed() {
  feedList.innerHTML = "";

  const visiblePosts = selectedDate
    ? posts.filter((post) => dateKey(new Date(post.createdAt)) === selectedDate)
    : posts;

  if (selectedDate) {
    filterLabel.textContent = `Showing posts on ${selectedDate}`;
  } else {
    filterLabel.textContent = "Showing all posts";
  }

  if (visiblePosts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = selectedDate
      ? "No posts for this day yet."
      : "No posts yet. Create your first post above.";
    feedList.appendChild(empty);
    return;
  }

  for (const post of visiblePosts) {
    const node = postTemplate.content.cloneNode(true);
    const createdAt = new Date(post.createdAt);
    node.querySelector(".post-title").textContent = post.title;
    node.querySelector(".post-content").textContent = post.content;
    node.querySelector(".post-meta").textContent = formatDateTime(createdAt);
    feedList.appendChild(node);
  }
}

function renderCalendar() {
  monthLabel.textContent = currentMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });

  calendarGrid.innerHTML = "";

  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const offset = firstDay.getDay();

  for (let i = 0; i < offset; i += 1) {
    const blank = document.createElement("span");
    blank.textContent = "";
    calendarGrid.appendChild(blank);
  }

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const key = dateKey(dayDate);
    const hasPost = posts.some((post) => dateKey(new Date(post.createdAt)) === key);

    const dayButton = document.createElement("button");
    dayButton.type = "button";
    dayButton.className = "calendar-day";
    dayButton.textContent = String(day);
    dayButton.setAttribute("aria-label", key);

    if (hasPost) {
      dayButton.classList.add("has-post");
    }

    if (selectedDate === key) {
      dayButton.classList.add("active");
    }

    dayButton.addEventListener("click", () => {
      selectedDate = key;
      renderAll();
    });

    calendarGrid.appendChild(dayButton);
  }
}

function moveSelectedDay(delta) {
  const baseDate = selectedDate ? new Date(selectedDate) : new Date();
  baseDate.setDate(baseDate.getDate() + delta);
  selectedDate = dateKey(baseDate);
  currentMonth = firstOfMonth(baseDate);
  renderAll();
}

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortByDate(
      parsed.filter((post) => post && post.id && post.title && post.content && post.createdAt)
    );
  } catch {
    return [];
  }
}

function savePosts(nextPosts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosts));
}

function sortByDate(items) {
  return [...items].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function firstOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDateTime(date) {
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
