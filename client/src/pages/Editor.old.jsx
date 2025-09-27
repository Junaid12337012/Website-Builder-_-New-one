import { useEffect, useState, useRef, useCallback, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiSave, FiEye, FiCode, FiSmartphone, FiTablet, FiMonitor, 
  FiX, FiRotateCw, FiRotateCcw, FiHelpCircle, FiCopy, 
  FiTrash2, FiPlus, FiMinus, FiLayers, FiGrid, FiBox, 
  FiType, FiImage, FiLayout, FiSliders, FiChevronDown, 
  FiColumns, FiList, FiNavigation, FiLink, FiVideo,
  FiMenu, FiMaximize2, FiMinimize2, FiSettings,
  FiAlignLeft, FiAlignCenter, FiAlignRight, FiBold, 
  FiItalic, FiUnderline, FiLink2, FiUnlink, FiList as FiListIcon
} from 'react-icons/fi';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Resizable } from 're-resizable';
import { ChromePicker } from 'react-color';
import { v4 as uuidv4 } from 'uuid';
import api from '../lib/api';
import { getToken } from '../lib/auth';

// Available components organized by category
const COMPONENTS = [
  {
    category: 'Layout',
    items: [
      { id: 'section', name: 'Section', icon: <FiLayout />, defaultWidth: '100%' },
      { id: 'container', name: 'Container', icon: <FiBox />, defaultWidth: '1200px' },
      { id: 'columns', name: 'Columns', icon: <FiColumns />, defaultColumns: 2 },
      { id: 'spacer', name: 'Spacer', icon: <FiMinus />, height: '40px' },
      { id: 'divider', name: 'Divider', icon: <FiMinus />, type: 'solid' },
    ]
  },
  {
    category: 'Basic',
    items: [
      { id: 'heading', name: 'Heading', icon: <FiType />, level: 1, text: 'Heading', align: 'left' },
      { id: 'paragraph', name: 'Paragraph', icon: <FiAlignLeft />, text: 'Start typing your paragraph here...', align: 'left' },
      { id: 'button', name: 'Button', icon: <FiLink2 />, text: 'Click Me', url: '#', variant: 'primary' },
      { id: 'image', name: 'Image', icon: <FiImage />, url: 'https://via.placeholder.com/400x200', alt: 'Image' },
      { id: 'list', name: 'List', icon: <FiList />, items: ['First item', 'Second item', 'Third item'], ordered: false },
    ]
  },
  {
    category: 'Navigation',
    items: [
      { id: 'navbar', name: 'Navbar', icon: <FiNavigation />, logo: '', links: ['Home', 'About', 'Contact'] },
      { id: 'menu', name: 'Menu', icon: <FiMenu />, items: ['Menu Item 1', 'Menu Item 2'] },
    ]
  },
  {
    category: 'Media',
    items: [
      { id: 'image-gallery', name: 'Image Gallery', icon: <FiImage />, images: [] },
      { id: 'video', name: 'Video', icon: <FiVideo />, url: '', autoplay: false, controls: true },
    ]
  }
];

// Default content for each component type
const DEFAULT_CONTENT = {
  header: { text: 'New Header', level: 1, align: 'left' },
  paragraph: { text: 'Start typing your paragraph here...', align: 'left' },
  button: { text: 'Click Me', url: '#', variant: 'primary' },
  image: { url: 'https://via.placeholder.com/400x200', alt: 'Image' },
  divider: { type: 'solid', color: '#e5e7eb' },
  spacer: { height: '40px' },
}

// Component for rendering component items in the palette
const ComponentItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type: 'component', id: item.id, name: item.name, ...item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag}
      className={`component-item ${isDragging ? 'dragging' : ''}`}
      draggable
    >
      <span className="component-icon">{item.icon}</span>
      <span className="component-name">{item.name}</span>
    </div>
  );
};

