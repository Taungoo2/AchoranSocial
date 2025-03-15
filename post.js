async function loadPost() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    if (!postId) {
        document.getElementById("post-container").innerHTML = "<p>Post not found.</p>";
        return;
    }

    try {
        const response = await fetch(`/.netlify/functions/get-single-post?id=${postId}`);
        const post = await response.json();

        if (!post) {
            document.getElementById("post-container").innerHTML = "<p>Post not found.</p>";
            return;
        }

        document.getElementById("post-container").innerHTML = `
            <div class="post">
                <div class="post-header">
                    <img class="profile-img" src="/Assets/${post.user_id}.png" alt="Profile">
                    <span class="poster-name">${post.posterName || "Anonymous"}</span>
                    <span class="timestamp">${new Date(post.timestamp).toLocaleString()}</span>
                </div>
                <p>${post.content}</p>
            </div>
        `;

    } catch (error) {
        console.error("Error fetching post:", error);
        document.getElementById("post-container").innerHTML = "<p>Error loading post.</p>";
    }
}

window.onload = loadPost;
