const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  try {
    const { from_id, to_id, amount } = JSON.parse(event.body || "{}");

    if (!from_id || !to_id || !amount || amount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Invalid input" }),
      };
    }

    // Subtract from sender
    const { error: subtractError } = await supabase
      .rpc("adjust_balance", { user_id: from_id, delta: -amount });

    // Add to recipient
    const { error: addError } = await supabase
      .rpc("adjust_balance", { user_id: to_id, delta: amount });

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
  } catch (err) {
    console.error("transferById error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Server error" }),
    };
  }
};

