const path = require('path');

const getPublicPath = () => path.join(__dirname, '..', 'public');

module.exports = { getPublicPath };