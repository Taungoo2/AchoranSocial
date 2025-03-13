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

    // Parse the request body to get the content and user_id
    const { content, user_id } = JSON.parse(event.body);

    // Check if the user is logged in
    if (!user_id) {
      return {
        statusCode: 401, // Unauthorized
        body: JSON.stringify({ message: 'User must be logged in to post' }),
      };
    }

    // Check if content is empty
    if (!content || content.trim() === '') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Post content cannot be empty' }),
      };
    }

    // Insert the post content and user_id into the 'posts' table in Supabase
    const { data, error } = await supabase
      .from('posts')  // Ensure table name matches your Supabase setup
      .insert([{ content, user_id }]); // Insert both content and user_id

    // Check if there was an error with the insert
    if (error) {
      console.error('Supabase Insert Error:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error adding post', error: error.message }),
      };
    }

    // Return the success message along with inserted data
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Post added successfully', data }),
    };

  } catch (error) {
    // General error handling
    console.error('Server Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: error.message }),
    };
  }
};



