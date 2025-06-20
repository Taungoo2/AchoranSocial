const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const { requester_id, account_number, amount } = JSON.parse(event.body || "{}");

  if (!requester_id || !account_number || !amount || amount <= 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Invalid input" }),
    };
  }

  // Get receiver's id
  const { data: receiverUser, error: receiverError } = await supabase
    .from("bank_users")
    .select("id")
    .eq("account_number", account_number)
    .single();

  if (receiverError || !receiverUser) {
    return {
      statusCode: 404,
      body: JSON.stringify({ success: false, message: "Recipient not found" }),
    };
  }

  const receiverId = receiverUser.id;

  // Get next available ID for request
  const { data: lastRow, error: lastRowError } = await supabase
    .from("requests")
    .select("id")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  const newId = lastRow && lastRow.id ? lastRow.id + 1 : 1;

  // Insert new request
  const { error: insertError } = await supabase
    .from("requests")
    .insert([
      {
        id: newId,
        recieverId: receiverId,
        requesterId: requester_id,
        amount: amount
      }
    ]);

  if (insertError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Failed to create request" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
