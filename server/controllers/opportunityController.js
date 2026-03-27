const Opportunity = require('../models/Opportunity');

// @desc    Get all opportunities
// @route   GET /api/opportunities
// @access  Public
const getOpportunities = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) query.type = type;

    const opportunities = await Opportunity.find(query)
      .populate('postedBy', 'name profile.profilePic')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: opportunities.length,
      opportunities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an opportunity
// @route   POST /api/opportunities
// @access  Private (Student/Admin)
const createOpportunity = async (req, res) => {
  try {
    const { title, description, type, location, deadline, requirements, link } = req.body;
    
    const opportunity = await Opportunity.create({
      title,
      description,
      type,
      location,
      deadline,
      requirements,
      link,
      postedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      opportunity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply for an opportunity
// @route   POST /api/opportunities/:id/apply
// @access  Private
const applyToOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

    // Check if already applied
    const alreadyApplied = opportunity.applicants.some(
      app => app.user.toString() === req.user.id
    );

    if (alreadyApplied) return res.status(400).json({ message: 'Already applied' });

    opportunity.applicants.push({ user: req.user.id });
    await opportunity.save();

    res.json({ success: true, message: 'Application submitted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOpportunities, createOpportunity, applyToOpportunity };
