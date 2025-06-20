const { createClient } = require("@supabase/supabase-js");
const cookie = require("cookie");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    const { username, password } = JSON.parse(event.body);

    // Check if user exists
    const { data: user, error } = await supabase
        .from("users")
        .select("id, password")
        .eq("username", username)
        .single();

    if (error || !user || user.password !== password) {
        return {
            statusCode: 401,
            body: JSON.stringify({ success: false, error: "Invalid credentials" }),
        };
    }

    // Create session cookie
    const sessionCookie = cookie.serialize("session_id", user.id, {
        httpOnly: false,
        secure: true,
        sameSite: "Strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return {
        statusCode: 200,
        headers: {
            "Set-Cookie": sessionCookie,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ success: true }),
    };
    exports.handler = async (event) => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { username, password } = JSON.parse(event.body);

    const { data, error } = await supabase
        .from("users")
        .select("id, password") 
        .eq("username", username)
        .single();

    if (error || !data || data.password !== password) {
        return { statusCode: 401, body: JSON.stringify({ success: false }) };
    }

    return {
        statusCode: 200,
        headers: {
            "Set-Cookie": `session_id=${data.id}; Path=/; HttpOnly; Secure; SameSite=Strict`,
        },
        body: JSON.stringify({ success: true }),
    };
};
};
