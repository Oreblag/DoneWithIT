// In your routes file (e.g., routes/notifications.js)
const express = require('express');
const router = express.Router();
const { sendPushNotifications, handleFailedNotifications } = require('../utilities/pushNotifications');
const db = require('../data/users'); // Your database models

// Example: Send notification to a user
router.post('/send-to-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, body, data } = req.body;
    
    // Fetch user's push tokens from database
    const user = await db.User.findByPk(userId, {
      include: [db.PushToken]
    });
    
    if (!user || !user.PushTokens || user.PushTokens.length === 0) {
      return res.status(404).json({ error: 'No push tokens found for user' });
    }
    
    const pushTokens = user.PushTokens.map(t => t.token);
    
    // Send notifications
    const tickets = await sendPushNotifications(pushTokens, {
      title,
      body,
      data
    });
    
    // Handle any failed tokens (optional, can be done later via cron job)
    await handleFailedNotifications(tickets, async (invalidToken) => {
      // Remove invalid token from database
      await db.PushToken.destroy({ where: { token: invalidToken } });
      console.log(`Removed invalid token: ${invalidToken}`);
    });
    
    res.json({ 
      success: true, 
      ticketCount: tickets.length,
      tickets 
    });
    
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;