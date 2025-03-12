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

            const newPostElement = document.createElement('div');
            newPostElement.classList.add('post');
            newPostElement.textContent = newPost.content; // Display the content of the new post
            document.getElementById('feed').prepend(newPostElement);

            document.getElementById('postForm').reset();
            document.getElementById('popupLayer').style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
  
