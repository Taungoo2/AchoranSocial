const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client using Netlify environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async function(event, context) {
  try {
    // Fetch posts from Supabase, sorted by 'id' in descending order
    const { data, error } = await supabase
      .from('posts')  // Make sure this matches your Supabase table name
      .select('id, content, timestamp, user_id')  // Select 'id', 'content', 'timestamp', and 'user_id'
      .order('id', { ascending: false });  // Order by ID, newest first

    if (error) {
      console.error('Error fetching posts:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching posts', error: error.message }),
      };
    }

    // Fetch usernames associated with each post using user_id
    const postsWithUsernames = await Promise.all(data.map(async (post) => {
      const { data: userData, error: userError } = await supabase
        .from('users')  // Make sure 'users' table exists and contains the username
        .select('username')  // Assuming 'username' column exists in 'users' table
        .eq('id', post.user_id)
        .single();

      if (userError) {
        console.error('Error fetching username:', userError.message);
        post.posterName = "Anonymous";  // Default to "Anonymous" if no username is found
      } else {
        post.posterName = userData.username;  // Assign the username to the post
      }

      return post;
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(postsWithUsernames),  // Return posts with usernames
    };
  } catch (error) {
    console.error('Server error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: error.message }),
    };
  }
};
