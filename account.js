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
            <p><strong>Password:</strong> 
                <span id="passwordField" class="password-hidden">••••••</span>
            </p>
        </div>
        <label class="switch">
            <input type="checkbox" id="accountToggle">
            <span class="slider"></span>
        </label>
    </div>
`;

    document.getElementById("passwordField").addEventListener("click", function () {
        const isHidden = this.classList.contains("password-hidden");
        this.textContent = isHidden ? accountData.password : "••••••";
        this.classList.toggle("password-hidden");
    });

    } catch (err) {
        console.error("Error loading account data:", err);
        document.querySelector(".account-placeholder").innerHTML = "<p>Error loading account information.</p>";
    }

    // Check light_mode cookie on load to set switch state
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

const toggle = document.getElementById("accountToggle");
const lightMode = getCookie("light_mode");

if (lightMode === "2") {
    toggle.checked = true;
} else {
    toggle.checked = false;
}

toggle.addEventListener("change", async () => {
    try {
        await fetch("/.netlify/functions/toggle-theme", {
            credentials: "include"
        });
        setTimeout(() => location.reload(), 1000);
    } catch (err) {
        console.error("Failed to toggle theme:", err);
    }
});

};
