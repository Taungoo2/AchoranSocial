// netlify/functions/add-post.js
const { createClient } = require('@supabase/supabase-js');

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    const { content } = JSON.parse(event.body); // Get content from the request body

    // Insert the new post into the "posts" table in Supabase
    const { data, error } = await supabase
      .from('posts')
      .insert([{ content }]);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to add post', error }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Post added successfully!', post: data }),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
  };
};
