import { useEffect, useState, useRef, useCallback, useReducer } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FiSave, 
  FiEye, 
  FiCode, 
  FiSmartphone, 
  FiTablet, 
  FiMonitor, 
  FiX, 
  FiRotateCw, 
  FiRotateCcw,
  FiHelpCircle,
  FiCopy,
  FiTrash2,
  FiPlus,
  FiMinus
} from 'react-icons/fi'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { LoadingSpinner, SkeletonLoader } from '../components/LoadingSpinner';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { HTML5Backend } from 'react-dnd-html5-backend'
import api from '../lib/api'
import { getToken } from '../lib/auth'

// Available components that can be added to the page
const COMPONENTS = [
  { id: 'header', name: 'Header', icon: 'H' },
  { id: 'paragraph', name: 'Paragraph', icon: 'P' },
  { id: 'button', name: 'Button', icon: 'B' },
  { id: 'image', name: 'Image', icon: 'I' },
  { id: 'divider', name: 'Divider', icon: '—' },
  { id: 'spacer', name: 'Spacer', icon: '⤮' },
]

// Default content for each component type
const DEFAULT_CONTENT = {
  header: { text: 'New Header', level: 1, align: 'left' },
  paragraph: { text: 'Start typing your paragraph here...', align: 'left' },
  button: { text: 'Click Me', url: '#', variant: 'primary' },
  image: { url: 'https://via.placeholder.com/400x200', alt: 'Image' },
  divider: { type: 'solid', color: '#e5e7eb' },
  spacer: { height: '40px' },
}

// Component for the sidebar where users can drag components from
const ComponentPalette = () => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type: 'component' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div className="w-16 bg-gray-800 text-white p-2 flex flex-col items-center space-y-4">
      {COMPONENTS.map((comp) => (
        <div
          key={comp.id}
          ref={drag}
          className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded cursor-move hover:bg-gray-600"
          data-component={comp.id}
        >
          <span className="text-lg font-bold">{comp.icon}</span>
          <div className="absolute text-xs mt-12 bg-black bg-opacity-75 p-1 rounded opacity-0 group-hover:opacity-100">
            {comp.name}
          </div>
        </div>
      ))}
    </div>
  )
}

