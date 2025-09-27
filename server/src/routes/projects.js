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

// Sample templates data (in a real app, this would be in a separate service/database)
const TEMPLATES = [
  // Business Templates
  {
    id: 'corporate',
    name: 'Corporate Pro',
    category: 'business',
    thumbnail: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Professional corporate website with modern design',
    content: {
      elements: [
        // Hero section with CTA
        // Services grid
        // About section
        // Team showcase
        // Testimonials
        // Contact form
      ],
      styles: {
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '0.5rem',
        containerWidth: '1280px'
      }
    }
  },
  {
    id: 'agency',
    name: 'Creative Agency',
    category: 'business',
    thumbnail: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Modern agency template with portfolio showcase',
    content: {
      elements: [
        // Fullscreen hero with video
        // Services with icons
        // Portfolio grid with filters
        // Client logos
        // Team section
        // Contact form
      ],
      styles: {
        primaryColor: '#7c3aed',
        secondaryColor: '#5b21b6',
        fontFamily: 'Poppins, sans-serif',
        borderRadius: '0.75rem',
        containerWidth: '1400px'
      }
    }
  },
  
  // Portfolio Templates
  {
    id: 'minimal-portfolio',
    name: 'Minimal Portfolio',
    category: 'portfolio',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Clean and minimal portfolio template',
    content: {
      elements: [
        // Minimal hero with name/title
        // About section
        // Project showcase (masonry grid)
        // Skills/proficiency
        // Contact section
      ],
      styles: {
        primaryColor: '#000000',
        secondaryColor: '#333333',
        fontFamily: 'Helvetica, Arial, sans-serif',
        borderRadius: '0.25rem',
        containerWidth: '1200px'
      }
    }
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    category: 'portfolio',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Bold and creative portfolio with animations',
    content: {
      elements: [
        // Animated hero section
        // Featured projects
        // About with skills
        // Testimonials
        // Contact form
      ],
      styles: {
        primaryColor: '#3b82f6',
        secondaryColor: '#1d4ed8',
        fontFamily: 'Montserrat, sans-serif',
        borderRadius: '1rem',
        containerWidth: '1400px'
      }
    }
  },
  
  // E-commerce Templates
  {
    id: 'fashion-store',
    name: 'Fashion Store',
    category: 'ecommerce',
    thumbnail: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Elegant fashion e-commerce template',
    content: {
      elements: [
        // Hero slider
        // Featured categories
        // New arrivals
        // Bestsellers
        // Newsletter signup
        // Footer with links
      ],
      styles: {
        primaryColor: '#ec4899',
        secondaryColor: '#db2777',
        fontFamily: 'Playfair Display, serif',
        borderRadius: '0.5rem',
        containerWidth: '1440px'
      }
    }
  },
  
  // Blog Templates
  {
    id: 'modern-blog',
    name: 'Modern Blog',
    category: 'blog',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Clean and modern blog template',
    content: {
      elements: [
        // Featured post
        // Category filters
        // Blog grid
        // Sidebar with about, categories, tags
        // Newsletter signup
      ],
      styles: {
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        fontFamily: 'Lora, serif',
        borderRadius: '0.5rem',
        containerWidth: '1140px'
      }
    }
  },
  
  // Landing Page Templates
  {
    id: 'saas-landing',
    name: 'SaaS Landing',
    category: 'landing',
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'High-converting SaaS landing page',
    content: {
      elements: [
        // Hero with signup form
        // Features grid
        // How it works
        // Testimonials
        // Pricing tables
        // FAQ
        // CTA section
      ],
      styles: {
        primaryColor: '#6366f1',
        secondaryColor: '#4f46e5',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '0.75rem',
        containerWidth: '1280px'
      }
    }
  },
  
  // Blank Template (always keep at the end)
  {
    id: 'blank',
    name: 'Blank Canvas',
    category: 'general',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Start from scratch with a blank canvas',
    content: {
      elements: [],
      styles: {
        primaryColor: '#3b82f6',
        secondaryColor: '#1d4ed8',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '0.5rem',
        containerWidth: '1280px'
      }
    }
  }
]

// GET /api/projects/templates - Get available templates
router.get('/templates', requireAuth, (req, res) => {
  try {
    res.json({ templates: TEMPLATES })
  } catch (err) {
    console.error('Get templates error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/projects - Create a new project
router.post('/', requireAuth, async (req, res) => {
  try {
    console.log('Received project creation request:', { 
      body: req.body,
      user: req.user.id 
    });

    const { name, description, templateId } = req.body;
    
    // Validate input
    if (!name || typeof name !== 'string' || !name.trim()) {
      console.log('Validation failed: Invalid project name');
      return res.status(400).json({ 
        success: false,
        message: 'Project name is required and must be a non-empty string' 
      });
    }

    // Sanitize and validate template ID
    const sanitizedTemplateId = (templateId && typeof templateId === 'string') 
      ? templateId.trim() 
      : 'blank';

    // Find the selected template
    const selectedTemplate = TEMPLATES.find(t => t.id === sanitizedTemplateId) || 
                           TEMPLATES.find(t => t.id === 'blank');

    if (!selectedTemplate) {
      console.error('Template not found:', sanitizedTemplateId);
      return res.status(400).json({
        success: false,
        message: 'Invalid template selected'
      });
    }

    // Prepare project data
    const projectData = { 
      name: name.trim(),
      description: (description && typeof description === 'string') 
        ? description.trim() 
        : selectedTemplate.description,
      owner: req.user.id,
      template: {
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        category: selectedTemplate.category || 'general'
      },
      thumbnail: selectedTemplate.thumbnail || '',
      content: selectedTemplate.content || { elements: [], styles: {} },
      settings: {
        seo: {
          title: name.trim(),
          description: (description && typeof description === 'string')
            ? description.trim()
            : `${name.trim()} - Created with Website Builder`,
          keywords: []
        }
      },
      status: 'draft'
    };

    console.log('Creating project with data:', projectData);
    
    const project = await Project.create(projectData);
    
    console.log('Project created successfully:', project.id);
    
    res.status(201).json({ 
      success: true,
      project: project.toObject()
    });
    
  } catch (err) {
    console.error('Create project error:', {
      error: err,
      message: err.message,
      stack: err.stack
    });
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A project with this name already exists. Please choose a different name.'
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to create project. Please try again later.'
    });
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
