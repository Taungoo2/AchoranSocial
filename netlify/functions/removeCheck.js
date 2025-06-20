const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  try {
    const { code } = JSON.parse(event.body || "{}");

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing code" }),
      };
    }

    const { error } = await supabase
      .from("checks")
      .delete()
      .eq("code", code);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: "Database error" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("removeCheck error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Server error" }),
    };
  }
};

