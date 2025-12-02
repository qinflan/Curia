const { Expo } = require("expo-server-sdk");
const expo = new Expo();

async function sendPushNotification(pushTokens, message) {
  const tokens = Array.isArray(pushTokens)
    ? pushTokens
    : [pushTokens];

  const validTokens = tokens.filter(t => Expo.isExpoPushToken(t));

  const messages = validTokens.map(t => ({
    to: t,
    sound: "default",
    title: message.title,
    body: message.body,
    data: message.data || {},
  }));

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (let chunk of chunks) {
    try {
      const receipt = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...receipt);
    } catch (err) {
      console.error("Expo push error:", err);
    }
  }

  return tickets;
}

module.exports = { sendPushNotification };
