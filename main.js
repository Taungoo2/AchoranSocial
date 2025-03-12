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
document.getElementById('postForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const postContent = document.getElementById('postContent').value.trim();

    if (postContent !== '') {
        const newPost = {
            content: postContent,
            timestamp: new Date().toISOString() // Add timestamp
        };

        try {
            const response = await fetch('/.netlify/functions/add-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost),
            });

            const result = await response.json();
            console.log('Server response:', result);

            if (response.ok) {
                // Add the new post immediately to the feed
                addPostToFeed(newPost);

                // Reset the form and close the popup
                document.getElementById('postForm').reset();
                document.getElementById('popupLayer').style.display = 'none';

                // Reload all posts (optional, but ensures consistency)
                loadPosts();
            } else {
                alert('Failed to add post: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});

// Function to fetch and display posts
async function loadPosts() {
    try {
        const response = await fetch('/.netlify/functions/get-posts');
        const posts = await response.json();

        const feed = document.getElementById('feed');
        feed.innerHTML = '';  // Clear current posts before adding new ones

        posts.forEach(post => {
            addPostToFeed(post);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Function to add a single post to the feed
function addPostToFeed(post) {
    const feed = document.getElementById('feed');

    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.textContent = post.content;

    // Add new post to the top
    feed.prepend(postElement);
}

// Call loadPosts() when the page loads
window.onload = function() {
    loadPosts();  // Fetch and display posts when the page loads
};


