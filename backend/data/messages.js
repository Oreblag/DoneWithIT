const messages = [
  {
    id: 1,
    content: "Hey! Is this item still available?",
    senderId: 2,        // buyer's user ID
    recipientId: 1,      // seller's user ID
    listingId: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    content: "Hey! Is this item still available?",
    senderId: 3,        // buyer's user ID
    recipientId: 2,      // seller's user ID
    listingId: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    content: "Hey! Is this item still available?",
    senderId: 4,        // buyer's user ID
    recipientId: 3,      // seller's user ID
    listingId: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    content: "Hey! Is this item still available?",
    senderId: 5,        // buyer's user ID
    recipientId: 4,      // seller's user ID
    listingId: 4,
    createdAt: new Date().toISOString(),
  },
  
];

module.exports = messages;