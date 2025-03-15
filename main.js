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
        let posts = await response.json();

        posts.reverse();

        const feed = document.getElementById("feed");
        feed.innerHTML = ""; // Clear current posts before adding new ones

        // Loop through all posts and display them
        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            // Add profile picture, name, and timestamp
            const postHeader = document.createElement("div");
            postHeader.classList.add("post-header");

            // Validate user_id, if it's null or undefined, assign a fallback image
            const profileImg = document.createElement("img");
            profileImg.classList.add("profile-img");

            const userId = post.user_id; // Retrieve user_id from post
            console.log("Post user_id:", userId); // Debugging log to verify the user_id

            // Create a variable string for the profile image path
            let profileImageUrl = `/Assets/${userId}.png`; // Default path based on user_id

            // Check if the user_id exists and is valid, else fallback to default image
            if (userId && userId !== null && userId !== undefined) {
                profileImg.src = profileImageUrl; // Use the generated string for the image URL
            } else {
                profileImg.src = `/..Assets/default.png`; // Fallback to a default image if user_id is missing
            }

            const posterName = document.createElement("span");
            posterName.classList.add("poster-name");
            posterName.textContent = post.posterName || "Anonymous"; // Default name if not provided

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
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Call loadPosts when the page is loaded to fetch initial posts
window.onload = async function () {
    loadPosts();  // Fetch and display posts when the page loads
    await fetchUserSession(); // Fetch session on page load
};


