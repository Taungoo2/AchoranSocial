// netlify/functions/get-posts.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

exports.handler = async function(event, context) {
  try {
    // Fetch posts from Supabase, sorted by timestamp in descending order
    const { data, error } = await supabase
      .from('posts')  // Ensure this matches your table name in Supabase
      .select('content, timestamp')  // Fetch only the 'content' and 'timestamp' columns
      .order('timestamp', { ascending: false });  // Sort by timestamp (newest first)

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching posts', error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),  // Return posts as JSON
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: error.message }),
    };
  }
};

