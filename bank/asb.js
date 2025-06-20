// Define cookie reader
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Wait for DOM, then fetch balance
document.addEventListener("DOMContentLoaded", async () => {
  console.log("asb.js loaded");

  const sessionId = getCookie("session_id");
  console.log("Session ID:", sessionId);
  if (!sessionId) return;

  try {
    const res = await fetch("/.netlify/functions/getBalance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId })
    });

    const data = await res.json();
    console.log("Data:", data);
    if (data.success && typeof data.balance === "number") {
      document.getElementById("account-balance").textContent = `M${data.balance}`;
    } else {
      console.warn("Failed to fetch balance:", data.message);
    }
  } catch (err) {
    console.error("Error getting balance:", err);
  }
});
