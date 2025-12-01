const fetch = require("node-fetch");

const EXPO_PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";

/**
 * Send a push notification via Expo
 * @param {string|string[]} token - single token or array of Expo push tokens
 * @param {object} message - { title, body, data }
 */
async function sendPushNotification(token, message) {
  const tokens = Array.isArray(token) ? token : [token];

  // Expo requires messages in this format
  const messages = tokens.map(t => ({
    to: t,
    sound: "default",
    title: message.title,
    body: message.body,
    data: message.data || {},
  }));

  try {
    const response = await fetch(EXPO_PUSH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    });

    const data = await response.json();
    console.log("Expo push response:", data);
    return data;
  } catch (err) {
    console.error("Error sending push notification:", err);
  }
}

module.exports = { sendPushNotification };
