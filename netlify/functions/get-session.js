const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async (event, context) => {
    try {
        const { user } = await supabase.auth.getUser(event.headers.cookie);

        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Not logged in" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ user_id: user.id }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error", details: error.message }),
        };
    }
};
