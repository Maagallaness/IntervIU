const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Interview = require('../models/Interview');

// Middleware to protect routes
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new Error();
    }
    
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Create a new interview request (recruiter only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const interview = new Interview({
      ...req.body,
      recruiter: req.user._id
    });
    
    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all interviews (filtered by role)
router.get('/', auth, async (req, res) => {
  try {
    let interviews;
    
    // Filter interviews based on user role
    if (req.user.role === 'admin') {
      // Admins can see all interviews
      interviews = await Interview.find().populate('recruiter').populate('interviewer');
    } else if (req.user.role === 'recruiter') {
      // Recruiters can see their own interviews
      interviews = await Interview.find({ recruiter: req.user._id }).populate('interviewer');
    } else if (req.user.role === 'interviewer') {
      // Interviewers can see interviews assigned to them
      interviews = await Interview.find({ interviewer: req.user._id }).populate('recruiter');
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific interview by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('recruiter')
      .populate('interviewer');
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Check if user has permission to view this interview
    if (
      req.user.role !== 'admin' && 
      interview.recruiter._id.toString() !== req.user._id.toString() && 
      (interview.interviewer && interview.interviewer._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an interview
router.patch('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Check permissions based on role
    if (req.user.role === 'admin') {
      // Admin can update any interview
    } else if (req.user.role === 'recruiter' && interview.recruiter.toString() === req.user._id.toString()) {
      // Recruiter can update their own interviews
    } else if (req.user.role === 'interviewer' && interview.interviewer && interview.interviewer.toString() === req.user._id.toString()) {
      // Interviewer can update interviews assigned to them
      // But limit what they can update
      const allowedUpdates = ['status', 'feedback', 'rating'];
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));
      
      if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates for interviewer role' });
      }
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update the interview
    Object.keys(req.body).forEach(update => {
      interview[update] = req.body[update];
    });
    
    await interview.save();
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an interview (admin and recruiter only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Only admin or the recruiter who created the interview can delete it
    if (
      req.user.role !== 'admin' && 
      (req.user.role !== 'recruiter' || interview.recruiter.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await interview.remove();
    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;