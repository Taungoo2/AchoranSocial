const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const { account_number, session_id } = JSON.parse(event.body || "{}");

  if (!account_number || !session_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Missing input" }),
    };
  }

  const { data, error } = await supabase
    .from("bank_users")
    .select("id")
    .eq("account_number", account_number)
    .single();

  if (error || !data) {
    return {
      statusCode: 404,
      body: JSON.stringify({ success: false, message: "Account not found" }),
    };
  }

if (String(data.id) === String(session_id)) { {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Cannot transfer to yourself" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, recipient_id: data.id }),
  };
};
