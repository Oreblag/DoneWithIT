// If you ever need to transform data before sending
const toDto = (listing) => ({
  id: listing.id,
  title: listing.title,
  price: listing.price,
  image: listing.image,
});

module.exports = { toDto };