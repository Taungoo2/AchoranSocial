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
    const response = await fetch('/.netlify/functions/get-posts');
    const posts = await response.json();
    
    const feed = document.getElementById('feed');
    feed.innerHTML = '';  // Clear current posts before adding the new ones
    
    // Add six empty slots (or more if you want)
    for (let i = 0; i < 6; i++) {
      const emptySlot = document.createElement('div');
      emptySlot.classList.add('post');
      emptySlot.textContent = '[blank]';  // Placeholder for the posts
      feed.appendChild(emptySlot);
    }

    // Populate the posts in reverse order (newest to oldest)
    let i = 0;
    while (i < posts.length && i < 6) {  // Only loop for 6 posts max
      const post = posts[i];
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.textContent = post.content;  // Display the post content
      feed.children[i].textContent = post.content;  // Replace empty slot with actual content
      i++;
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

window.onload = function() {
  loadPosts();  // Fetch and display posts when the page loads
};

