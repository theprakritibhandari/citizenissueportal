import Issue from '../models/Issue.js';

// @desc    Create new issue report
// @route   POST /api/issues
// @access  Private (Citizen)
export const createIssue = async (req, res, next) => {
  try {
    const { title, category, description, location, priority } = req.body;

    if (!title || !category || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (title, category, description, location).',
      });
    }

    let imageUrl = '';
    if (req.file) {
      // Multer file upload
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const issue = await Issue.create({
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      image: imageUrl,
      priority: priority || 'Medium',
      user: req.user._id,
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          remark: 'Issue report submitted by citizen',
          changedAt: new Date(),
          changedBy: req.user.name || 'Citizen',
        },
      ],
    });

    const populatedIssue = await Issue.findById(issue._id).populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Issue report submitted successfully! Tracking ID: ' + issue.issueId,
      issue: populatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all public / recent issues
// @route   GET /api/issues
// @access  Public
export const getAllIssues = async (req, res, next) => {
  try {
    const { category, status, search, limit = 20, page = 1 } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { issueId: { $regex: search, $options: 'i' } },
      ];
    }

    const pageSize = parseInt(limit, 10);
    const currentPage = parseInt(page, 10);
    const skip = (currentPage - 1) * pageSize;

    const total = await Issue.countDocuments(query);
    const issues = await Issue.find(query)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: issues.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
      issues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's submitted issues
// @route   GET /api/issues/my
// @access  Private
export const getMyIssues = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { issueId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const issues = await Issue.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single issue details
// @route   GET /api/issues/:id
// @access  Public (or Private)
export const getIssueById = async (req, res, next) => {
  try {
    let issue;

    // Check if queried by MongoDB _id or custom issueId (e.g. ISS-2026-1234)
    if (req.params.id.startsWith('ISS-')) {
      issue = await Issue.findOne({ issueId: req.params.id }).populate('user', 'name email phone');
    } else {
      issue = await Issue.findById(req.params.id).populate('user', 'name email phone');
    }

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found with ID ' + req.params.id,
      });
    }

    res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own issue (Citizen can only edit if status is Submitted)
// @route   PUT /api/issues/:id
// @access  Private (Citizen)
export const updateIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found.',
      });
    }

    // Verify ownership
    if (issue.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this issue report.',
      });
    }

    // Check if still editable
    if (issue.status !== 'Submitted' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: `This issue cannot be edited because it is already '${issue.status}'. Citizens can only modify reports while status is 'Submitted'.`,
      });
    }

    const { title, category, description, location, priority } = req.body;

    if (title) issue.title = title.trim();
    if (category) issue.category = category;
    if (description) issue.description = description.trim();
    if (location) issue.location = location.trim();
    if (priority) issue.priority = priority;

    if (req.file) {
      issue.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      issue.image = req.body.image;
    }

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Issue report updated successfully.',
      issue: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own issue (Citizen can only delete if status is Submitted)
// @route   DELETE /api/issues/:id
// @access  Private (Citizen)
export const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found.',
      });
    }

    // Verify ownership
    if (issue.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this issue report.',
      });
    }

    // Check if still deletable by citizen
    if (issue.status !== 'Submitted' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: `You cannot delete this report because municipal action has already started (Status: ${issue.status}).`,
      });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Issue report deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
