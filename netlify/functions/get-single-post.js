const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client using Netlify environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async function(event, context) {
  try {
    const postId = event.queryStringParameters.id; // Get post ID from query params

    if (!postId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Post ID is required" }),
      };
    }

    // Fetch the single post, including username from the users table
    const { data, error } = await supabase
      .from('posts')
      .select('id, content, user_id, timestamp, users(username)')
      .eq('id', postId)
      .single(); // Ensure only one post is retrieved

    if (error) {
      console.error('Error fetching post:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching post', error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data), // Return post data
    };
  } catch (error) {
    console.error('Server error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: error.message }),
    };
  }
};

