const STORAGE_KEY = "mcneilnews-posts";

const form = document.querySelector("#post-form");
const titleInput = document.querySelector("#post-title");
const contentInput = document.querySelector("#post-content");
const feedList = document.querySelector("#feed-list");
const postTemplate = document.querySelector("#post-template");
const commentTemplate = document.querySelector("#comment-template");
const monthLabel = document.querySelector("#month-label");
const calendarGrid = document.querySelector("#calendar-grid");
const filterLabel = document.querySelector("#feed-filter-label");
const countdownLabel = document.querySelector("#wedding-countdown");

const monthPrevButton = document.querySelector("#month-prev");
const monthNextButton = document.querySelector("#month-next");
const dayPrevButton = document.querySelector("#day-prev");
const dayNextButton = document.querySelector("#day-next");
const showAllButton = document.querySelector("#show-all");
const railList = document.querySelector("#rail-list");

/** @type {{id: string, title: string, content: string, createdAt: string, comments: {id: string, name: string, content: string, createdAt: string}[]}[]} */
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
    createdAt: new Date().toISOString(),
    comments: []
  };

  posts = sortByDate([...posts, post]);
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
renderPhotoRail();

function renderAll() {
  renderCalendar();
  renderFeed();
  renderCountdown();
}

function renderFeed() {
  feedList.innerHTML = "";

  const visiblePosts = selectedDate
    ? posts.filter((post) => dateKey(new Date(post.createdAt)) === selectedDate)
    : posts;

  filterLabel.textContent = selectedDate
    ? `Showing updates on ${selectedDate}`
    : "Showing all updates";

  if (visiblePosts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = selectedDate
      ? "No updates for this day yet."
      : "No updates yet. Share your first one above.";
    feedList.appendChild(empty);
    return;
  }

  for (const post of visiblePosts) {
    const node = postTemplate.content.cloneNode(true);
    const createdAt = new Date(post.createdAt);
    node.querySelector(".post-title").textContent = post.title;
    node.querySelector(".post-content").textContent = post.content;
    node.querySelector(".post-meta").textContent = formatDateTime(createdAt);

    const commentList = node.querySelector(".comment-list");
    const commentForm = node.querySelector(".comment-form");
    const nameField = node.querySelector(".comment-name");
    const commentField = node.querySelector(".comment-text");

    renderComments(commentList, post.comments);

    commentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = nameField.value.trim();
      const content = commentField.value.trim();

      if (!name || !content) {
        return;
      }

      addComment(post.id, { name, content });
      renderAll();
    });

    feedList.appendChild(node);
  }
}

function renderComments(commentListNode, comments) {
  commentListNode.innerHTML = "";

  if (!comments.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No comments yet.";
    commentListNode.appendChild(empty);
    return;
  }

  for (const comment of comments) {
    const node = commentTemplate.content.cloneNode(true);
    const meta = node.querySelector(".comment-meta");
    meta.textContent = `${comment.name} • ${formatDateTime(new Date(comment.createdAt))}`;
    node.querySelector(".comment-content").textContent = comment.content;
    commentListNode.appendChild(node);
  }
}

function addComment(postId, commentInput) {
  posts = posts.map((post) => {
    if (post.id !== postId) {
      return post;
    }

    const nextComment = {
      id: crypto.randomUUID(),
      name: commentInput.name,
      content: commentInput.content,
      createdAt: new Date().toISOString()
    };

    return {
      ...post,
      comments: [...post.comments, nextComment]
    };
  });

  savePosts(posts);
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

    if (isBigDay(key)) {
      dayButton.classList.add("big-day");
      dayButton.title = "Big Day - 21 March";
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
      parsed
        .filter((post) => post && post.id && post.title && post.content && post.createdAt)
        .map((post) => ({
          ...post,
          comments: Array.isArray(post.comments)
            ? post.comments.filter(
                (comment) => comment && comment.id && comment.name && comment.content && comment.createdAt
              )
            : []
        }))
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
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function firstOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isBigDay(key) {
  return key.slice(5) === "03-21";
}


function renderPhotoRail() {
  if (!railList) {
    return;
  }

  railList.innerHTML = "";
  const items = Array.isArray(window.MEDIA_ITEMS) ? window.MEDIA_ITEMS : [];

  const imageItems = items.filter((item) => item && item.type === "image" && item.src);
  if (!imageItems.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Add photos in media-config.js to show a vertical album here.";
    railList.appendChild(empty);
    return;
  }

  for (const item of imageItems.slice(0, 8)) {
    const figure = document.createElement("figure");
    figure.className = "rail-item";

    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.title || "Wedding photo";
    image.loading = "lazy";
    image.className = "rail-image";

    image.addEventListener("error", () => {
      figure.remove();
      if (!railList.children.length) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "Photo files not found yet. Add them in media/photos/.";
        railList.appendChild(empty);
      }
    });

    const caption = document.createElement("figcaption");
    caption.textContent = item.title || "Wedding memory";

    figure.appendChild(image);
    figure.appendChild(caption);
    railList.appendChild(figure);
  }
}


function renderCountdown() {
  if (!countdownLabel) {
    return;
  }

  const today = new Date();
  const target = nextWeddingDate(today);

  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const daysLeft = Math.round((end - start) / 86400000);

  countdownLabel.textContent = `${daysLeft} day${daysLeft === 1 ? "" : "s"} until the Big Day (${end.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })})`;
}

function nextWeddingDate(fromDate) {
  const year = fromDate.getFullYear();
  const thisYearWedding = new Date(year, 2, 21);
  const startOfToday = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());

  if (thisYearWedding >= startOfToday) {
    return thisYearWedding;
  }

  return new Date(year + 1, 2, 21);
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
