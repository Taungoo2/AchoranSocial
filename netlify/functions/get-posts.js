// netlify/functions/get-posts.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client using environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async function(event, context) {
  try {
    // Fetch posts from Supabase, ordered by 'id' (or whichever column you prefer)
    const { data, error } = await supabase
      .from('posts')  // Ensure this matches your Supabase table name
      .select('id, content')  // Select the 'id' and 'content' columns (add any other columns if needed)
      .order('id', { ascending: true });  // Order posts by 'id' in ascending order (you can change this to 'descending' if you want the latest posts first)

    // Check for errors in fetching data
    if (error) {
      console.error('Error fetching posts:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching posts', error: error.message }),
      };
    }

    // Return the posts as JSON
    return {
      statusCode: 200,
      body: JSON.stringify(data),  // Send the posts as JSON response
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
