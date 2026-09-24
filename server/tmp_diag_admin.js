import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citizen_portal';

const run = async () => {
  await mongoose.connect(uri);
  const user = await User.findOne({ email: 'admin@municipality.gov' }).select('+password');
  if (!user) {
    console.log('ADMIN_MISSING');
    await mongoose.disconnect();
    return;
  }

  const hash = user.password;
  console.log(
    JSON.stringify({
      role: user.role,
      hashType: typeof hash,
      hashLen: hash && hash.length,
      isBcrypt: typeof hash === 'string' && hash.startsWith('$2'),
    })
  );

  const candidates = [
    'Admin@12345',
    'admin@12345',
    'Citizen@12345',
    'password',
    'admin',
    'Admin123',
    'undefined',
    '--',
  ];
  for (const c of candidates) {
    const ok = await bcrypt.compare(c, hash);
    console.log(`candidate ${c}: ${ok}`);
  }

  const withoutSelect = await User.findOne({ email: 'admin@municipality.gov' });
  console.log('passwordLoadedWithoutSelect', withoutSelect.password !== undefined);

  const probePlain = 'DiagProbe_Only1!';
  withoutSelect.password = probePlain;
  console.log('isModifiedPassword', withoutSelect.isModified('password'));
  console.log('valueBeforeSaveIsBcrypt', String(withoutSelect.password).startsWith('$2'));
  await withoutSelect.save();

  const after = await User.findOne({ email: 'admin@municipality.gov' }).select('+password');
  const matchProbe = await after.matchPassword(probePlain);
  console.log(
    JSON.stringify({
      afterSaveMatchProbe: matchProbe,
      hashChanged: after.password !== hash,
    })
  );

  // Restore previous hash directly so we do not leave the probe password
  await mongoose.connection.collection('users').updateOne(
    { email: 'admin@municipality.gov' },
    { $set: { password: hash } }
  );
  const restored = await User.findOne({ email: 'admin@municipality.gov' }).select('+password');
  console.log('restoredOriginalHash', restored.password === hash);

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
