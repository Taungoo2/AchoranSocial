const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event, context) => {
    try {
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        const { data, error } = await supabase.auth.getSession(); // ✅ Correct function

        if (error) {
            throw new Error(error.message);
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error", details: error.message }),
        };
    }
};
