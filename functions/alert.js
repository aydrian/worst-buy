exports.handler = async function (event, context) {
  // your server-side functionality
  if (event.httpMethod === "GET") {
    // Get Alerts
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello World" })
    };
  } else if (event.httpMethod === "POST") {
    // Subscribe to list
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello World" })
    };
  } else if (event.httpMethod === "DELETE") {
    // Unsubscribe from list
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello World" })
    };
  } else {
    return {
      statusCode: 405
    };
  }
};
