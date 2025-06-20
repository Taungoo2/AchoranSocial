const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const { account_number } = JSON.parse(event.body || "{}");

  const { data, error } = await supabase
    .from("bank_users")
    .select("id")
    .eq("account_number", account_number)
    .single();

  if (error || !data) {
    return { statusCode: 404, body: JSON.stringify({ success: false }) };
  }

  return { statusCode: 200, body: JSON.stringify({ success: true, recipient_id: data.id }) };
};
