const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Method Not Allowed" }),
    };
  }

  const { session_id } = JSON.parse(event.body || "{}");

  if (!session_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Missing session_id" }),
    };
  }

  const { data, error } = await supabase
    .from("bank_users")
    .select("user, account_number, created_at")
    .eq("id", session_id)
    .single();

  if (error || !data) {
    return {
      statusCode: 404,
      body: JSON.stringify({ success: false, message: "User not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      username: data.user,
      account_number: data.account_number,
      created_at: data.created_at,
    }),
  };
};
