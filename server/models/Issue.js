import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'],
    required: true,
  },
  remark: {
    type: String,
    default: '',
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
  changedBy: {
    type: String,
    default: 'Citizen',
  },
});

const issueSchema = new mongoose.Schema(
  {
    issueId: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an issue title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Road / Pothole',
        'Street Light',
        'Garbage / Waste',
        'Water Supply',
        'Drainage',
        'Public Infrastructure',
        'Traffic',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please specify the location or address'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Submitted',
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminRemark: {
      type: String,
      default: '',
      trim: true,
    },
    statusHistory: [statusHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Pre-save to ensure unique issueId and initial status history
issueSchema.pre('save', async function (next) {
  if (!this.issueId) {
    const randomSuffix = String(Math.floor(100000 + Math.random() * 900000));
    const dateStr = new Date().getFullYear();
    this.issueId = `CIR-${dateStr}-${randomSuffix}`;
  }

  // Initialize status history if empty
  if (this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status || 'Submitted',
      remark: 'Issue submitted by citizen',
      changedAt: new Date(),
      changedBy: 'Citizen',
    });
  }

  next();
});

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
