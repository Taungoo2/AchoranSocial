const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const { session_id, to_account, amount } = JSON.parse(event.body || "{}");

  const from = await supabase
    .from("bank_users")
    .select("balance")
    .eq("id", session_id)
    .single();

  if (!from.data || from.data.balance < amount) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: "Insufficient funds" }) };
  }

  const to = await supabase
    .from("bank_users")
    .select("id, balance")
    .eq("account_number", to_account)
    .single();

  if (!to.data) {
    return { statusCode: 404, body: JSON.stringify({ success: false, message: "Recipient not found" }) };
  }

  const subtract = await supabase
    .from("bank_users")
    .update({ balance: from.data.balance - amount })
    .eq("id", session_id);

  const add = await supabase
    .from("bank_users")
    .update({ balance: to.data.balance + amount })
    .eq("id", to.data.id);

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
