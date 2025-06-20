const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
  const { code } = JSON.parse(event.body || "{}");

  const { data, error } = await supabase
    .from("checks")
    .select("account_id, amount")
    .eq("code", code)
    .single();

  if (error || !data) {
    return { statusCode: 404, body: JSON.stringify({ success: false }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, check: data })
  };
};
