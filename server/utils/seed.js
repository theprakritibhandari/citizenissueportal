import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Issue from '../models/Issue.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citizen_portal';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    console.log('[Seed] Checking sample data...');

    // 1. Check/Seed Municipal Administrator Account
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@municipality.gov').toLowerCase().trim();
    let admin = await User.findOne({ email: adminEmail }).select('+password');
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD || 'Admin@12345';

    if (!admin) {
      admin = await User.create({
        name: process.env.ADMIN_NAME || 'Municipal Administrator',
        email: adminEmail,
        password: defaultAdminPassword,
        role: 'admin',
      });
      console.log(`[Seed] Municipal Administrator account initialized: ${adminEmail}`);
    } else {
      let needsSave = false;
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        needsSave = true;
      }
      // If ADMIN_PASSWORD is set in environment, sync it if different
      if (process.env.ADMIN_PASSWORD) {
        const matchesEnv = await admin.matchPassword(process.env.ADMIN_PASSWORD);
        if (!matchesEnv) {
          admin.password = process.env.ADMIN_PASSWORD;
          needsSave = true;
          console.log(`[Seed] Municipal Administrator password synchronized with ADMIN_PASSWORD environment variable.`);
        }
      }
      if (needsSave) {
        await admin.save();
      }
      console.log(`[Seed] Municipal Administrator account verified: ${adminEmail}`);
    }

    // 2. Check/Seed Sample Citizen User for testing/demo purposes if needed
    let citizen = await User.findOne({ email: 'jane@citizen.org' });
    if (!citizen) {
      citizen = await User.create({
        name: 'Jane Citizen',
        email: 'jane@citizen.org',
        password: 'Citizen@12345',
        role: 'citizen',
        phone: '+1 800-555-0123',
      });
      console.log('[Seed] Sample Citizen account verified: jane@citizen.org');
    }

    // 3. Seed Sample Issues if database has no issues
    const count = await Issue.countDocuments();
    if (count === 0 && citizen) {
      const sampleIssues = [
        {
          issueId: 'CIR-2026-000101',
          title: 'Deep hazardous pothole near Central Library crossing',
          category: 'Road / Pothole',
          description: 'A large crater-like pothole has opened up in the right lane right before the pedestrian zebra crossing. Multiple vehicles have suffered tire damage during evening rush hour.',
          location: 'Intersection of 5th Avenue & Main Street, Downtown Sector 4',
          priority: 'High',
          status: 'In Progress',
          user: citizen._id,
          adminRemark: 'Road Maintenance crew #3 assigned. Asphalt patch repair scheduled for Wednesday 8:00 AM.',
          statusHistory: [
            {
              status: 'Submitted',
              remark: 'Issue report submitted by citizen with location coordinates',
              changedAt: new Date(Date.now() - 4 * 86400000),
              changedBy: 'Jane Citizen',
            },
            {
              status: 'Under Review',
              remark: 'Verified by Ward Officer. Forwarded to Public Works Department.',
              changedAt: new Date(Date.now() - 3 * 86400000),
              changedBy: 'Municipal Administration',
            },
            {
              status: 'In Progress',
              remark: 'Road Maintenance crew #3 assigned. Asphalt patch repair scheduled for Wednesday 8:00 AM.',
              changedAt: new Date(Date.now() - 1 * 86400000),
              changedBy: 'Municipal Administration',
            },
          ],
        },
        {
          issueId: 'CIR-2026-000102',
          title: '3 consecutive flickering / non-functional streetlights',
          category: 'Street Light',
          description: 'The street lamps along the residential walkway behind Oakridge School are completely dark at night, causing safety concerns for women and students walking home.',
          location: 'Oakridge Avenue, Lane 7 near Community Park',
          priority: 'Medium',
          status: 'Submitted',
          user: citizen._id,
          adminRemark: '',
          statusHistory: [
            {
              status: 'Submitted',
              remark: 'Issue report submitted by citizen',
              changedAt: new Date(Date.now() - 12 * 3600000),
              changedBy: 'Jane Citizen',
            },
          ],
        },
        {
          issueId: 'CIR-2026-000103',
          title: 'Illegal commercial garbage dumping blocking storm drain',
          category: 'Garbage / Waste',
          description: 'Construction debris and discarded industrial plastic bags have been dumped along the canal bank, obstructing drainage flow and emitting foul odor.',
          location: 'Westside Canal Promenade, Pillar #42',
          priority: 'Urgent',
          status: 'Under Review',
          user: citizen._id,
          adminRemark: 'Sanitation inspection team dispatched to evaluate volume and identify responsible parties.',
          statusHistory: [
            {
              status: 'Submitted',
              remark: 'Issue report submitted by citizen',
              changedAt: new Date(Date.now() - 2 * 86400000),
              changedBy: 'Jane Citizen',
            },
            {
              status: 'Under Review',
              remark: 'Sanitation inspection team dispatched to evaluate volume and identify responsible parties.',
              changedAt: new Date(Date.now() - 18 * 3600000),
              changedBy: 'Municipal Administration',
            },
          ],
        },
        {
          issueId: 'CIR-2026-000104',
          title: 'Low water pressure and brown sediment in main municipal pipeline',
          category: 'Water Supply',
          description: 'Tap water has significant discoloration and low pressure for the past 48 hours affecting more than 30 households in Block C.',
          location: 'Greenwood Heights, Sector 12, Block C',
          priority: 'High',
          status: 'Resolved',
          user: citizen._id,
          adminRemark: 'Water pipeline flushed and valve pressure regulator replaced. Water quality certified safe.',
          statusHistory: [
            {
              status: 'Submitted',
              remark: 'Issue report submitted by citizen',
              changedAt: new Date(Date.now() - 7 * 86400000),
              changedBy: 'Jane Citizen',
            },
            {
              status: 'Under Review',
              remark: 'Water Authority inspection initiated.',
              changedAt: new Date(Date.now() - 6 * 86400000),
              changedBy: 'Municipal Administration',
            },
            {
              status: 'In Progress',
              remark: 'Main junction valve replacement underway.',
              changedAt: new Date(Date.now() - 4 * 86400000),
              changedBy: 'Municipal Administration',
            },
            {
              status: 'Resolved',
              remark: 'Water pipeline flushed and valve pressure regulator replaced. Water quality certified safe.',
              changedAt: new Date(Date.now() - 1 * 86400000),
              changedBy: 'Municipal Administration',
            },
          ],
        },
        {
          issueId: 'CIR-2026-000105',
          title: 'Traffic signal malfunction causing gridlock at Highway Bypass',
          category: 'Traffic',
          description: 'Traffic lights are stuck on flashing amber on all 4 sides of the intersection, creating chaotic traffic jams and near collisions.',
          location: 'North Bypass & Ring Road junction, Signal 14',
          priority: 'Urgent',
          status: 'In Progress',
          user: citizen._id,
          adminRemark: 'Traffic police traffic control unit on site; signal technician recalibrating PLC board.',
          statusHistory: [
            {
              status: 'Submitted',
              remark: 'Issue report submitted by citizen',
              changedAt: new Date(Date.now() - 5 * 3600000),
              changedBy: 'Jane Citizen',
            },
            {
              status: 'In Progress',
              remark: 'Traffic police traffic control unit on site; signal technician recalibrating PLC board.',
              changedAt: new Date(Date.now() - 2 * 3600000),
              changedBy: 'Municipal Administration',
            },
          ],
        },
      ];

      await Issue.create(sampleIssues);
      console.log(`[Seed] Seeded ${sampleIssues.length} sample civic issues successfully.`);
    }

    console.log('[Seed] Database verification complete.');
  } catch (error) {
    console.error('[Seed Error]', error.message);
  }
};

// If run directly via `node utils/seed.js`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}
