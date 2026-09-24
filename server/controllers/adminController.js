import Issue from '../models/Issue.js';
import User from '../models/User.js';

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const submittedIssues = await Issue.countDocuments({ status: 'Submitted' });
    const underReviewIssues = await Issue.countDocuments({ status: 'Under Review' });
    const inProgressIssues = await Issue.countDocuments({ status: 'In Progress' });
    const resolvedIssues = await Issue.countDocuments({ status: 'Resolved' });
    const rejectedIssues = await Issue.countDocuments({ status: 'Rejected' });
    const totalCitizens = await User.countDocuments({ role: 'citizen' });

    // Category breakdown
    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Priority breakdown
    const priorityStats = await Issue.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent 6 issues for quick action
    const recentIssues = await Issue.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        totalIssues,
        submittedIssues,
        underReviewIssues,
        inProgressIssues,
        resolvedIssues,
        rejectedIssues,
        totalCitizens,
        categoryStats: categoryStats.map((item) => ({ category: item._id, count: item.count })),
        priorityStats: priorityStats.map((item) => ({ priority: item._id, count: item.count })),
        recentIssues,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all issues with full filters for Admin
// @route   GET /api/admin/issues
// @access  Private (Admin)
export const getAllIssuesAdmin = async (req, res, next) => {
  try {
    const { status, category, priority, search, sort = '-createdAt', page = 1, limit = 50 } = req.query;

    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { issueId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageSize = parseInt(limit, 10);
    const currentPage = parseInt(page, 10);
    const skip = (currentPage - 1) * pageSize;

    const total = await Issue.countDocuments(query);
    const issues = await Issue.find(query)
      .populate('user', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      total,
      count: issues.length,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
      issues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change issue status & add admin remark
// @route   PUT /api/admin/issues/:id/status
// @access  Private (Admin)
export const updateIssueStatus = async (req, res, next) => {
  try {
    const { status, adminRemark } = req.body;

    const validStatuses = ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found.',
      });
    }

    // Update status and remark
    issue.status = status;
    if (adminRemark !== undefined) {
      issue.adminRemark = adminRemark.trim();
    }

    // Add entry to status history
    issue.statusHistory.push({
      status,
      remark: adminRemark ? adminRemark.trim() : `Status changed to ${status} by Municipal Admin`,
      changedAt: new Date(),
      changedBy: `${req.user.name} (Admin)`,
    });

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id).populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      message: `Issue status updated to '${status}' successfully.`,
      issue: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inappropriate report (Admin moderation)
// @route   DELETE /api/admin/issues/:id
// @access  Private (Admin)
export const deleteIssueAdmin = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found.',
      });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Issue '${issue.issueId}' deleted by administrator.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered citizens with issue statistics
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const citizens = await User.find({ role: 'citizen' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Enhance with submitted issues count
    const usersWithStats = await Promise.all(
      citizens.map(async (citizen) => {
        const totalReports = await Issue.countDocuments({ user: citizen._id });
        const resolvedReports = await Issue.countDocuments({ user: citizen._id, status: 'Resolved' });
        const pendingReports = await Issue.countDocuments({
          user: citizen._id,
          status: { $in: ['Submitted', 'Under Review', 'In Progress'] },
        });

        return {
          _id: citizen._id,
          name: citizen.name,
          email: citizen.email,
          phone: citizen.phone,
          role: citizen.role,
          createdAt: citizen.createdAt,
          stats: {
            totalReports,
            resolvedReports,
            pendingReports,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin profile info (name, email)
// @route   PUT /api/admin/profile
// @access  Private (Admin)
export const updateAdminProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both full name and email address.',
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    // Check if email already taken by another user
    const existing = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.user._id },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already in use by another account.',
      });
    }

    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.',
      });
    }

    admin.name = name.trim();
    admin.email = email.toLowerCase().trim();
    if (phone !== undefined) {
      admin.phone = phone.trim();
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Administrator profile updated successfully.',
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin password
// @route   PUT /api/admin/password
// @access  Private (Admin)
export const updateAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password, new password, and confirmation.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
      });
    }

    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return res.status(400).json({
        success: false,
        message:
          'Password must contain an uppercase letter, lowercase letter, number, and special character.',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation do not match.',
      });
    }

    const admin = await User.findById(req.user._id).select('+password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.',
      });
    }

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password entered is incorrect.',
      });
    }

    // Set new password (the User pre-save hook will automatically hash it using bcryptjs)
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Administrator security password updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

