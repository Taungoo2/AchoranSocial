// netlify/functions/add-post.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client using Netlify environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async function(event, context) {
  try {
    // Ensure the request is a POST request
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    // Parse the request body
    const { content } = JSON.parse(event.body);

    // Check if content is empty
    if (!content || content.trim() === '') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Post content cannot be empty' }),
      };
    }

    // Insert the post into the 'posts' table
    const { data, error } = await supabase
      .from('posts')  // Ensure this matches your actual table name in Supabase
      .insert([{ content }]); // Insert post content

    // Debugging logs
    console.log('Supabase Insert Response:', data, error);

    if (error) {
      console.error('Supabase Error:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error adding post', error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Post added successfully', data }),
    };

  } catch (error) {
    console.error('Server Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: error.message }),
    };
  }
};


