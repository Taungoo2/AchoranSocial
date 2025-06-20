const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const { account_id, amount } = JSON.parse(event.body || "{}");

  const { data, error } = await supabase
    .from("bank_users")
    .select("balance")
    .eq("id", account_id)
    .single();

  if (error || !data || data.balance < amount) {
    return { statusCode: 400, body: JSON.stringify({ success: false }) };
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};

//h
