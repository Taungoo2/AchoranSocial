window.onload = async function () {
    try {
        const sessionRes = await fetch("/.netlify/functions/check-session", {
            credentials: "include",
        });

        const sessionData = await sessionRes.json();

        if (!sessionData.loggedIn || !sessionData.userId) {
            document.querySelector(".account-placeholder").innerHTML = "<p>You must be logged in to view this page.</p>";
            return;
        }

        const accountRes = await fetch(`/.netlify/functions/get-account-info?userId=${sessionData.userId}`);
        const accountData = await accountRes.json();

        if (!accountData.username || !accountData.password) {
            document.querySelector(".account-placeholder").innerHTML = "<p>Account information could not be loaded.</p>";
            return;
        }

        document.querySelector(".account-placeholder").innerHTML = `
            <div class="account-info">
                <div>
                    <p><strong>Username:</strong> ${accountData.username}</p>
                    <p><strong>Password:</strong> ${accountData.password}</p>
                </div>
                <label class="switch">
                    <input type="checkbox" id="accountToggle">
                    <span class="slider"></span>
                </label>
            </div>
        `;
    } catch (err) {
        console.error("Error loading account data:", err);
        document.querySelector(".account-placeholder").innerHTML = "<p>Error loading account information.</p>";
    }
};
