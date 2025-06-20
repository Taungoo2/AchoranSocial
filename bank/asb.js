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

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popup");
  const closeBtn = document.getElementById("popup-close");
  const submitBtn = document.getElementById("popup-submit");
  const messageBox = document.getElementById("popup-message");
  const transferBtn = document.getElementById("transfer-btn");

  let currentPopup = "transfer";

  transferBtn.addEventListener("click", () => {
    popup.classList.remove("hidden");
    document.getElementById("popup-title").textContent = "Transfer";
    currentPopup = "transfer";
    messageBox.textContent = "";
  });

  closeBtn.addEventListener("click", () => popup.classList.add("hidden"));

  submitBtn.addEventListener("click", async () => {
    if (currentPopup === "transfer") {
      const amount = parseFloat(document.getElementById("transfer-balance").value);
      const accountNum = document.getElementById("transfer-number").value.trim();
      const sessionId = getCookie("session_id");

      if (!sessionId || !amount || amount <= 0 || !accountNum) {
        messageBox.textContent = "Fill all fields correctly.";
        return;
      }

      // Step 1: Check balance
      const checkBalance = await fetch("/.netlify/functions/checkBalance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, amount })
      }).then(res => res.json());

      if (!checkBalance.success) {
        messageBox.textContent = "Insufficient funds.";
        return;
      }

      // Step 2: Check account exists
      const checkAccount = await fetch("/.netlify/functions/checkAccountNumber", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account_number: accountNum, session_id: sessionId })
    }).then(res => res.json());
    
    if (!checkAccount.success) {
      messageBox.textContent = checkAccount.message || "Invalid account number.";
      return;
    }

      // Step 3: Perform transfer
      const doTransfer = await fetch("/.netlify/functions/performTransfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, amount, to_account: accountNum })
      }).then(res => res.json());

      if (doTransfer.success) {
        messageBox.style.color = "green";
        messageBox.textContent = "Transfer successful!";
        setTimeout(() => location.reload(), 1000);
      } else {
        messageBox.style.color = "red";
        messageBox.textContent = "Transfer failed.";
      }
    }
  });
});

const withdrawBtn = document.getElementById("withdraw-btn");

withdrawBtn.addEventListener("click", () => {
  popup.classList.remove("hidden");
  document.getElementById("popup-title").textContent = "Withdraw";
  currentPopup = "withdraw";

  // Replace popup body for withdraw
  document.getElementById("popup-body").innerHTML = `
    <input type="number" id="withdraw-amount" placeholder="Amount to withdraw" />
    <button id="popup-submit">Submit</button>
    <p id="popup-message"></p>
  `;

  // Rebind submit listener
  document.getElementById("popup-submit").addEventListener("click", async () => {
    const amount = parseFloat(document.getElementById("withdraw-amount").value);
    const messageBox = document.getElementById("popup-message");
    const sessionId = getCookie("session_id");

    if (!sessionId || !amount || amount <= 0) {
      messageBox.textContent = "Enter a valid amount.";
      return;
    }

    try {
      const res = await fetch("/.netlify/functions/withdrawCheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, amount })
      });

      const data = await res.json();

      if (data.success) {
        messageBox.style.color = "green";
        messageBox.textContent = `Withdrawal code: ${data.code}`;
      } else {
        messageBox.style.color = "red";
        messageBox.textContent = "Withdrawal failed.";
      }
    } catch (err) {
      console.error("Withdraw error:", err);
    }
  });
});

const depositBtn = document.getElementById("deposit-btn");

depositBtn.addEventListener("click", () => {
  popup.classList.remove("hidden");
  document.getElementById("popup-title").textContent = "Deposit";
  currentPopup = "deposit";

  document.getElementById("popup-body").innerHTML = `
    <input type="text" id="check-code" maxlength="6" placeholder="Enter check code" />
    <button id="popup-submit">Submit</button>
    <p id="popup-message"></p>
  `;

  document.getElementById("popup-submit").addEventListener("click", async () => {
    const code = document.getElementById("check-code").value.trim().toUpperCase();
    const messageBox = document.getElementById("popup-message");
    const sessionId = getCookie("session_id");

    if (!code || code.length !== 6 || !sessionId) {
      messageBox.textContent = "Invalid code.";
      return;
    }

    // Step 1: verify check
    const verify = await fetch("/.netlify/functions/verifyCheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    }).then(res => res.json());

    if (!verify.success) {
      messageBox.textContent = "Check not found.";
      return;
    }

    // Step 2: check funds on sender account
    const fundCheck = await fetch("/.netlify/functions/canFundCheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account_id: verify.check.account_id, amount: verify.check.amount })
    }).then(res => res.json());

    if (!fundCheck.success) {
      messageBox.textContent = "Check issuer has insufficient funds.";
      return;
    }

    // Step 3: transfer funds from check issuer to current user
    const transfer = await fetch("/.netlify/functions/transferById", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from_id: verify.check.account_id,
        to_id: sessionId,
        amount: verify.check.amount
      })
    }).then(res => res.json());


    // Step 4: delete check
    await fetch("/.netlify/functions/removeCheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    messageBox.style.color = "green";
    messageBox.textContent = `Check deposited successfully: M${verify.check.amount}`;
    setTimeout(() => {
      location.reload();
    }, 1000);
  });
});

const requestBtn = document.getElementById("request-btn");

requestBtn.addEventListener("click", () => {
  popup.classList.remove("hidden");
  document.getElementById("popup-title").textContent = "Request";
  currentPopup = "request";

  document.getElementById("popup-body").innerHTML = `
    <input type="number" id="request-amount" placeholder="Amount to request" />
    <input type="text" id="request-account" placeholder="Account number to request from" />
    <button id="popup-submit">Submit</button>
    <p id="popup-message"></p>
  `;

  document.getElementById("popup-submit").addEventListener("click", async () => {
    const amount = parseFloat(document.getElementById("request-amount").value.trim());
    const accountNumber = document.getElementById("request-account").value.trim();
    const message = document.getElementById("popup-message");
    const sessionId = getCookie("session_id");

    message.textContent = "";

    if (!amount || amount <= 0 || !accountNumber) {
      message.textContent = "Please enter a valid amount and account number.";
      message.style.color = "red";
      return;
    }

    try {
      const check = await fetch("/.netlify/functions/checkIfReceivesRequests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: accountNumber })
      }).then(res => res.json());

      if (!check.success) {
        message.textContent = check.message || "Recipient does not accept requests.";
        message.style.color = "red";
        return;
      }

      const submit = await fetch("/.netlify/functions/submitRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requester_id: sessionId,
          account_number: accountNumber,
          amount: amount
        })
      }).then(res => res.json());

      if (!submit.success) {
        message.textContent = submit.message || "Failed to create request.";
        message.style.color = "red";
        return;
      }

      message.textContent = "Request sent successfully.";
      message.style.color = "green";

      setTimeout(() => {
        location.reload();
      }, 1000);

    } catch (err) {
      console.error("Request error:", err);
      message.textContent = "An unexpected error occurred.";
      message.style.color = "red";
    }
  });
});

