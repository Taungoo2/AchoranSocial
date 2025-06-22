exports.handler = async (event) => {
    const cookies = event.headers.cookie || "";
    const currentValue = cookies.split("; ").find(row => row.startsWith("light_mode="))?.split("=")[1];

    let newValue = "2"; // default if no cookie
    if (currentValue === "1") newValue = "2";
    else if (currentValue === "2") newValue = "1";

    return {
        statusCode: 200,
        headers: {
            "Set-Cookie": `light_mode=${newValue}; Path=/; Max-Age=31536000; SameSite=Strict`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ light_mode: newValue }),
    };
};
