import client from "./client";

const send = (message, listingId) =>
  client.post("/messages", {
    message,
    listingId,
});

const getMessages = (listingId) => {
  const endpoint = listingId ? `/messages?listingId=${listingId}` : "/messages";
  return client.get(endpoint);
};

const deleteMessage = (messageId) => client.delete(`/messages/${messageId}`);

export default {
  send,
  getMessages,
  deleteMessage,
};
