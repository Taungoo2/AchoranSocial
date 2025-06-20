const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  console.log("submitRequest invoked");

  try {
    const { requester_id, account_number, amount } = JSON.parse(event.body || "{}");
    console.log("Received input:", { requester_id, account_number, amount });

    if (!requester_id || !account_number || !amount || amount <= 0) {
      console.warn("Invalid input");
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Invalid input" }),
      };
    }

    // Step 1: Lookup account_number to get receiverId
    const { data: receiver, error: receiverError } = await supabase
      .from("bank_users")
      .select("id")
      .eq("account_number", account_number)
      .single();

    if (receiverError || !receiver) {
      console.warn("Receiver not found or error:", receiverError);
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: "Recipient not found" }),
      };
    }

    console.log("Receiver ID:", receiver.id);

    // Step 2: Insert request into `requests` table
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
      console.error("Insert error:", insertError);
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: "Failed to submit request" }),
      };
    }

    console.log("Request successfully inserted");
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Unhandled error in submitRequest:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Server error" }),
    };
  }
};


