const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.warn('No ADMIN_EMAIL/ADMIN_PASSWORD in .env; skip seeding admin');
    return;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Admin exists:', email);
    return;
  }

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  const passwordHash = await bcrypt.hash(password, saltRounds);

  await User.create({
    fullName,
    email,
    passwordHash,
    role: 'admin'
  });

  console.log('Admin created:', email);
};