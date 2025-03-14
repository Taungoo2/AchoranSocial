document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const messageBox = document.getElementById("messageBox");

        try {
            const response = await fetch("/.netlify/functions/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include", // Ensures cookies/session are stored
            });

            const data = await response.json();

            if (data.success) {
                messageBox.textContent = "Login successful! Redirecting...";
                messageBox.style.color = "green";

                setTimeout(() => {
                    window.location.href = "index.html"; // Redirect to main page
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

