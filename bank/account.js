document.addEventListener("DOMContentLoaded", async () => {
  console.log("account.js loaded");

  const sessionId = getCookie("session_id");
  if (!sessionId) return;

  try {
    const res = await fetch("/.netlify/functions/getAccountInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId })
    });

    const data = await res.json();
    console.log("Account data:", data);

    if (data.success) {
      document.getElementById("account-username").textContent = data.username;
      document.getElementById("account-number").textContent = `Account Number: ${data.account_number}`;
      document.getElementById("account-created").textContent = `Member since: ${formatDate(data.created_at)}`;
    } else {
      console.warn("Account info fetch failed:", data.message);
    }
  } catch (err) {
    console.error("Error fetching account info:", err);
  }
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function formatDate(rawDate) {
  const date = new Date(rawDate);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
