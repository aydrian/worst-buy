exports.handler = async function (event, context) {
  // your server-side functionality
  if (event.httpMethod === "GET") {
    return { statusCode: 204 };
  } else if (event.httpMethod === "POST") {
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Hello World" })
    };
  } else {
    return {
      statusCode: 405
    };
  }
};
