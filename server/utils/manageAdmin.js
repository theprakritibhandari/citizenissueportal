import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const ask = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
};

const parseArgs = () => {
  // Nested `npm run` often injects a literal "--" into argv. Ignore it.
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  return {
    email: args[0],
    password: args[1],
    name: args[2],
  };
};

const run = async () => {
  let { email, password, name } = parseArgs();

  if (!email) {
    email = await ask('Enter Admin Email (e.g. admin@municipality.gov): ');
  }
  if (!password) {
    password = await ask('Enter New Admin Password (min 6 characters): ');
  }

  email = typeof email === 'string' ? email.toLowerCase().trim() : '';
  password = typeof password === 'string' ? password : '';
  if (name) name = String(name).trim();

  if (!email || !password) {
    console.error('Error: Email and password are required.');
    console.error('Usage: npm run set-admin -- <email> "<password>" [name]');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('Error: Password must be at least 6 characters.');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citizen_portal';

  try {
    await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected to: ${mongoose.connection.host}/${mongoose.connection.name}`);

    let user = await User.findOne({ email }).select('+password');

    if (user) {
      user.password = password;
      user.markModified('password');
      user.role = 'admin';
      if (name) user.name = name;
      await user.save();
      console.log(`[Success] Existing user "${email}" updated to admin role with new password.`);
    } else {
      user = await User.create({
        name: name || 'Municipal Administrator',
        email,
        password,
        role: 'admin',
      });
      console.log(`[Success] New municipal administrator account created: "${email}".`);
    }

    const verified = await User.findOne({ email }).select('+password');
    const hashOk = typeof verified?.password === 'string' && verified.password.startsWith('$2');
    const passwordOk = verified ? await verified.matchPassword(password) : false;

    if (!hashOk || !passwordOk) {
      console.error('[Error] Password was written but bcrypt verification failed. Account was not left in a usable login state.');
      process.exit(1);
    }

    console.log('Account details:');
    console.log(`- Email: ${verified.email}`);
    console.log(`- Name:  ${verified.name}`);
    console.log(`- Role:  ${verified.role}`);
    console.log('- Password: stored as bcrypt hash and verified against the provided value.');
    console.log('\nYou can now log in at http://localhost:5173/admin/login');
  } catch (err) {
    console.error('[Error]:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

run();
