const lightMode = document.cookie.includes("light_mode=2");

document.getElementById("light-theme").disabled = !lightMode;
document.getElementById("dark-theme").disabled = lightMode;

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
    document.getElementById("popupLayer").style.display = "flex";
});

// Handling the closing of the popup if clicked outside the popup content
document.getElementById("popupLayer").addEventListener("click", function (event) {
    if (event.target === document.getElementById("popupLayer")) {
        document.getElementById("popupLayer").style.display = "none";
    }
});

// Handle the post form submission
document.getElementById("postForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const postContent = document.getElementById("postContent").value.trim();
    const userId = await fetchUserSession();

    const submitBtn = this.querySelector("button[type='submit']");
    if (submitBtn.disabled) return;
    submitBtn.disabled = true; 

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

        console.log("New Post Data:", newPost);

        fetch("/.netlify/functions/add-post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost),
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Post added:", data);
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
        feed.innerHTML = "";

        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            const postLink = document.createElement("a");
            postLink.href = `post.html?id=${post.id}`;
            postLink.classList.add("post-link");

            const postHeader = document.createElement("div");
            postHeader.classList.add("post-header");

            const profileImg = document.createElement("img");
            profileImg.classList.add("profile-img");
            profileImg.src = `/Assets/${post.user_id}.png`;

            const posterName = document.createElement("span");
            posterName.classList.add("poster-name");
            posterName.textContent = post.posterName || "Anonymous";

            const timestamp = document.createElement("span");
            timestamp.classList.add("timestamp");
            timestamp.textContent = new Date(post.timestamp).toLocaleString();

            postHeader.appendChild(profileImg);
            postHeader.appendChild(posterName);
            postHeader.appendChild(timestamp);

            const shareImg = document.createElement("img");
            shareImg.src = lightMode ? "/Assets/lightshare.png" : "/Assets/share.png";
            shareImg.alt = "Share";
            shareImg.classList.add("share-btn");

            shareImg.addEventListener("click", (e) => {
                e.stopPropagation();
                e.preventDefault();
                const shareURL = `https://achoransocial.site/.netlify/functions/post-preview?id=${post.id}`;
                navigator.clipboard.writeText(shareURL)
                    .then(() => {
                        shareImg.classList.add("copied");
                        setTimeout(() => {
                            shareImg.classList.remove("copied");
                        }, 1500);
                    })
                    .catch(err => {
                        console.error("Clipboard copy failed:", err);
                    });
            });

            postHeader.appendChild(shareImg);

            const postContent = document.createElement("p");
            postContent.innerHTML = marked.parse(post.content);

            postLink.appendChild(postHeader);
            postLink.appendChild(postContent);

            postElement.appendChild(postLink);
            feed.appendChild(postElement);
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Call loadPosts when the page is loaded to fetch initial posts
window.onload = async function () {
    loadPosts();
    await fetchUserSession();

    const postContentEl = document.getElementById("postContent");
    const charCountEl = document.getElementById("charCount");

    postContentEl.addEventListener("input", () => {
        charCountEl.textContent = `${postContentEl.value.length} / 500`;
    });
};


