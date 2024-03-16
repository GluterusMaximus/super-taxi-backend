import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../constants/saltRounds.js';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', SALT_ROUNDS),
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', SALT_ROUNDS),
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', SALT_ROUNDS),
  },
];

export default users;
