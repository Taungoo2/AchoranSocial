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
    
    const postContent = document.getElementById('postContent').value;
    
    if (postContent.trim() !== '') {
        const newPost = {
            content: postContent,
            timestamp: new Date().toISOString() // Add a timestamp to each post
        };

        fetch('/.netlify/functions/add-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost), // Send the new post content
        })
        .then(response => response.json())
        .then(data => {
            console.log('Post added:', data);

            // Reload posts after adding a new one
            loadPosts();  // Refresh the feed

            document.getElementById('postForm').reset();
            document.getElementById('popupLayer').style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

// Fetch posts from the get-posts function
async function loadPosts() {
    try {
        const response = await fetch('/.netlify/functions/get-posts');
        const posts = await response.json();
        console.log(posts);  // Log the posts to check the data structure

        const feed = document.getElementById('feed');
        feed.innerHTML = '';  // Clear current posts before adding the new ones

        // Check if posts are fetched successfully
        if (Array.isArray(posts)) {
            posts.forEach(post => {
                const postElement = document.createElement('li');  // Use list items for displaying posts
                postElement.classList.add('post');
                postElement.textContent = post.content;  // Display the content from the 'content' column
                feed.appendChild(postElement);
            });
        } else {
            console.error('Failed to load posts: Invalid response');
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Call loadPosts() when the page loads
window.onload = function() {
    loadPosts();  // Fetch and display posts when the page loads
};

