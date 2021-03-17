const { CourierClient } = require("@trycourier/courier");
const courier = CourierClient();

exports.handler = async function (event) {
  if (event.httpMethod === "GET") {
    // Get Alerts for User
    const { userId } = event.queryStringParameters;

    try {
      const { results } = await courier.lists.findByRecipientId(userId);
      return {
        statusCode: 200,
        body: JSON.stringify({ items: results })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error })
      };
    }
  }

  const { sku, userId } = JSON.parse(event.body);
  const listsId = `worstbuy.${sku}.restock`;

  if (event.httpMethod === "POST") {
    // Subscribe User to list
    try {
      await courier.lists.subscribe(listsId, userId);
      return {
        statusCode: 204
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error })
      };
    }
  } else if (event.httpMethod === "DELETE") {
    // Unsubscribe User from list
    try {
      await courier.lists.unsubscribe(listsId, userId);
      return {
        statusCode: 204
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error })
      };
    }
  } else {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }
};
