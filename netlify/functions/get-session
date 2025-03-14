exports.handler = async (event) => {
    const cookies = event.headers.cookie || "";
    const sessionId = cookies.split("; ").find((row) => row.startsWith("session_id="))?.split("=")[1];

    if (!sessionId) {
        return { statusCode: 401, body: JSON.stringify({ loggedIn: false }) };
    }

    return { statusCode: 200, body: JSON.stringify({ loggedIn: true, userId: sessionId }) };
};