// Component for the component library panel
const ComponentPalette = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComponents = COMPONENTS.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }));

  return (
    <div className="component-palette">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="category-tabs">
        {filteredComponents.map((category, index) => (
          <button
            key={category.category}
            className={`tab ${activeCategory === index ? 'active' : ''}`}
            onClick={() => setActiveCategory(index)}
          >
            {category.category}
          </button>
        ))}
      </div>
      <div className="components-grid">
        {filteredComponents[activeCategory]?.items.map((item) => (
          <ComponentItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

// Component for the main editing area
const EditorCanvas = ({ elements, onDrop, onUpdateElement, onDeleteElement, selectedElement, setSelectedElement, viewMode }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const dropResult = {
        ...item,
        id: `${item.id}-${Date.now()}`,
        position: { x: offset?.x || 0, y: offset?.y || 0 },
        style: {}
      };
      onDrop(dropResult);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleElementClick = (e, element) => {
    e.stopPropagation();
    setSelectedElement(element);
  };

  const renderElement = (element) => {
    const commonProps = {
      key: element.id,
      className: `element ${element.id === selectedElement?.id ? 'selected' : ''}`,
      onClick: (e) => handleElementClick(e, element),
      style: element.style || {}
    };

    switch (element.id.split('-')[0]) {
      case 'heading':
        return (
          <h1 {...commonProps} style={{ ...element.style, textAlign: element.align }}>
            {element.text || 'Heading'}
          </h1>
        );
      case 'paragraph':
        return (
          <p {...commonProps} style={{ ...element.style, textAlign: element.align }}>
            {element.text || 'Paragraph'}
          </p>
        );
      case 'button':
        return (
          <button 
            {...commonProps} 
            className={`btn btn-${element.variant || 'primary'}`}
            onClick={() => window.open(element.url, '_blank')}
          >
            {element.text || 'Button'}
          </button>
        );
      case 'image':
        return (
          <div {...commonProps} className="image-container">
            <img 
              src={element.url} 
              alt={element.alt} 
              style={{ maxWidth: '100%', height: 'auto' }} 
            />
          </div>
        );
      case 'section':
        return (
          <section {...commonProps} className="section">
            {elements
              .filter(el => el.parentId === element.id)
              .map(renderElement)}
          </section>
        );
      default:
        return <div {...commonProps}>Unknown Element</div>;
    }
  };

  return (
    <div 
      ref={drop}
      className={`editor-canvas ${isOver ? 'drag-over' : ''} ${viewMode}`}
    >
      {elements.length === 0 ? (
        <div className="empty-state">
          <p>Drag components here to start building</p>
        </div>
      ) : (
        elements
          .filter(el => !el.parentId)
          .map(renderElement)
      )}
    </div>
  );
};
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const dropResult = {
        ...item,
        id: `${item.id}-${Date.now()}`,
        position: { x: offset?.x || 0, y: offset?.y || 0 },
        style: {}
      };
      onDrop(dropResult);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleElementClick = (e, element) => {
    e.stopPropagation();
    setSelectedElement(element);
  };

  const renderElement = (element) => {
    const commonProps = {
      key: element.id,
      className: `element ${element.id === selectedElement?.id ? 'selected' : ''}`,
      onClick: (e) => handleElementClick(e, element),
      style: element.style || {}
    };

    switch (element.id.split('-')[0]) {
      case 'heading':
        return (
          <h1 {...commonProps} style={{ ...element.style, textAlign: element.align }}>
            {element.text || 'Heading'}
          </h1>
        );
      case 'paragraph':
        return (
          <p {...commonProps} style={{ ...element.style, textAlign: element.align }}>
            {element.text || 'Paragraph'}
          </p>
        );
      case 'button':
        return (
          <button 
            {...commonProps} 
            className={`btn btn-${element.variant || 'primary'}`}
            onClick={() => window.open(element.url, '_blank')}
          >
            {element.text || 'Button'}
          </button>
        );
      case 'image':
        return (
          <div {...commonProps} className="image-container">
            <img 
              src={element.url} 
              alt={element.alt} 
              style={{ maxWidth: '100%', height: 'auto' }} 
            />
          </div>
        );
      case 'section':
        return (
          <section {...commonProps} className="section">
            {elements
              .filter(el => el.parentId === element.id)
              .map(renderElement)}
          </section>
        );
      default:
        return <div {...commonProps}>Unknown Element</div>;
    }
  };

  return (
    <div 
      ref={drop}
      className={`editor-canvas ${isOver ? 'drag-over' : ''} ${viewMode}`}
    >
      {elements.length === 0 ? (
        <div className="empty-state">
          <p>Drag components here to start building</p>
        </div>
      ) : (
        elements
          .filter(el => !el.parentId)
          .map(renderElement)
      )}
    </div>
  );
};
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
const PropertiesPanel = ({ element, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState('design');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorType, setColorType] = useState('background');

  if (!element) {
    return (
      <div className="properties-panel empty">
        <div className="empty-state">
          <FiBox size={24} />
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleStyleChange = (property, value) => {
    onUpdate({
      ...element,
      style: {
        ...(element.style || {}),
        [property]: value
      }
    });
  };

  const handleTextChange = (property, value) => {
    onUpdate({
      ...element,
      [property]: value
    });
  };

  const renderStyleControls = () => {
    const commonStyles = [
      { label: 'Background', type: 'color', property: 'backgroundColor' },
      { label: 'Width', type: 'text', property: 'width' },
      { label: 'Height', type: 'text', property: 'height' },
      { label: 'Margin', type: 'text', property: 'margin' },
      { label: 'Padding', type: 'text', property: 'padding' },
      { label: 'Border', type: 'text', property: 'border' },
      { label: 'Border Radius', type: 'text', property: 'borderRadius' },
    ];

    const textStyles = [
      { label: 'Font Size', type: 'text', property: 'fontSize' },
      { label: 'Font Weight', type: 'select', options: ['normal', 'bold', 'lighter', 'bolder', '100', '200', '300', '400', '500', '600', '700', '800', '900'], property: 'fontWeight' },
      { label: 'Text Align', type: 'buttons', options: [
        { value: 'left', icon: <FiAlignLeft /> },
        { value: 'center', icon: <FiAlignCenter /> },
        { value: 'right', icon: <FiAlignRight /> },
        { value: 'justify', icon: <FiAlignLeft /> },
      ], property: 'textAlign' },
      { label: 'Text Color', type: 'color', property: 'color' },
      { label: 'Line Height', type: 'text', property: 'lineHeight' },
      { label: 'Letter Spacing', type: 'text', property: 'letterSpacing' },
    ];

    return (
      <div className="style-controls">
        <h4>Layout</h4>
        {commonStyles.map(style => (
          <div key={style.property} className="control-group">
            <label>{style.label}</label>
            <input
              type={style.type}
              value={element.style?.[style.property] || ''}
              onChange={(e) => handleStyleChange(style.property, e.target.value)}
            />
          </div>
        ))}
        
        <h4>Typography</h4>
        {textStyles.map(style => {
          if (style.type === 'buttons') {
            return (
              <div key={style.property} className="control-group">
                <label>{style.label}</label>
                <div className="button-group">
                  {style.options.map(option => (
                    <button
                      key={option.value}
                      className={element.style?.[style.property] === option.value ? 'active' : ''}
                      onClick={() => handleStyleChange(style.property, option.value)}
                      title={option.value}
                    >
                      {option.icon}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <div key={style.property} className="control-group">
              <label>{style.label}</label>
              <input
                type={style.type}
                value={element.style?.[style.property] || ''}
                onChange={(e) => handleStyleChange(style.property, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderContentControls = () => {
    switch(element.id.split('-')[0]) {
      case 'heading':
      case 'paragraph':
        return (
          <div className="content-controls">
            <div className="control-group">
              <label>Text</label>
              <textarea
                value={element.text || ''}
                onChange={(e) => handleTextChange('text', e.target.value)}
                rows={4}
              />
            </div>
            {element.id.startsWith('heading') && (
              <div className="control-group">
                <label>Level</label>
                <select
                  value={element.level || 1}
                  onChange={(e) => handleTextChange('level', parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map(level => (
                    <option key={level} value={level}>H{level}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );
      case 'button':
        return (
          <div className="content-controls">
            <div className="control-group">
              <label>Button Text</label>
              <input
                type="text"
                value={element.text || ''}
                onChange={(e) => handleTextChange('text', e.target.value)}
              />
            </div>
            <div className="control-group">
              <label>Link URL</label>
              <input
                type="text"
                value={element.url || ''}
                onChange={(e) => handleTextChange('url', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="control-group">
              <label>Variant</label>
              <select
                value={element.variant || 'primary'}
                onChange={(e) => handleTextChange('variant', e.target.value)}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="text">Text</option>
              </select>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="content-controls">
            <div className="control-group">
              <label>Image URL</label>
              <input
                type="text"
                value={element.url || ''}
                onChange={(e) => handleTextChange('url', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="control-group">
              <label>Alt Text</label>
              <input
                type="text"
                value={element.alt || ''}
                onChange={(e) => handleTextChange('alt', e.target.value)}
                placeholder="Description of the image"
              />
            </div>
          </div>
        );
      default:
        return <div className="no-content">No content options available for this element.</div>;
    }
  };

  return (
    <div className="properties-panel">
      <div className="panel-header">
        <h3>{element.name || 'Element'}</h3>
        <button className="delete-btn" onClick={() => onDelete(element.id)}>
          <FiTrash2 />
        </button>
      </div>
      
      <div className="panel-tabs">
        <button 
          className={activeTab === 'content' ? 'active' : ''}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button 
          className={activeTab === 'design' ? 'active' : ''}
          onClick={() => setActiveTab('design')}
        >
          Design
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          <FiSettings />
        </button>
      </div>
      
      <div className="panel-content">
        {activeTab === 'content' ? renderContentControls() : null}
        {activeTab === 'design' ? renderStyleControls() : null}
        {activeTab === 'settings' ? (
          <div className="settings-tab">
            <div className="control-group">
              <label>Element ID</label>
              <input type="text" value={element.id} readOnly />
            </div>
            <div className="control-group">
              <label>Custom Class</label>
              <input 
                type="text" 
                value={element.className || ''}
                onChange={(e) => handleTextChange('className', e.target.value)}
                placeholder="custom-class"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
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