// Component for the main editing area
const EditorCanvas = ({ elements, onDrop, onUpdateElement, onDeleteElement, selectedElement, setSelectedElement }) => {
  const [, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => {
      const componentType = monitor.getItem().componentType
      onDrop(componentType)
    },
  }))

  return (
    <div ref={drop} className="flex-1 bg-gray-100 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-lg">
        {elements.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400">
            Drag components here to get started
          </div>
        ) : (
          elements.map((element, index) => (
            <div
              key={element.id}
              className={`relative p-4 border-b ${selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'}`}
              onClick={() => setSelectedElement(element)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteElement(element.id)
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
              >
                <FiX />
              </button>
              {renderElement(element, onUpdateElement)}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Component for the properties panel
const PropertiesPanel = ({ element, onUpdate }) => {
  if (!element) {
    return (
      <div className="w-64 bg-white border-l p-4 flex items-center justify-center text-gray-500">
        Select an element to edit its properties
      </div>
    )
  }

  const updateProperty = (property, value) => {
    onUpdate({
      ...element,
      [property]: value,
    })
  }

  return (
    <div className="w-64 bg-white border-l p-4 overflow-y-auto">
      <h3 className="font-medium mb-4">
        {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Properties
      </h3>
      
      {element.type === 'header' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input
              type="text"
              value={element.text || ''}
              onChange={(e) => updateProperty('text', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={element.level}
              onChange={(e) => updateProperty('level', parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <option key={level} value={level}>
                  H{level}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
            <select
              value={element.align}
              onChange={(e) => updateProperty('align', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      )}

      {element.type === 'paragraph' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <textarea
              value={element.text}
              onChange={(e) => updateProperty('text', e.target.value)}
              rows={4}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
            <select
              value={element.align}
              onChange={(e) => updateProperty('align', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
        </div>
      )}

      {element.type === 'button' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={element.text}
              onChange={(e) => updateProperty('text', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="text"
              value={element.url}
              onChange={(e) => updateProperty('url', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
            <select
              value={element.variant}
              onChange={(e) => updateProperty('variant', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>
          </div>
        </div>
      )}

      {element.type === 'image' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={element.url}
              onChange={(e) => updateProperty('url', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
            <input
              type="text"
              value={element.alt}
              onChange={(e) => updateProperty('alt', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Description of the image"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
            <select
              value={element.align || 'left'}
              onChange={(e) => updateProperty('align', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      )}

      {element.type === 'divider' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={element.type || 'solid'}
              onChange={(e) => updateProperty('type', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="color"
              value={element.color || '#e5e7eb'}
              onChange={(e) => updateProperty('color', e.target.value)}
              className="w-full h-10 p-1 border rounded"
            />
          </div>
        </div>
      )}

      {element.type === 'spacer' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
          <input
            type="number"
            min="10"
            max="500"
            value={parseInt(element.height || '40')}
            onChange={(e) => updateProperty('height', `${e.target.value}px`)}
            className="w-full p-2 border rounded"
          />
        </div>
      )}
    </div>
  )
}

// Helper function to render elements in the canvas
const renderElement = (element, onUpdate) => {
  const updateProperty = (property, value) => {
    onUpdate({
      ...element,
      [property]: value,
    })
  }

  switch (element.type) {
    case 'header':
      const HeaderTag = `h${element.level || 1}`
      return (
        <HeaderTag 
          className={`text-${element.align || 'left'}`}
          style={{ textAlign: element.align || 'left' }}
        >
          {element.text || 'New Header'}
        </HeaderTag>
      )
    
    case 'paragraph':
      return (
        <p 
          className={`text-${element.align || 'left'}`}
          style={{ textAlign: element.align || 'left' }}
        >
          {element.text || 'Start typing your paragraph here...'}
        </p>
      )
    
    case 'button':
      const buttonClasses = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
        outline: 'bg-transparent hover:bg-gray-100 text-blue-600 border border-blue-600',
        ghost: 'bg-transparent hover:bg-gray-100 text-blue-600',
      }
      
      return (
        <div className={`text-${element.align || 'left'}`} style={{ textAlign: element.align || 'left' }}>
          <a
            href={element.url || '#'}
            className={`inline-block px-4 py-2 rounded ${buttonClasses[element.variant || 'primary']}`}
          >
            {element.text || 'Button'}
          </a>
        </div>
      )
    
    case 'image':
      return (
        <div className={`text-${element.align || 'left'}`} style={{ textAlign: element.align || 'left' }}>
          <img 
            src={element.url || 'https://via.placeholder.com/400x200'} 
            alt={element.alt || 'Image'}
            className="max-w-full h-auto"
          />
        </div>
      )
    
    case 'divider':
      const dividerStyle = {
        border: 'none',
        borderTop: `1px ${element.type || 'solid'} ${element.color || '#e5e7eb'}`,
        margin: '1rem 0',
      }
      return <hr style={dividerStyle} />
    
    case 'spacer':
      return <div style={{ height: element.height || '40px' }} />
    
    default:
      return null
  }
}

// Main Editor component
export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [elements, setElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('desktop') // 'desktop', 'tablet', 'mobile'
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const saveTimeout = useRef(null)

  // Load project data
  useEffect(() => {
    if (!getToken()) {
      navigate('/login')
      return
    }

    const fetchProject = async () => {
      try {
        setLoading(true)
        const { data } = await api.get(`/projects/${id}`)
        setProject(data.project)
        setElements(data.project.content?.elements || [])
      } catch (err) {
        setError('Failed to load project')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()

    // Warn user if they try to leave with unsaved changes
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [id, navigate, isDirty])

  // Handle dropping a component onto the canvas
  const handleDrop = (componentType) => {
    const newElement = {
      id: `el-${Date.now()}`,
      type: componentType,
      ...DEFAULT_CONTENT[componentType],
    }
    
    setElements([...elements, newElement])
    setSelectedElement(newElement)
    setIsDirty(true)
    autoSave()
  }

  // Handle updating an element
  const handleUpdateElement = (updatedElement) => {
    setElements(elements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    ))
    setSelectedElement(updatedElement)
    setIsDirty(true)
    autoSave()
  }

  // Handle deleting an element
  const handleDeleteElement = (elementId) => {
    setElements(elements.filter(el => el.id !== elementId))
    if (selectedElement?.id === elementId) {
      setSelectedElement(null)
    }
    setIsDirty(true)
    autoSave()
  }

  // Auto-save changes after a delay
  const autoSave = useCallback(() => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current)
    }
    
    saveTimeout.current = setTimeout(async () => {
      try {
        setIsSaving(true)
        await api.put(`/projects/${id}`, {
          content: { elements }
        })
        setIsDirty(false)
      } catch (err) {
        console.error('Failed to save changes', err)
      } finally {
        setIsSaving(false)
      }
    }, 1000) // 1 second debounce
  }, [elements, id])

  // Manual save
  const handleSave = async () => {
    try {
      setIsSaving(true)
      await api.put(`/projects/${id}`, {
        content: { elements }
      })
      setIsDirty(false)
    } catch (err) {
      console.error('Failed to save changes', err)
    } finally {
      setIsSaving(false)
    }
  }

  // Preview the website
  const handlePreview = () => {
    // In a real app, this would open a preview in a new tab
    alert('Preview functionality will be implemented here')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-medium">Error loading project</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Top toolbar */}
        <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
              title="Back to Dashboard"
            >
              ←
            </button>
            <h1 className="text-lg font-medium">{project?.name || 'Untitled Project'}</h1>
            {isDirty && (
              <span className="text-xs text-gray-500 ml-2">
                {isSaving ? 'Saving...' : 'Unsaved changes'}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1 rounded ${viewMode === 'mobile' ? 'bg-white shadow' : 'text-gray-500'}`}
                title="Mobile View"
              >
                <FiSmartphone className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-1 rounded ${viewMode === 'tablet' ? 'bg-white shadow' : 'text-gray-500'}`}
                title="Tablet View"
              >
                <FiTablet className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-1 rounded ${viewMode === 'desktop' ? 'bg-white shadow' : 'text-gray-500'}`}
                title="Desktop View"
              >
                <FiMonitor className="h-5 w-5" />
              </button>
            </div>
            
            <button
              onClick={handlePreview}
              className="flex items-center px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiEye className="mr-2 h-4 w-4" />
              Preview
            </button>
            
            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar - Component palette */}
          <ComponentPalette />
          
          {/* Main editor area */}
          <div className="flex-1 flex overflow-hidden">
            <div 
              className={`flex-1 overflow-auto ${viewMode === 'mobile' ? 'max-w-md mx-auto' : ''} ${
                viewMode === 'tablet' ? 'max-w-2xl mx-auto' : ''
              }`}
            >
              <EditorCanvas
                elements={elements}
                onDrop={handleDrop}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
              />
            </div>
            
            {/* Right sidebar - Properties panel */}
            <PropertiesPanel 
              element={selectedElement} 
              onUpdate={handleUpdateElement} 
            />
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
