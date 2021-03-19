const { CourierClient } = require("@trycourier/courier");
const courier = CourierClient();

exports.handler = async function (event) {
  // your server-side functionality
  if (event.httpMethod === "GET") {
    return { statusCode: 204 };
  } else if (event.httpMethod === "POST") {
    const { fields } = JSON.parse(event.body);
    let data = {};

    if (fields.itemsInStock["en-US"] > 0) {
      for (const [key, value] of Object.entries(fields)) {
        data[key] = value["en-US"];
      }

      const listId = `worstbuy.${data.sku}.restock`;

      // Send alert to list
      try {
        const { messageId } = await courier.lists.send({
          event: "WORSTBUY_RESTOCK_ALERT",
          list: listId,
          data
        });
        console.log(`Sent alert to ${listId}: ${messageId}`);
      } catch (err) {
        console.log(`An error occurred to sending to ${listId}:`, err);
      }

      // Clear the list
      /*
      try {
        await courier.lists.putSubscriptions(listId, [
          { recipientId: "NOBODY" }
        ]);
        await courier.lists.unsubscribe(listId, "NOBODY");
      } catch (err) {
        console.log(
          `An error occurred clearing subscribers from ${listId}:`,
          err
        );
      }
      */
    }

    return {
      statusCode: 200
    };
  } else {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }
};
