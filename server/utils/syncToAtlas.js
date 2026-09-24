import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

/**
 * Non-destructive migration script to copy existing users and issues
 * from local MongoDB into a remote MongoDB Atlas database.
 * Preserves exact existing bcrypt password hashes, object IDs, and timestamps.
 *
 * Usage:
 *   node utils/syncToAtlas.js "mongodb+srv://<user>:<password>@cluster0.mongodb.net/citizen_portal"
 */
const run = async () => {
  const localUri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/citizen_portal';
  const targetUri = process.argv[2] || process.env.TARGET_MONGODB_URI;

  if (!targetUri) {
    console.error('Error: Please provide target MongoDB Atlas URI.');
    console.error('Usage: node utils/syncToAtlas.js "<MongoDB_Atlas_URI>"');
    process.exit(1);
  }

  console.log('--- Database Synchronization Utility ---');
  console.log(`[Source] Connecting to local MongoDB: ${localUri}`);

  let localConn;
  let targetConn;

  try {
    localConn = await mongoose.createConnection(localUri).asPromise();
    console.log('[Source] Connected to local MongoDB.');

    console.log('[Target] Connecting to MongoDB Atlas...');
    targetConn = await mongoose.createConnection(targetUri).asPromise();
    console.log('[Target] Connected to MongoDB Atlas.');

    // 1. Sync Users
    const localUsers = await localConn.collection('users').find({}).toArray();
    console.log(`[Sync] Found ${localUsers.length} user records locally.`);

    let usersSynced = 0;
    for (const u of localUsers) {
      await targetConn.collection('users').updateOne(
        { _id: u._id },
        { $set: u },
        { upsert: true }
      );
      usersSynced++;
    }
    console.log(`[Sync] Successfully migrated/upserted ${usersSynced} users to Atlas.`);

    // 2. Sync Issues
    const localIssues = await localConn.collection('issues').find({}).toArray();
    console.log(`[Sync] Found ${localIssues.length} issue records locally.`);

    let issuesSynced = 0;
    for (const issue of localIssues) {
      await targetConn.collection('issues').updateOne(
        { _id: issue._id },
        { $set: issue },
        { upsert: true }
      );
      issuesSynced++;
    }
    console.log(`[Sync] Successfully migrated/upserted ${issuesSynced} issues to Atlas.`);

    console.log('\n--- Sync Complete ---');
    console.log('All local users (including admin with existing bcrypt hash) and issues are present in Atlas.');
  } catch (err) {
    console.error('[Sync Error]:', err.message);
  } finally {
    if (localConn) await localConn.close();
    if (targetConn) await targetConn.close();
    process.exit(0);
  }
};

run();
