const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Method Not Allowed" }),
    };
  }

  const { session_id, amount } = JSON.parse(event.body || "{}");

  if (!session_id || !amount || amount <= 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Invalid input" }),
    };
  }

  const { data: user, error } = await supabase
    .from("bank_users")
    .select("id")
    .eq("id", session_id)
    .single();

  if (error || !user) {
    return {
      statusCode: 404,
      body: JSON.stringify({ success: false, message: "User not found" }),
    };
  }

  const code = generateCode();

  // ✅ Insert account_id, code, and amount into checks
  const { error: insertError } = await supabase
    .from("checks")
    .insert({ account_id: user.id, code, amount });

  if (insertError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Database error" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, code }),
  };
};

