// Function to fetch user session from the backend
async function fetchUserSession() {
    try {
        const response = await fetch("/.netlify/functions/check-session", {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.loggedIn && data.userId) {
            console.log("User is logged in:", data.userId);
            return data.userId;
        } else {
            console.log("User not logged in");
            return null;
        }
    } catch (error) {
        console.error("Session check failed:", error);
        return null;
    }
}

// Handling the Add Post button and popup
document.getElementById("addPostBtn").addEventListener("click", function () {
    document.getElementById("popupLayer").style.display = "flex"; // Show the popup
});

// Handling the closing of the popup if clicked outside the popup content
document.getElementById("popupLayer").addEventListener("click", function (event) {
    if (event.target === document.getElementById("popupLayer")) {
        document.getElementById("popupLayer").style.display = "none"; // Hide the popup
    }
});

// Handle the post form submission
document.getElementById("postForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const postContent = document.getElementById("postContent").value.trim();
    const userId = await fetchUserSession(); // Retrieve user ID from backend

    if (!userId) {
        alert("You must be logged in to post.");
        return;
    }

    if (postContent !== "") {
        const newPost = {
            content: postContent,
            timestamp: new Date().toISOString(),
            user_id: userId,
        };

        console.log("New Post Data:", newPost); // Debugging

        fetch("/.netlify/functions/add-post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost),
            credentials: "include", // Ensure cookies are included
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Post added:", data);

            // Reload posts after adding a new one
            loadPosts();  

            document.getElementById("postForm").reset();
            document.getElementById("popupLayer").style.display = "none";
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }
});

// Fetch posts from Supabase and display them in order
async function loadPosts() {
    try {
        const response = await fetch("/.netlify/functions/get-posts");
        const posts = await response.json();

        console.log(posts); // Debugging to check the response format

        // Check if posts is an array
        if (Array.isArray(posts)) {
            const feed = document.getElementById("feed");
            feed.innerHTML = ""; // Clear current posts before adding new ones

            // Loop through all posts and display them
            posts.forEach(post => {
                const postElement = document.createElement("div");
                postElement.classList.add("post");

                // Add profile picture, name, and timestamp
                const postHeader = document.createElement("div");
                postHeader.classList.add("post-header");

                // Use the user_id to construct the profile picture path
                const profileImg = document.createElement("img");
                profileImg.classList.add("profile-img");
                profileImg.src = `/Assets/${String(post.user_id)}.png`; // Profile picture named after user_id in /Assets folder

                const posterName = document.createElement("span");
                posterName.classList.add("poster-name");
                posterName.textContent = post.posterName || "Anonymous"; // Default name

                const timestamp = document.createElement("span");
                timestamp.classList.add("timestamp");
                timestamp.textContent = new Date(post.timestamp).toLocaleString(); // Format timestamp

                // Append profile, name, and timestamp to the post header
                postHeader.appendChild(profileImg);
                postHeader.appendChild(posterName);
                postHeader.appendChild(timestamp);

                // Add post content
                const postContent = document.createElement("p");
                postContent.textContent = post.content; // Display the post content

                // Append header and content to the post element
                postElement.appendChild(postHeader);
                postElement.appendChild(postContent);

                feed.appendChild(postElement); // Add the post to the feed
            });
        } else {
            console.error("Expected posts to be an array, but received:", posts);
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Call loadPosts when the page is loaded to fetch initial posts
window.onload = async function () {
    loadPosts();  // Fetch and display posts when the page loads
    await fetchUserSession(); // Fetch session on page load
};

