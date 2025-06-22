const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
    const userId = event.queryStringParameters.userId;

    if (!userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing userId" }),
        };
    }

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
        .from("users")
        .select("username, password")
        .eq("id", userId)
        .single();

    if (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            username: data.username,
            password: data.password,
        }),
    };
};
