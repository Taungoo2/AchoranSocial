// Fetch posts from Supabase and display them in order by id
async function loadPosts() {
    try {
        // Fetch posts from the 'posts' table, ordered by 'id' ascending
        const response = await fetch('/.netlify/functions/get-posts');
        const posts = await response.json();

        const feed = document.getElementById('feed');
        feed.innerHTML = '';  // Clear current posts before adding the new ones

        // Add six empty slots to the feed
        for (let i = 0; i < 6; i++) {
            const emptySlot = document.createElement('div');
            emptySlot.classList.add('post');
            emptySlot.textContent = `Slot ${i + 1} (Empty)`;
            feed.appendChild(emptySlot);
        }

        // Add posts to the feed ordered by 'id'
        let i = 0; // Index for the posts
        while (i < posts.length && i < 6) {  // Only loop for 6 posts max
            const post = posts[i];
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.textContent = post.content;  // Display post content
            feed.children[i].textContent = post.content;  // Replace empty slots with actual content
            i++;
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Call loadPosts() when the page loads
window.onload = function() {
    loadPosts();  // Fetch and display posts when the page loads
};

