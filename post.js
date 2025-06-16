async function loadSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (!postId) {
        console.error("No post ID found in URL");
        return;
    }

    try {
        const response = await fetch(`/.netlify/functions/get-single-post?id=${postId}`);
        const post = await response.json();

        if (!post || !post.content) {
            console.error("Invalid post data:", post);
            return;
        }

        const postContainer = document.getElementById("post-container");
        postContainer.innerHTML = ""; // Clear previous content

        // Post header section
        const postHeader = document.createElement("div");
        postHeader.classList.add("post-header");

        // Profile picture
        const profileImg = document.createElement("img");
        profileImg.classList.add("profile-img");
        profileImg.src = `/Assets/${post.user_id}.png`;

        // Poster name
        const posterName = document.createElement("span");
        posterName.classList.add("poster-name");
        posterName.textContent = post.username || "Anonymous";

        // Timestamp
        const timestamp = document.createElement("span");
        timestamp.classList.add("timestamp");
        timestamp.textContent = new Date(post.timestamp).toLocaleString();

        // Header layout
        const nameAndTimeContainer = document.createElement("div");
        nameAndTimeContainer.style.display = "flex";
        nameAndTimeContainer.style.alignItems = "center";

        nameAndTimeContainer.appendChild(posterName);
        nameAndTimeContainer.appendChild(timestamp);

        postHeader.appendChild(profileImg);
        postHeader.appendChild(nameAndTimeContainer);

        // Post content
        const postContent = document.createElement("p");
        postContent.classList.add("post-content");
        postContent.innerHTML = marked.parse(post.content);

        // Append header and content directly to postContainer
        postContainer.appendChild(postHeader);
        postContainer.appendChild(postContent);
    } catch (error) {
        console.error("Error fetching post:", error);
    }
}

window.onload = loadSinglePost;

