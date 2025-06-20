const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  try {
    const { requester_id, account_number, amount } = JSON.parse(event.body || "{}");

    if (!requester_id || !account_number || !amount || amount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Invalid input" }),
      };
    }

    // Find the receiver's user ID from the bank_users table
    const { data: receiver, error: receiverError } = await supabase
      .from("bank_users")
      .select("id")
      .eq("account_number", account_number)
      .single();

    if (receiverError || !receiver) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: "Recipient not found" }),
      };
    }

    // Add request to the requests table
    const { error: insertError } = await supabase
      .from("requests")
      .insert([
        {
          requesterId: requester_id,
          receiverId: receiver.id,
          amount: amount
        }
      ]);

    if (insertError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: "Failed to submit request" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("submitRequest error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Server error" }),
    };
  }
};

