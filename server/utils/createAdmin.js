import readline from 'readline';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Helper to ask a question with regular visible text
const askQuestion = (rl, query) => {
  return new Promise((resolve) => rl.question(query, (ans) => resolve(ans.trim())));
};

// Helper to prompt for password with masked characters (*) in terminal
const askHiddenPassword = (query) => {
  return new Promise((resolve) => {
    process.stdout.write(query);

    let password = '';
    const isRaw = process.stdin.isRaw;

    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    const onData = (char) => {
      // Handle Ctrl+C
      if (char === '\u0003') {
        process.stdout.write('\n');
        process.exit(1);
      }

      // Enter key (Carriage return / Line feed)
      if (char === '\r' || char === '\n' || char === '\u0004') {
        if (process.stdin.setRawMode) {
          process.stdin.setRawMode(isRaw);
        }
        process.stdin.pause();
        process.stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(password);
        return;
      }

      // Backspace or Delete
      if (char === '\u0008' || char === '\x7f' || char === '\b') {
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write('\b \b');
        }
        return;
      }

      // Append printable characters
      if (char.length === 1 && char.charCodeAt(0) >= 32) {
        password += char;
        process.stdout.write('*');
      }
    };

    process.stdin.on('data', onData);
  });
};

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validatePasswordComplexity = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter (A-Z).';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter (a-z).';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one numeric digit (0-9).';
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return 'Password must contain at least one special character (e.g. !@#$%^&*).';
  }
  return null;
};

const main = async () => {
  console.log('\n========================================================');
  console.log('       MUNICIPAL ADMIN ACCOUNT INITIALIZATION');
  console.log('========================================================\n');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citizen_portal';

  try {
    process.stdout.write('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log(' Connected successfully.\n');
  } catch (err) {
    console.error('\n[Database Error] Could not connect to MongoDB:', err.message);
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    // 1. Admin Name
    let name = '';
    while (!name) {
      name = await askQuestion(rl, 'Admin Full Name: ');
      if (!name) {
        console.log('-> Error: Admin name cannot be blank.');
      }
    }

    // 2. Admin Email
    let email = '';
    while (!email) {
      const inputEmail = await askQuestion(rl, 'Admin Email Address: ');
      if (!validateEmail(inputEmail)) {
        console.log('-> Error: Please enter a valid email address (e.g. admin@city.gov).');
        continue;
      }

      // Check for existing account
      const existingUser = await User.findOne({ email: inputEmail.toLowerCase() });
      if (existingUser) {
        if (existingUser.role === 'admin') {
          console.log(`-> Error: An administrator with email "${inputEmail}" already exists.`);
          continue;
        } else {
          const promote = await askQuestion(
            rl,
            `User "${inputEmail}" currently exists as a citizen. Upgrade to administrator? (y/n): `
          );
          if (promote.toLowerCase() !== 'y' && promote.toLowerCase() !== 'yes') {
            continue;
          }
        }
      }
      email = inputEmail.toLowerCase();
    }

    // Close standard readline interface before hidden password prompts
    rl.close();

    // 3. Admin Password (Masked)
    let password = '';
    while (!password) {
      const inputPass = await askHiddenPassword('Admin Security Password: ');
      const complexityError = validatePasswordComplexity(inputPass);
      if (complexityError) {
        console.log(`-> Error: ${complexityError}`);
        continue;
      }

      // 4. Confirm Password
      const confirmPass = await askHiddenPassword('Confirm Admin Password: ');
      if (inputPass !== confirmPass) {
        console.log('-> Error: Passwords do not match. Please try again.');
        continue;
      }

      password = inputPass;
    }

    // Check / Save User in Database
    let admin = await User.findOne({ email });

    if (admin) {
      // Update existing user to admin
      admin.name = name;
      admin.password = password; // pre-save hook will hash it
      admin.role = 'admin';
      await admin.save();
      console.log(`\n✔ Existing account upgraded to Administrator: ${email}`);
    } else {
      // Create new admin
      admin = await User.create({
        name,
        email,
        password, // pre-save hook will hash it
        role: 'admin',
      });
      console.log(`\n✔ Municipal Administrator created successfully: ${email}`);
    }

    // 5. Check if legacy default admin exists (admin@portal.gov)
    if (email !== 'admin@portal.gov') {
      const oldDefault = await User.findOne({ email: 'admin@portal.gov' });
      if (oldDefault) {
        const rlCleanup = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        const removeOld = await askQuestion(
          rlCleanup,
          '\nLegacy default account "admin@portal.gov" was found in database. Remove it now for security? (Y/n): '
        );
        rlCleanup.close();

        if (removeOld.toLowerCase() === 'y' || removeOld.toLowerCase() === 'yes' || removeOld === '') {
          await User.deleteOne({ email: 'admin@portal.gov' });
          console.log('✔ Legacy default admin account (admin@portal.gov) removed.');
        } else {
          console.log('ℹ Legacy default account retained.');
        }
      }
    }

    console.log('\n========================================================');
    console.log(' Administrator account is ready.');
    console.log(' You can now sign in at http://localhost:5173/admin/login');
    console.log('========================================================\n');
  } catch (err) {
    console.error('\n[Creation Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

main();
