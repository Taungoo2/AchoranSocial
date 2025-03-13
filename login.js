document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const response = await fetch("/.netlify/functions/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            credentials: "include", // Ensures cookies are stored
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = "feed.html"; // Redirect after login
        } else {
            alert("Invalid username or password.");
        }
    });
});
