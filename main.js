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

            // Create a post element and display the content
            const newPostElement = document.createElement('div');
            newPostElement.classList.add('post');
            newPostElement.textContent = newPost.content; // Display the content of the new post
            newPostElement.addEventListener('click', function() {
                showPostPopup(newPost.content); // Show post content in a popup when clicked
            });

            document.getElementById('feed').prepend(newPostElement);

            document.getElementById('postForm').reset();
            document.getElementById('popupLayer').style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

// Function to show a post content in a popup
function showPostPopup(content) {
    const postPopup = document.getElementById('postContentPopup');
    postPopup.querySelector('.popup-content').textContent = content; // Set the content in the popup
    postPopup.style.display = 'flex'; // Show the popup
}

// Handling the closing of the post content popup if clicked outside the popup content
document.getElementById('postContentPopup').addEventListener('click', function(event) {
    if (event.target === document.getElementById('postContentPopup')) {
        document.getElementById('postContentPopup').style.display = 'none'; // Hide the popup
    }
});

// Fetch posts from the get-posts function
async function loadPosts() {
    const response = await fetch('/.netlify/functions/get-posts');
    const posts = await response.json();

    const feed = document.getElementById('feed');
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.textContent = post.content; // Display post content

        // Add event listener for post click to show in popup
        postElement.addEventListener('click', function() {
            showPostPopup(post.content);
        });

        feed.appendChild(postElement);
    });
}

loadPosts(); // Call the function to load posts on page load

