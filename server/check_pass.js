import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const run = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/citizen_portal');
  const user = await User.findOne({ email: 'admin@municipality.gov' }).select('+password');
  console.log('User found:', !!user);
  if (user) {
    const tests = ['Admin@12345', 'admin@12345', '--', 'admin@municipality.gov', 'admin', 'Admin@123', 'admin123', 'password'];
    for (const t of tests) {
      const match = await bcrypt.compare(t, user.password);
      console.log(`Password "${t}": ${match}`);
    }
  }
  await mongoose.disconnect();
};

run();
