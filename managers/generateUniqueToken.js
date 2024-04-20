const uuid = require('uuid');

// Function to generate a unique token (UUID)
function generateUniqueToken() {
  return uuid.v4();
}

module.exports = generateUniqueToken;
