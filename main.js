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
      const newPost = document.createElement('div');
      newPost.classList.add('post');
      newPost.textContent = postContent;
      
      document.getElementById('feed').prepend(newPost); // Add new post to the top of the feed
      
      // Reset the form and hide the popup
      document.getElementById('postForm').reset();
      document.getElementById('popupLayer').style.display = 'none';
    }
  });
  