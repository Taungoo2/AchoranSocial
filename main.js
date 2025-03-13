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
    const userId = sessionStorage.getItem("user_id"); // Get user ID from sessionStorage

    // Check if the user is logged in
    if (!userId) {
        alert("You must be logged in to post.");
        return;
    }

    if (postContent !== '') {
        const newPost = {
            content: postContent,
            timestamp: new Date().toISOString(), // Add timestamp
            user_id: userId // Attach the user ID
        };

        fetch('/.netlify/functions/add-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost), // Send the new post data
        })
        .then(response => response.json())
        .then(data => {
            console.log('Post added:', data);

            // Reload posts after adding a new one
            loadPosts();  

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
    
    // Loop through all posts and display them
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');

      // Add profile picture, name, and timestamp
      const postHeader = document.createElement('div');
      postHeader.classList.add('post-header');
      
      const profileImg = document.createElement('img');
      profileImg.classList.add('profile-img');
      profileImg.src = post.profilePictureUrl;  // Assuming profile picture URL is available

      const posterName = document.createElement('span');
      posterName.classList.add('poster-name');
      posterName.textContent = post.posterName;  // Assuming poster name is available

      const timestamp = document.createElement('span');
      timestamp.classList.add('timestamp');
      timestamp.textContent = new Date(post.timestamp).toLocaleString();  // Format timestamp

      // Append profile, name, and timestamp to the post header
      postHeader.appendChild(profileImg);
      postHeader.appendChild(posterName);
      postHeader.appendChild(timestamp);

      // Add post content
      const postContent = document.createElement('p');
      postContent.textContent = post.content;  // Display the post content

      // Append header and content to the post element
      postElement.appendChild(postHeader);
      postElement.appendChild(postContent);

      feed.appendChild(postElement);  // Add the post to the feed
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// Call loadPosts when the page is loaded to fetch initial posts
window.onload = function() {
  loadPosts();  // Fetch and display posts when the page loads
};
