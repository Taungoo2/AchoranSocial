const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async function(event) {
    const postId = new URLSearchParams(event.queryStringParameters).get("id");

    if (!postId) {
        return { statusCode: 400, body: JSON.stringify({ message: "Post ID is required" }) };
    }

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('id, content, user_id, timestamp')
            .eq('id', postId)
            .single(); 

        if (error || !data) {
            return { statusCode: 404, body: JSON.stringify({ message: "Post not found" }) };
        }

        return { statusCode: 200, body: JSON.stringify(data) };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Server error", error: error.message }) };
    }
};
