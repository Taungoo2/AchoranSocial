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

// Fetch posts from Supabase and display them in order by id
async function loadPosts() {
    try {
        alert("loadPosts function is being called!"); // Alert to check if the function is triggered
        const response = await fetch('/.netlify/functions/get-posts.js');
        
        // Log the raw response to see what data is returned
        const posts = await response.json();
        console.log("Fetched posts: ", posts);  // Debugging log to check the posts' data

        const feed = document.getElementById('feed');
        feed.innerHTML = '';  // Clear current posts before adding the new ones

        // Add six empty slots to the feed
        for (let i = 0; i < 6; i++) {
            const emptySlot = document.createElement('div');
            emptySlot.classList.add('post');
            emptySlot.textContent = '[blank]'; // Display blank text
            feed.appendChild(emptySlot);
        }

        // Check if posts have content
        if (posts && posts.length > 0) {
            // Add posts to the feed ordered by 'id'
            let i = 0; // Index for the posts
            while (i < posts.length && i < 6) {  // Only loop for 6 posts max
                const post = posts[i];
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.textContent = post.content;  // Display post content
                console.log(`Adding post: ${post.content}`); // Debugging log to check the content
                feed.children[i].textContent = post.content;  // Replace empty slots with actual content
                i++;
            }
        } else {
            console.log("No posts found or empty posts array.");
        }

    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Call loadPosts() when the page loads
window.onload = function() {
    loadPosts();  // Fetch and display posts when the page loads
};
