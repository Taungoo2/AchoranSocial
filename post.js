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

        const postElement = document.createElement("div");
        postElement.classList.add("single-post");

        // Post header section
        const postHeader = document.createElement("div");
        postHeader.classList.add("post-header");

        // Profile picture
        const profileImg = document.createElement("img");
        profileImg.classList.add("profile-img");
        profileImg.src = `/Assets/${post.user_id}.png`;

        // Poster name (use fetched username or fallback to Anonymous)
        const posterName = document.createElement("span");
        posterName.classList.add("poster-name");
        posterName.textContent = post.users ? post.users.username : "Anonymous";

        // Timestamp formatting
        const timestamp = document.createElement("span");
        timestamp.classList.add("timestamp");
        timestamp.textContent = new Date(post.timestamp).toLocaleString();

        // Append elements to post header
        postHeader.appendChild(profileImg);
        postHeader.appendChild(posterName);
        postHeader.appendChild(timestamp);

        // Post content
        const postContent = document.createElement("p");
        postContent.classList.add("post-content");
        postContent.textContent = post.content;

        // Append header and content to post element
        postElement.appendChild(postHeader);
        postElement.appendChild(postContent);

        postContainer.appendChild(postElement); // Add post to the container
    } catch (error) {
        console.error("Error fetching post:", error);
    }
}

// Load post when page is ready
window.onload = loadSinglePost;

