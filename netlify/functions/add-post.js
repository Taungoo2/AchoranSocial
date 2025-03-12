// netlify/functions/add-post.js
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const postData = JSON.parse(event.body); // Get post data from frontend
    
    const filePath = path.join(__dirname, '../../posts.json');
    
    // Read current posts from the JSON file
    let posts = [];
    if (fs.existsSync(filePath)) {
      posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    
    posts.push(postData);  // Add the new post to the array
    
    // Save the updated posts back to the file
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));  

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Post added successfully!' }),
    };
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }
};
