const cookie = require("cookie");

exports.handler = async (event) => {
    const cookies = cookie.parse(event.headers.cookie || "");
    const userId = cookies.session_id || null;

    return {
        statusCode: 200,
        body: JSON.stringify({ loggedIn: !!userId, userId }),
    };
};
