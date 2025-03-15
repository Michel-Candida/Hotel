const bcrypt = require('bcrypt');

// Function to generate the password hash
async function hashPassword(password) {
  const saltRounds = 10; // Number of rounds to generate the salt
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

// Function to compare the password with the stored hash
async function comparePassword(password, hash) {
  const match = await bcrypt.compare(password, hash);
  return match; // Returns true if the password matches the hash
}

// Export functions
module.exports = {
  hashPassword,
  comparePassword,
};
