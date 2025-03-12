const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client using Netlify environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async function(event, context) {
  try {
    // Fetch posts from Supabase, sorted by 'id' in descending order
    const { data, error } = await supabase
      .from('posts')  // Make sure this matches your Supabase table name
      .select('id, content')  // Select both 'id' and 'content' to show the post and its ID
      .order('id', { ascending: false });  // Order by ID, newest first

    if (error) {
      console.error('Error fetching posts:', error.message);
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
    console.error('Server error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: error.message }),
    };
  }
};

