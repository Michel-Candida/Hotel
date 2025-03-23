const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (inputPassword, storedHash) => {
  console.log("Input password:", inputPassword);  // Log para ver a senha fornecida
  console.log("Stored hash:", storedHash);  // Log para ver o hash armazenado no banco
  const isMatch = await bcrypt.compare(inputPassword, storedHash);
  console.log("Password match:", isMatch);  // Log para verificar o resultado da comparação
  return isMatch;
};


module.exports = { hashPassword, comparePassword };
