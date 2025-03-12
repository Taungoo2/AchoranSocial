const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body);

    // Ensure content is provided
    if (!body.content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Content is required' }),
      };
    }

    // Insert the new post into Supabase
    const { data, error } = await supabase
      .from('posts')
      .insert([{ content: body.content, timestamp: new Date().toISOString() }]);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to add post', error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Post added successfully', data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: error.message }),
    };
  }
};



