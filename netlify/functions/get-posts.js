document.addEventListener("DOMContentLoaded", async () => {
  const feed = document.getElementById("feed");

  try {
    const response = await fetch("/.netlify/functions/get-posts");
    const posts = await response.json();

    feed.innerHTML = ""; // Clear old content

    posts.forEach(post => {
      const postContainer = document.createElement("div");
      postContainer.className = "post";

      const contentElement = document.createElement("div");
      contentElement.className = "post-content";

      // Render with Markdown + sanitize
      contentElement.innerHTML = DOMPurify.sanitize(marked.parse(post.content));

      const poster = document.createElement("div");
      poster.className = "poster";
      poster.textContent = `Posted by ${post.posterName}`;

      const timestamp = document.createElement("div");
      timestamp.className = "timestamp";
      timestamp.textContent = new Date(post.timestamp).toLocaleString();

      postContainer.appendChild(poster);
      postContainer.appendChild(contentElement);
      postContainer.appendChild(timestamp);

      feed.appendChild(postContainer);
    });

  } catch (error) {
    console.error("Failed to fetch posts:", error);
    feed.innerHTML = "<p>Error loading feed.</p>";
  }
});

