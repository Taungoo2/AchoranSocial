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

    // Fetch the single post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, content, user_id, timestamp')
      .eq('id', postId)
      .single(); // Ensure only one post is retrieved

    if (postError) {
      console.error('Error fetching post:', postError.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching post', error: postError.message }),
      };
    }

    // Fetch the username from the 'users' table based on user_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('username')
      .eq('id', post.user_id)
      .single(); // Fetch the username of the user who made the post

    if (userError) {
      console.error('Error fetching user:', userError.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching user', error: userError.message }),
      };
    }

    // Add the username to the post data
    post.username = user ? user.username : "Anonymous";

    return {
      statusCode: 200,
      body: JSON.stringify(post), // Return post with username added
    };
  } catch (error) {
    console.error('Server error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: error.message }),
    };
  }
};


