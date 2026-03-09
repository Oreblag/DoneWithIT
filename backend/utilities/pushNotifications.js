// utilities/pushNotifications.js
const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
// Optionally provide an access token if you have enabled push security
const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN, // Only if you set up access tokens
});

/**
 * Send push notifications to multiple recipients
 * @param {Array} pushTokens - Array of Expo push tokens
 * @param {Object} messageData - Notification content
 * @param {string} messageData.title - Notification title
 * @param {string} messageData.body - Notification body
 * @param {Object} messageData.data - Additional data payload
 * @param {string} messageData.sound - Sound to play (default: 'default')
 * @param {number} messageData.badge - Badge count
 * @returns {Promise<Array>} - Array of tickets from Expo
 */
async function sendPushNotifications(pushTokens, messageData) {
  // Create the messages array
  const messages = [];
  
  for (const pushToken of pushTokens) {
    // Validate each push token
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    // Construct the message
    messages.push({
      to: pushToken,
      sound: messageData.sound || 'default',
      title: messageData.title || 'New Notification',
      body: messageData.body,
      data: messageData.data || {},
      badge: messageData.badge,
      // Optional: Add custom priority, channelId, etc.
      // priority: 'high',
      // channelId: 'default',
    });
  }

  if (messages.length === 0) {
    console.log('No valid messages to send');
    return [];
  }

  // The Expo push service accepts batches of notifications
  // We chunk them to stay within the limits (max 100 per request)
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  // Send each chunk
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log('Push notification tickets:', ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending push notification chunk:', error);
    }
  }

  return tickets;
}

/**
 * Check receipts for push notifications to verify delivery
 * @param {Array} receiptIds - Array of receipt IDs from the tickets
 * @returns {Promise<Object>} - Receipts object
 */
async function checkPushReceipts(receiptIds) {
  if (!receiptIds || receiptIds.length === 0) {
    return {};
  }

  // Chunk receipt IDs (Expo accepts up to 1000 per request)
  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  const receipts = {};

  for (const chunk of receiptIdChunks) {
    try {
      const receiptChunk = await expo.getPushNotificationReceiptsAsync(chunk);
      Object.assign(receipts, receiptChunk);
    } catch (error) {
      console.error('Error fetching push receipts:', error);
    }
  }

  return receipts;
}

/**
 * Handle failed notifications (e.g., DeviceNotRegistered errors)
 * @param {Array} tickets - Array of tickets from sendPushNotifications
 * @param {Function} removeTokenCallback - Callback to remove invalid tokens from DB
 */
async function handleFailedNotifications(tickets, removeTokenCallback) {
  // Collect all receipt IDs from successful sends
  const receiptIds = tickets
    .filter(ticket => ticket.status === 'ok')
    .map(ticket => ticket.id);

  if (receiptIds.length === 0) return;

  // Wait a bit for receipts to be available (optional but recommended)
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Get receipts
  const receipts = await checkPushReceipts(receiptIds);

  // Process each receipt
  for (const [receiptId, receipt] of Object.entries(receipts)) {
    if (receipt.status === 'error') {
      console.error(`Receipt ${receiptId} has error:`, receipt.message);
      
      // Handle specific error codes
      if (receipt.details && receipt.details.error) {
        const errorCode = receipt.details.error;
        
        switch (errorCode) {
          case 'DeviceNotRegistered':
            // The token is no longer valid – remove it from your database
            console.log('Device not registered – removing token');
            if (removeTokenCallback) {
              // Find the token associated with this receipt
              // Note: You'd need to store mapping between receipt IDs and tokens
              await removeTokenCallback(receipt.details.expoPushToken);
            }
            break;
            
          case 'MessageTooBig':
            console.error('Notification message too big');
            break;
            
          case 'InvalidCredentials':
            console.error('Invalid Expo credentials');
            break;
            
          default:
            console.error(`Unhandled error code: ${errorCode}`);
        }
      }
    }
  }
}

/**
 * Send notification to a single recipient (convenience wrapper)
 */
async function sendPushNotification(pushToken, messageData) {
  return sendPushNotifications([pushToken], messageData);
}

module.exports = {
  sendPushNotification,
  sendPushNotifications,
  checkPushReceipts,
  handleFailedNotifications,
  Expo, // Export Expo class for token validation
};