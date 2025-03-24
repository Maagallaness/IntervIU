const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');

const prisma = new PrismaClient().$extends(withAccelerate());

// Middleware to protect routes
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
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
    if (req.user.role !== 'RECRUITER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const interview = await prisma.interview.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        candidateName: req.body.candidateName,
        candidateEmail: req.body.candidateEmail,
        candidateResume: req.body.candidateResume,
        skills: req.body.skills || [],
        status: 'PENDING',
        scheduledDate: req.body.scheduledDate,
        duration: req.body.duration || 60,
        recruiter: {
          connect: { id: req.user.id }
        }
      }
    });
    
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
    if (req.user.role === 'ADMIN') {
      // Admins can see all interviews
      interviews = await prisma.interview.findMany({
        include: {
          recruiter: true,
          interviewer: true
        }
      });
    } else if (req.user.role === 'RECRUITER') {
      // Recruiters can see their own interviews
      interviews = await prisma.interview.findMany({
        where: { recruiterId: req.user.id },
        include: { interviewer: true }
      });
    } else if (req.user.role === 'INTERVIEWER') {
      // Interviewers can see interviews assigned to them
      interviews = await prisma.interview.findMany({
        where: { interviewerId: req.user.id },
        include: { recruiter: true }
      });
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
    const interview = await prisma.interview.findUnique({
      where: { id: req.params.id },
      include: {
        recruiter: true,
        interviewer: true,
        feedback: true
      }
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Check if user has permission to view this interview
    if (
      req.user.role !== 'ADMIN' && 
      interview.recruiterId !== req.user.id && 
      (interview.interviewerId && interview.interviewerId !== req.user.id)
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
    const interview = await prisma.interview.findUnique({
      where: { id: req.params.id }
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Check permissions based on role
    if (req.user.role === 'ADMIN') {
      // Admin can update any interview
    } else if (req.user.role === 'RECRUITER' && interview.recruiterId === req.user.id) {
      // Recruiter can update their own interviews
    } else if (req.user.role === 'INTERVIEWER' && interview.interviewerId === req.user.id) {
      // Interviewer can update interviews assigned to them
      // But limit what they can update
      const allowedUpdates = ['status', 'feedback'];
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));
      
      if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates for interviewer role' });
      }
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update the interview
    const updatedInterview = await prisma.interview.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        recruiter: true,
        interviewer: true,
        feedback: true
      }
    });
    
    res.json(updatedInterview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an interview (admin and recruiter only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const interview = await prisma.interview.findUnique({
      where: { id: req.params.id }
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Only admin or the recruiter who created the interview can delete it
    if (
      req.user.role !== 'ADMIN' && 
      (req.user.role !== 'RECRUITER' || interview.recruiterId !== req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete associated feedback if exists
    if (interview.feedback) {
      await prisma.feedback.delete({
        where: { interviewId: interview.id }
      });
    }
    
    // Delete the interview
    await prisma.interview.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;