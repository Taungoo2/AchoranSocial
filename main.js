// Function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to check if the user is logged in
function getUserId() {
    let sessionCookie = getCookie("session_id");  // Try to get the session cookie
    let userId = sessionStorage.getItem("user_id"); // Fallback to sessionStorage

    console.log("Session Cookie:", sessionCookie);
    console.log("Session Storage User ID:", userId);

    return sessionCookie || userId; // Use either the cookie or sessionStorage
}

// Handling the Add Post button and popup
document.getElementById('addPostBtn').addEventListener('click', function() {
    document.getElementById('popupLayer').style.display = 'flex'; // Show the popup
});

// Handling the closing of the popup if clicked outside the popup content
document.getElementById('popupLayer').addEventListener('click', function(event) {
    if (event.target === document.getElementById('popupLayer')) {
        document.getElementById('popupLayer').style.display = 'none'; // Hide the popup
    }
});

// Handling the post form submission
document.getElementById('postForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const postContent = document.getElementById('postContent').value.trim();
    const userId = getUserId();  // Get user ID from cookies or sessionStorage

    if (!userId) {
        alert("You must be logged in to post.");
        return;
    }

    if (postContent !== '') {
        const newPost = {
            content: postContent,
            timestamp: new Date().toISOString(),
            user_id: userId
        };

        console.log("New Post Data:", newPost);  // Debugging: Log the post before sending

        fetch('/.netlify/functions/add-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Post added:', data);
            loadPosts();  // Reload posts

            document.getElementById('postForm').reset();
            document.getElementById('popupLayer').style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

// Fetch posts from Supabase and display them in order by id
async function loadPosts() {
    try {
        const response = await fetch('/.netlify/functions/get-posts');
        const posts = await response.json();
        
        const feed = document.getElementById('feed');
        feed.innerHTML = '';  // Clear current posts before adding new ones

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            // Post Header (Profile Pic, Name, Timestamp)
            const postHeader = document.createElement('div');
            postHeader.classList.add('post-header');

            const profileImg = document.createElement('img');
            profileImg.classList.add('profile-img');
            profileImg.src = post.profilePictureUrl || 'default-profile.png'; // Fallback image

            const posterName = document.createElement('span');
            posterName.classList.add('poster-name');
            posterName.textContent = post.posterName || "Unknown User";

            const timestamp = document.createElement('span');
            timestamp.classList.add('timestamp');
            timestamp.textContent = new Date(post.timestamp).toLocaleString();

            postHeader.appendChild(profileImg);
            postHeader.appendChild(posterName);
            postHeader.appendChild(timestamp);

            // Post Content
            const postContent = document.createElement('p');
            postContent.textContent = post.content;

            postElement.appendChild(postHeader);
            postElement.appendChild(postContent);
            feed.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Run when the page loads
window.onload = function() {
    loadPosts();
    console.log("All Cookies:", document.cookie);  // Debugging: Log all cookies
};

