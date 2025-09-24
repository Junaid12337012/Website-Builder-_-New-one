import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import Project from '../models/Project.js'

const router = Router()

// POST /api/projects  { name }
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })
    const project = await Project.create({ name, owner: req.user.id })
    res.status(201).json({ project })
  } catch (err) {
    console.error('Create project error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
