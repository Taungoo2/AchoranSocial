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

    // Parse the request body to get the content
    const { content } = JSON.parse(event.body);

    // Check if content is empty
    if (!content || content.trim() === '') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Post content cannot be empty' }),
      };
    }

    // Insert the post content into the 'posts' table in Supabase
    const { data, error } = await supabase
      .from('posts')  // Make sure the table name matches your Supabase table
      .insert([{ content }]); // Insert the post content

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



