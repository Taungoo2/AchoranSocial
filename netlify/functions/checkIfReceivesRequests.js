const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const { account_number } = JSON.parse(event.body || "{}");

  if (!account_number) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Missing account number" }),
    };
  }

  const { data, error } = await supabase
    .from("bank_users")
    .select("requests")
    .eq("account_number", account_number)
    .single();

  if (error || !data) {
    return {
      statusCode: 404,
      body: JSON.stringify({ success: false, message: "Account not found" }),
    };
  }

  if (data.requests === false) {
    return {
      statusCode: 403,
      body: JSON.stringify({ success: false, message: "User does not accept requests" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
