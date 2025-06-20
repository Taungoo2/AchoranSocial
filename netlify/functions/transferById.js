const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const { from_id, to_id, amount } = JSON.parse(event.body || "{}");

  if (!from_id || !to_id || !amount || amount <= 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Invalid input" }),
    };
  }

  // Fetch sender balance
  const { data: fromUser, error: fromError } = await supabase
    .from("bank_users")
    .select("balance")
    .eq("id", from_id)
    .single();

  if (fromError || !fromUser || fromUser.balance < amount) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Insufficient funds" }),
    };
  }

  // Fetch recipient to confirm they exist
  const { data: toUser, error: toError } = await supabase
    .from("bank_users")
    .select("id, balance")
    .eq("id", to_id)
    .single();

  if (toError || !toUser) {
    return {
      statusCode: 404,
      body: JSON.stringify({ success: false, message: "Recipient not found" }),
    };
  }

  // Subtract from sender
  const { error: subtractError } = await supabase
    .from("bank_users")
    .update({ balance: fromUser.balance - amount })
    .eq("id", from_id);

  // Add to recipient
  const { error: addError } = await supabase
    .from("bank_users")
    .update({ balance: toUser.balance + amount })
    .eq("id", to_id);

  if (subtractError || addError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Transfer failed" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
