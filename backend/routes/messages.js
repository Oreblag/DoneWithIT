const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendPushNotifications } = require('../utilities/pushNotifications');

// Import dummy data
const messages = require('../data/messages');
const users = require('../data/users');           // assuming you have users array
const listings = require('../store/listings');     // assuming you have listings array
const pushTokens = require('../data/pushTokens');

// Helper to get next ID
let nextMessageId = messages.length + 1;

// POST /api/messages
router.post('/', auth, async (req, res) => {
  const { message, listingId } = req.body;
  const senderId = req.user.userId; // from auth middleware

  try {
    // 1. Find the listing to get the seller
    const listing = listings.find(l => l.id === listingId);
    if (!listing) {
      return res.status(404).send({ error: 'Listing not found.' });
    }

    // 2. Create new message object
    const newMessage = {
      id: nextMessageId++,
      content: message,
      senderId,
      recipientId: listing.sellerId, // assumes your listing has sellerId
      listingId,
      createdAt: new Date().toISOString(),
    };
    messages.push(newMessage);

    // 3. Get seller's push tokens
    const sellerTokens = pushTokens
      .filter(pt => pt.userId === listing.sellerId)
      .map(pt => pt.token);

    if (sellerTokens.length > 0) {
      await sendPushNotifications(sellerTokens, {
        title: `New message about: ${listing.title}`,
        body: message,
        data: {
          screen: 'Messages',
          params: { listingId: listing.id }
        }
      });
    }

    res.status(201).send(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send({ error: 'Failed to send message.' });
  }
});

// GET /api/messages
router.get('/', auth, (req, res) => {
  const userId = req.user.userId;
  const { listingId } = req.query;

  // Filter messages where user is recipient (or you might also want sent messages)
  let userMessages = messages.filter(m => m.recipientId === userId);
  
  if (listingId) {
    userMessages = userMessages.filter(m => m.listingId === parseInt(listingId));
  }

  // Optionally enrich with sender info
  const enriched = userMessages.map(m => ({
    ...m,
    sender: users.find(u => u.id === m.senderId)?.name || 'Unknown',
  }));

  res.send(enriched);
});

// DELETE /api/messages/:id
router.delete('/:id', auth, (req, res) => {
  const userId = req.user.userId;
  const messageId = parseInt(req.params.id);

  const messageIndex = messages.findIndex(m => m.id === messageId);
  if (messageIndex === -1) {
    return res.status(404).send({ error: 'Message not found.' });
  }

  const message = messages[messageIndex];
  // Allow deletion if user is sender or recipient
  if (message.senderId !== userId && message.recipientId !== userId) {
    return res.status(403).send({ error: 'Access denied.' });
  }

  messages.splice(messageIndex, 1);
  res.status(204).send();
});

module.exports = router;