import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import Project from '../models/Project.js'

const router = Router()

// GET /api/projects - Get all projects for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ updatedAt: -1 })
    res.json({ projects })
  } catch (err) {
    console.error('Get projects error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/projects/:id - Get a single project
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id })
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.json({ project })
  } catch (err) {
    console.error('Get project error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/projects - Create a new project
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })
    
    const project = await Project.create({ 
      name, 
      owner: req.user.id,
      content: {
        elements: [],
        styles: {}
      }
    })
    
    res.status(201).json({ project })
  } catch (err) {
    console.error('Create project error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/projects/:id - Update a project
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { name, content } = req.body
    const updateFields = {}
    
    if (name) updateFields.name = name
    if (content) updateFields.content = content
    
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $set: updateFields },
      { new: true, runValidators: true }
    )
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    
    res.json({ project })
  } catch (err) {
    console.error('Update project error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user.id 
    })
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    
    res.json({ message: 'Project deleted successfully' })
  } catch (err) {
    console.error('Delete project error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
