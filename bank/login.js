document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const messageBox = document.getElementById("messageBox");

    if (!loginForm) {
        console.error("Login form not found! Make sure the ID is correct.");
        return; // Stop script execution if form is missing
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            messageBox.textContent = "Please enter both username and password.";
            messageBox.style.color = "red";
            return;
        }

        try {
            const response = await fetch("/.netlify/functions/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include", // Ensures cookies/session are stored
            });

            const data = await response.json();

            if (response.ok && data.success) {
                messageBox.textContent = "Login successful! Redirecting...";
                messageBox.style.color = "green";

                setTimeout(() => {
                    window.location.href = "asb.html"; // Redirect to main page
                }, 1500);
            } else {
                messageBox.textContent = "Invalid username or password.";
                messageBox.style.color = "red";
            }
        } catch (error) {
            console.error("Login error:", error);
            messageBox.textContent = "Something went wrong. Try again.";
            messageBox.style.color = "red";
        }
    });
});
