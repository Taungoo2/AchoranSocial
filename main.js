// Function to get user ID from sessionStorage
function getUserId() {
    return sessionStorage.getItem("user_id"); // Retrieve user ID
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
    const userId = getUserId();  // Get user ID from sessionStorage

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
    
    // Fetch user session from backend if necessary
    fetch('/.netlify/functions/get-session')
        .then(response => response.json())
        .then(data => {
            if (data.user_id) {
                sessionStorage.setItem("user_id", data.user_id);
                console.log("User session restored:", data.user_id);
            } else {
                console.log("No active session found.");
            }
        })
        .catch(error => console.error('Error fetching session:', error));
};

