const gallery = document.querySelector("#media-gallery");
const mediaItems = Array.isArray(window.MEDIA_ITEMS) ? window.MEDIA_ITEMS : [];

renderGallery();

function renderGallery() {
  if (!gallery) {
    return;
  }

  gallery.innerHTML = "";

  if (!mediaItems.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No media added yet.";
    gallery.appendChild(empty);
    return;
  }

  for (const item of mediaItems) {
    const card = document.createElement("article");
    card.className = "media-card";

    if (item.type === "image") {
      const image = document.createElement("img");
      image.src = item.src;
      image.alt = item.title || "Wedding media";
      image.loading = "lazy";
      image.className = "media-image";
      card.appendChild(image);
    } else if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.src;
      video.controls = true;
      video.className = "media-image";
      card.appendChild(video);
    } else if (item.type === "link") {
      const link = document.createElement("a");
      link.href = item.src;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "checklist-link";
      link.textContent = item.title || "Open Album";
      card.appendChild(link);
    }

    const title = document.createElement("h3");
    title.textContent = item.title || "Media item";
    card.appendChild(title);

    if (item.caption) {
      const caption = document.createElement("p");
      caption.className = "post-meta";
      caption.textContent = item.caption;
      card.appendChild(caption);
    }

    gallery.appendChild(card);
  }
}
