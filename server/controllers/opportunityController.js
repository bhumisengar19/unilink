const Opportunity = require('../models/Opportunity');

// @desc    Get all opportunities
// @route   GET /api/opportunities
// @access  Private
const getOpportunities = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) {
      query.type = type;
    }
    const opportunities = await Opportunity.find(query).populate('postedBy', 'name profile.profilePic').sort({ createdAt: -1 });
    res.json({ success: true, opportunities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an opportunity
// @route   POST /api/opportunities
// @access  Private
const createOpportunity = async (req, res) => {
  try {
    const { title, type, company, description, deadline, link, tags } = req.body;

    const op = await Opportunity.create({
      title,
      type,
      company,
      description,
      deadline,
      link,
      tags: tags || [],
      postedBy: req.user.id,
    });

    res.status(201).json({ success: true, opportunity: op });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getOpportunities, createOpportunity };
