const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

exports.handler = async function(event, context) {
    try {
        const { content } = JSON.parse(event.body); // Get content from request

        if (!content) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Post content is required' }),
            };
        }

        const { data, error } = await supabase
            .from('posts')  // Make sure this matches your table name!
            .insert([{ content }]);  // Insert into the content column

        if (error) {
            console.error('Supabase error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error inserting post', error: error.message }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Post added successfully', data }),
        };
    } catch (error) {
        console.error('Server error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error', error: error.message }),
        };
    }
};



