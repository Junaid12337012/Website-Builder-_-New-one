import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useDrop, useDrag, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Resizable } from 're-resizable';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import {
  FiSave, FiShare2, FiCode, FiSmartphone, FiTablet, FiMonitor, FiUser, FiMoon, FiSun,
  FiSearch, FiLayers, FiGrid, FiFileText, FiImage, FiType, FiSquare, FiBox, FiChevronDown,
  FiChevronLeft, FiChevronRight, FiPlus, FiTrash2, FiCopy, FiArrowLeft, FiArrowRight, FiZoomIn, FiZoomOut, FiPlay, FiMousePointer
} from 'react-icons/fi';

/* ============================================================================
   WebsiteEditor (single-file)
   Paste into client/src/pages/Editor.jsx and route to /editor/:id (already in your app)
============================================================================ */

const DEVICE_PRESETS = {
  Desktop: 1200,
  Tablet: 834,
  Mobile: 390,
};

const ELEMENT_CATEGORIES = [
  { name: 'Layout', items: [ { type: 'div', name: 'Div Block', icon: <FiSquare /> } ] },
  { name: 'Typography', items: [ { type: 'text', name: 'Text', icon: <FiType /> } ] },
  { name: 'Media', items: [ { type: 'image', name: 'Image', icon: <FiImage /> } ] },
  { name: 'Forms', items: [ { type: 'div', name: 'Form (stub)', icon: <FiFileText /> } ] },
  { name: 'Buttons', items: [ { type: 'button', name: 'Button', icon: <FiSquare /> } ] },
  { name: 'Navigation', items: [ { type: 'div', name: 'Navbar (stub)', icon: <FiLayers /> } ] },
  { name: 'Advanced', items: [ { type: 'div', name: 'Custom Block', icon: <FiBox /> } ] },
];

const COMPONENTS = [
  {
    type: 'hero',
    name: 'Hero',
    icon: <FiGrid />,
    structure: [
      { type: 'div', style: { padding: '40px', background: '#F8FAFC', borderRadius: '16px' } },
      { type: 'text', content: 'Build Beautiful Websites', style: { fontSize: '28px', fontWeight: 700, marginBottom: '8px' } },
      { type: 'text', content: 'A modern, simplified editor inspired by Webflow.', style: { color: '#64748B', marginBottom: '16px' } },
      { type: 'button', content: 'Get Started', style: { background: '#2563EB', color: '#fff', padding: '10px 16px', borderRadius: '10px', display: 'inline-block' } },
    ],
  },
  {
    type: 'features',
    name: 'Features',
    icon: <FiGrid />,
    structure: [
      { type: 'div', style: { padding: '32px', borderRadius: '16px', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' } },
      { type: 'text', content: 'Features', style: { fontSize: '22px', fontWeight: 700, marginBottom: '16px' } },
      { type: 'text', content: 'Clean UI, DnD, Resizing, and more.', style: { color: '#64748B' } },
    ],
  },
  {
    type: 'footer',
    name: 'Footer',
    icon: <FiGrid />,
    structure: [
      { type: 'div', style: { padding: '24px', background: '#0F172A', borderRadius: '14px', color: '#fff' } },
      { type: 'text', content: '© 2025 WebBuilder. All rights reserved.', style: { color: '#CBD5E1', fontSize: '14px' } },
    ],
  },
  {
    type: 'navbar',
    name: 'Navbar',
    icon: <FiLayers />,
    structure: [
      { type: 'div', style: { padding: '16px 24px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' } },
      { type: 'text', content: 'Brand', style: { fontWeight: 700, display: 'inline-block', marginRight: '16px' } },
      { type: 'button', content: 'Get Started', style: { background: '#2563EB', color: '#fff', padding: '8px 14px', borderRadius: '10px', display: 'inline-block' } },
    ],
  },
  {
    type: 'pricing',
    name: 'Pricing',
    icon: <FiGrid />,
    structure: [
      { type: 'div', style: { padding: '40px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' } },
      { type: 'text', content: 'Simple Pricing', style: { fontSize: '22px', fontWeight: 700, marginBottom: '8px' } },
      { type: 'text', content: '$19/mo • Cancel anytime', style: { color: '#64748B', marginBottom: '16px' } },
      { type: 'button', content: 'Choose Plan', style: { background: '#111827', color: '#fff', padding: '10px 16px', borderRadius: '10px', display: 'inline-block' } },
    ],
  },
  {
    type: 'testimonials',
    name: 'Testimonials',
    icon: <FiGrid />,
    structure: [
      { type: 'div', style: { padding: '32px', background: '#F8FAFC', borderRadius: '16px' } },
      { type: 'text', content: 'What our users say', style: { fontSize: '22px', fontWeight: 700, marginBottom: '8px' } },
      { type: 'text', content: '“This builder is a joy to use.”', style: { color: '#64748B' } },
    ],
  },
  {
    type: 'cta',
    name: 'CTA',
    icon: <FiGrid />,
    structure: [
      { type: 'div', style: { padding: '36px', background: 'linear-gradient(135deg, #6366F1, #22D3EE)', borderRadius: '16px', color: '#fff' } },
      { type: 'text', content: 'Ready to build?', style: { fontSize: '24px', fontWeight: 700, marginBottom: '8px' } },
      { type: 'button', content: 'Start Now', style: { background: '#111827', color: '#fff', padding: '10px 16px', borderRadius: '10px', display: 'inline-block' } },
    ],
  },
];

const PAGES = [
  { id: 'home', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'contact', name: 'Contact' },
];

/* ============================================================================
   TopBar
============================================================================ */
function TopBar({ projectName, breadcrumb, onToggleLeft, onToggleRight, onSave, onPreview, onGenerate, device, setDevice, dark, setDark }) {
  const [openProfile, setOpenProfile] = useState(false);
  const [openDevice, setOpenDevice] = useState(false);
  const [openMode, setOpenMode] = useState(false);
  const modeRef = useRef(null);
  const deviceRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      const t = e.target;
      if (openMode && modeRef.current && !modeRef.current.contains(t)) setOpenMode(false);
      if (openDevice && deviceRef.current && !deviceRef.current.contains(t)) setOpenDevice(false);
      if (openProfile && profileRef.current && !profileRef.current.contains(t)) setOpenProfile(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') { setOpenMode(false); setOpenDevice(false); setOpenProfile(false); } };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [openMode, openDevice, openProfile]);

  return (
    <div className={`h-12 ${dark ? 'bg-[#0f1115]/95 border-gray-800 text-gray-200' : 'bg-white/90 border-gray-200 text-gray-800'} backdrop-blur border-b flex items-center px-3 relative z-40`}>
      {/* Left cluster: brand + Design dropdown + compact icons */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center text-[10px] font-bold">WB</div>
        <div className="relative" ref={modeRef}>
          <button onClick={()=>setOpenMode(v=>!v)} className={`px-2 h-7 rounded-md border text-xs flex items-center gap-1 ${dark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}>
            Design <FiChevronDown className="opacity-70" />
          </button>
          <AnimatePresence>
            {openMode && (
              <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} className={`absolute mt-1 w-32 rounded-md border z-50 ${dark ? 'bg-[#0f1115] border-gray-800' : 'bg-white border-gray-200'}`}>
                <button className={`w-full text-left px-3 py-1.5 text-xs ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`} onClick={()=>setOpenMode(false)}>Design</button>
                <button className={`w-full text-left px-3 py-1.5 text-xs ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`} onClick={()=>{setOpenMode(false); onGenerate?.();}}>Code</button>
                <button className={`w-full text-left px-3 py-1.5 text-xs ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`} onClick={()=>{ setOpenMode(false); onToggleLeft?.(); }}>Library</button>
                <button className={`w-full text-left px-3 py-1.5 text-xs ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`} onClick={()=>{ setOpenMode(false); /* open Navigator overlay */ const evt = new CustomEvent('editor.openNavigator'); window.dispatchEvent(evt); }}>Navigator</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className={`mx-1 w-px h-5 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />
        <button title="Library" onClick={onToggleLeft} className={`w-8 h-8 rounded-md grid place-items-center ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
          <FiGrid />
        </button>
        <button title="Preview" onClick={onPreview} className={`w-8 h-8 rounded-md grid place-items-center ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
          <FiPlay />
        </button>
      </div>

      {/* Center: breadcrumbs + device dropdown */}
      <div className="flex-1 flex items-center justify-center">
        <div className="hidden md:flex items-center gap-3">
          <nav className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{breadcrumb?.join(' / ') || 'Home / Page'}</nav>
          <div className={`w-px h-5 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />
          <div className="relative" ref={deviceRef}>
            <button onClick={()=>setOpenDevice(v=>!v)} className={`px-2 h-7 rounded-md border text-xs flex items-center gap-1 ${dark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}>
              {device}
              {device==='Desktop' && <FiMonitor />}
              {device==='Tablet' && <FiTablet />}
              {device==='Mobile' && <FiSmartphone />}
              <FiChevronDown className="opacity-70" />
            </button>
            <AnimatePresence>
              {openDevice && (
                <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} className={`absolute mt-1 right-0 w-32 rounded-md border z-50 ${dark ? 'bg-[#0f1115] border-gray-800' : 'bg-white border-gray-200'}`}>
                  {Object.keys(DEVICE_PRESETS).map((d)=> (
                    <button key={d} className={`w-full text-left px-3 py-1.5 text-xs ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`} onClick={()=>{ setDevice(d); setOpenDevice(false); }}>
                      {d}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right: status + Share + Publish + theme/profile */}
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 mr-1">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="All changes saved" />
        </div>
        <button onClick={()=>toast.info('Share link copied (stub)')} className={`px-3 h-7 text-xs rounded-md border flex items-center gap-1 ${dark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}>
          <FiShare2 /> Share
        </button>
        <button onClick={() => toast.success('Published (stub)')} className="px-3 h-7 text-xs rounded-md bg-indigo-600 text-white shadow hover:bg-indigo-500">Publish</button>
        <button onClick={()=>setDark(!dark)} className={`ml-1 w-8 h-8 rounded-md grid place-items-center ${dark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`} title="Toggle theme">
          {dark ? <FiSun /> : <FiMoon />}
        </button>
        <div className="relative" ref={profileRef}>
          <button onClick={()=>setOpenProfile(v=>!v)} className={`w-8 h-8 rounded-full flex items-center justify-center ${dark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-100'}`}>
            <FiUser />
          </button>
          <AnimatePresence>
            {openProfile && (
              <motion.div initial={{opacity:0, y:-4}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-4}} className={`absolute right-0 mt-2 w-40 rounded-lg border shadow z-50 ${dark ? 'bg-[#0f1115] border-gray-800 text-gray-200' : 'bg-white border-gray-200 text-gray-800'}`}>
                <button className={`w-full text-left px-3 py-2 text-sm ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>Settings</button>
                <button className={`w-full text-left px-3 py-2 text-sm ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>Logout</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   Navigator Panel (Layers) with Drag & Drop Reorder
============================================================================ */
function NavigatorPanel({ elements, selectedId, onSelect, onReorder, onDelete, dark }) {
  const Row = ({ id, index, label }) => {
    const ref = useRef(null);
    const [, drag] = useDrag(() => ({ type: 'layer', item: { index } }), [index]);
    const [, drop] = useDrop(
      () => ({
        accept: 'layer',
        hover: (item) => {
          if (!ref.current) return;
          const from = item.index;
          const to = index;
          if (from === to) return;
          onReorder(from, to);
          item.index = to;
        },
      }),
      [index]
    );
    drag(drop(ref));
    return (
      <div
        ref={ref}
        className={`flex items-center gap-2 px-2 py-1 rounded-lg border ${selectedId===id ? 'border-blue-500' : (dark ? 'border-gray-800' : 'border-gray-200')} ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
      >
        <span className="cursor-grab select-none text-gray-400">⋮⋮</span>
        <button className={`flex-1 text-left truncate ${selectedId===id ? 'text-blue-400' : ''}`} onClick={()=>onSelect(id)}>
          {label}
        </button>
        <button className={`px-2 py-0.5 text-xs rounded border ${dark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`} onClick={()=>onDelete(id)}><FiTrash2 /></button>
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className={`px-4 py-3 border-b ${dark ? 'border-gray-800 bg-[#0f1115]' : 'border-gray-200 bg-white'} text-sm font-medium`}>Navigator</div>
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {elements.map((el, idx) => (
          <Row key={el.id} id={el.id} index={idx} label={`${el.type}${el.content ? ' — ' + String(el.content).slice(0,20) : ''}`} />
        ))}
        {elements.length===0 && (
          <div className={`${dark ? 'text-gray-500' : 'text-gray-500'} text-xs px-2`}>No elements yet</div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   LeftSidebar with Tabs
============================================================================ */
function LeftSidebar({ activeTab, setActiveTab, onSelectPage, search, setSearch, dark }) {
  return (
    <div className="h-full w-[300px]">
      <div className={`px-4 py-3 border-b ${dark ? 'border-gray-800 bg-[#0f1115] text-gray-200' : 'border-gray-200 bg-white'} rounded-r-2xl shadow-sm`}>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2">
            <FiSearch className={`${dark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input className={`w-full outline-none text-sm ${dark ? 'bg-[#0b0d11] text-gray-200 placeholder:text-gray-500' : 'bg-white'}`} placeholder="Search components" value={search} onChange={(e)=>setSearch(e.target.value)} />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          {['Elements', 'Components', 'Pages'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`py-1.5 rounded-lg border transition ${activeTab === t ? (dark ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-blue-500 text-blue-600 bg-blue-50') : (dark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50')}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className={`p-3 ${dark ? 'bg-[#0f1115] text-gray-200' : ''}`}>
        {activeTab === 'Elements' && (
          <div className="space-y-4">
            {ELEMENT_CATEGORIES.map((cat) => {
              const items = cat.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
              if(items.length===0) return null;
              return (
                <div key={cat.name}>
                  <div className={`text-xs font-semibold mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{cat.name}</div>
                  <div className="grid grid-cols-1 gap-2">
                    {items.map((comp) => (
                      <DraggableLibraryItem key={comp.name} comp={comp} dark={dark} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'Components' && (
          <div className="grid grid-cols-1 gap-2">
            {COMPONENTS.map((c) => (
              <DraggableLibraryItem key={c.type} comp={{ type: c.type, name: c.name, icon: c.icon, structure: c.structure }} />
            ))}
          </div>
        )}

        {activeTab === 'Pages' && (
          <div className="space-y-2">
            {PAGES.map((p) => (
              <button
                key={p.id}
                className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
                onClick={() => onSelectPage(p.id)}
              >
                <span className="text-gray-800">{p.name}</span>
                <FiChevronRight className="text-gray-400" />
              </button>
            ))}
            <button onClick={()=>alert('Add page (stub)')} className="w-full flex items-center gap-2 text-blue-600 text-sm hover:underline">
              <FiPlus /> New page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DraggableLibraryItem({ comp, dark }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { componentType: comp.type, structure: comp.structure },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 rounded-xl flex items-center gap-3 cursor-move shadow-sm border ${dark ? 'bg-[#0b0d11] border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
      style={{ opacity: isDragging ? 0.6 : 1 }}
    >
      <span className={`${dark ? 'text-gray-300' : 'text-gray-700'}`}>{comp.icon}</span>
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{comp.name}</span>
        <span className={`text-[11px] ${dark ? 'text-gray-500' : 'text-gray-500'}`}>Drag to canvas</span>
      </div>
    </div>
  );
}

/* ============================================================================
   Canvas
============================================================================ */
function Canvas({
  elements,
  setElements,
  selectedId,
  setSelectedId,
  device,
  zoom,
  setZoom,
  onDropNewElement,
  dark,
  showGrid,
  showRulers,
  overflowMode,
  onCanvasClick,
  gridSize,
  snapSize,
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;
      onDropNewElement(item);
      return { dropEffect: 'copy' };
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  }));

  const [editingId, setEditingId] = useState(null);
  const [guideX, setGuideX] = useState(null);
  const [guideY, setGuideY] = useState(null);
  const focusRef = useRef(null);

  const handleUpdateElement = (id, updates) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  };

  const renderElement = (el) => {
    const isSelected = selectedId === el.id;
    const style = normalizeStyle(el.style);
    const x = Number(style.x || 0);
    const y = Number(style.y || 0);

    const content = (
      <>
        {el.type === 'text' && (
          <div
            contentEditable={editingId === el.id}
            suppressContentEditableWarning
            onDoubleClick={() => setEditingId(el.id)}
            onBlur={(e) => {
              setEditingId(null);
              handleUpdateElement(el.id, { content: e.currentTarget.textContent });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
            }}
            style={{ padding: '8px', outline: editingId === el.id ? '1px dashed #60a5fa' : 'none', cursor: editingId === el.id ? 'text' : 'inherit' }}
          >
            {el.content || 'Text'}
          </div>
        )}
        {el.type === 'image' && (
          <img
            src={el.src || 'https://via.placeholder.com/800x400?text=Image'}
            alt="img"
            className="max-w-full h-auto"
          />
        )}
        {el.type === 'button' && (
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
            onClick={(e) => e.preventDefault()}
            onDoubleClick={(e) => {
              e.preventDefault();
              setEditingId(el.id);
            }}
            onBlur={(e) => {
              if (editingId === el.id) {
                setEditingId(null);
                handleUpdateElement(el.id, { content: e.currentTarget.textContent });
              }
            }}
            contentEditable={editingId === el.id}
            suppressContentEditableWarning
            style={{ outline: editingId === el.id ? '1px dashed #60a5fa' : 'none', cursor: editingId === el.id ? 'text' : 'pointer' }}
          >
            {el.content || 'Button'}
          </button>
        )}
        {el.type === 'div' && <div style={{ minHeight: 24 }} />}
      </>
    );

    return (
      <Resizable
        key={el.id}
        defaultSize={{
          width: style.width || '100%',
          height: style.height || 'auto',
        }}
        enable={{
          top: false,
          right: true,
          bottom: true,
          left: false,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
        onResizeStop={(e, dir, ref) => {
          handleUpdateElement(el.id, {
            style: { ...(el.style || {}), width: ref.style.width, height: ref.style.height },
          });
        }}
        className={`bg-white ${isSelected ? 'ring-2 ring-blue-500' : 'ring-0'} rounded-xl shadow-sm`}
        style={{ margin: '8px auto' }}
      >
        <motion.div
          className={`relative transition hover:ring-1 hover:ring-blue-300 rounded-xl cursor-move`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(el.id);
            focusRef.current?.focus();
          }}
          drag
          dragMomentum={false}
          dragElastic={0.06}
          animate={{ x, y }}
          transition={{ type: 'spring', stiffness: 700, damping: 44 }}
          onDrag={(e, info) => {
            // Simple snap guides based on other elements' x/y positions
            const others = elements.filter(o => o.id !== el.id);
            let gx = null, gy = null;
            for (const o of others) {
              const os = normalizeStyle(o.style || {});
              if (Math.abs((x + info.offset.x) - Number(os.x || 0)) <= 6) gx = Number(os.x || 0);
              if (Math.abs((y + info.offset.y) - Number(os.y || 0)) <= 6) gy = Number(os.y || 0);
            }
            setGuideX(gx);
            setGuideY(gy);
          }}
          onDragEnd={(e, info) => {
            const s = Math.max(1, Number(snapSize) || 1);
            const nx = Math.round((x + info.offset.x) / s) * s;
            const ny = Math.round((y + info.offset.y) / s) * s;
            handleUpdateElement(el.id, { style: { ...(el.style || {}), x: nx, y: ny } });
            setGuideX(null);
            setGuideY(null);
          }}
          style={{ ...style, willChange: 'transform' }}
        >
          {content}
        </motion.div>
      </Resizable>
    );
  };

  return (
    <div className="flex-1 overflow-auto p-8" onClick={() => { setSelectedId(null); onCanvasClick?.(); }}>
      <div className="mx-auto" style={{ width: DEVICE_PRESETS[device] }}>
        <div className={`relative min-h-[700px] rounded-2xl border shadow-xl ${dark ? 'border-gray-800' : 'border-gray-200'}`}
             style={{ background: showGrid ? (dark ? 'linear-gradient(#1c1f26 1px, transparent 1px), linear-gradient(90deg, #1c1f26 1px, transparent 1px)' : 'linear-gradient(#f5f7fb 1px, transparent 1px), linear-gradient(90deg, #f5f7fb 1px, transparent 1px)') : 'none', backgroundSize: `${gridSize}px ${gridSize}px`, backgroundColor: dark ? '#0b0d11' : '#ffffff', overflow: overflowMode?.toLowerCase() || 'auto' }}>
          <div className="absolute -top-6 left-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Body</div>
          {showRulers && (
            <>
              <div className={`absolute top-0 left-0 right-0 h-6 ${dark ? 'bg-[#0f1115] text-gray-500' : 'bg-white text-gray-500'} border-b ${dark ? 'border-gray-800' : 'border-gray-200'}`} style={{ backgroundImage: 'linear-gradient(to right, rgba(100,116,139,0.2) 1px, transparent 1px)', backgroundSize: '40px 100%' }} />
              <div className={`absolute top-0 bottom-0 left-0 w-6 ${dark ? 'bg-[#0f1115] text-gray-500' : 'bg-white text-gray-500'} border-r ${dark ? 'border-gray-800' : 'border-gray-200'}`} style={{ backgroundImage: 'linear-gradient(to bottom, rgba(100,116,139,0.2) 1px, transparent 1px)', backgroundSize: '100% 40px' }} />
            </>
          )}
          <div
            ref={drop}
            className={`origin-top-left transition`}
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          >
            <div className={`p-6 ${isOver ? 'outline outline-2 outline-blue-400 rounded-xl' : ''}`}>
              {elements.length === 0 ? (
                <div className={`h-[500px] flex items-center justify-center ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Drag components from the left and drop here
                </div>
              ) : (
                <div className="max-w-full space-y-2">
                  {elements.map(renderElement)}
                </div>
              )}
            </div>
          </div>
          {/* On-canvas zoom controls */}
          <div className={`absolute bottom-3 right-3 flex items-center gap-2 backdrop-blur rounded-xl border shadow px-2 py-1 ${dark ? 'bg-[#0f1115]/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}>
            <button className={`px-2 py-1 text-sm rounded-lg border ${dark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => setSelectedId(null)}>Deselect</button>
            <button className={`px-2 py-1 text-sm rounded-lg border ${dark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>Top</button>
            <button className={`px-2 py-1 text-sm rounded-lg border ${dark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => setZoom(1)}>100%</button>
            <button className={`px-2 py-1 text-sm rounded-lg border ${dark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => setZoom(Math.min(1, (window.innerHeight-240)/700))}>Fit</button>
          </div>
          {/* Breadcrumbs */}
          <div className={`absolute bottom-3 left-3 px-2 py-1 text-xs rounded-lg border ${dark ? 'bg-[#0f1115]/90 border-gray-800 text-gray-300' : 'bg-white/90 border-gray-200 text-gray-700'}`}>
            Body {selectedId ? `> ${elements.find(e=>e.id===selectedId)?.type}` : ''}
          </div>
          {/* Snap guides */}
          {guideX !== null && (
            <div className="pointer-events-none absolute top-0 bottom-0" style={{ left: `${guideX}px` }}>
              <div className="w-px h-full bg-blue-400/70" />
            </div>
          )}
          {guideY !== null && (
            <div className="pointer-events-none absolute left-0 right-0" style={{ top: `${guideY}px` }}>
              <div className="h-px w-full bg-blue-400/70" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   Right Sidebar - Properties Inspector with Tabs
============================================================================ */
function InspectorTabs({ element, onChange, onDelete, dark }) {
  const [tab, setTab] = useState('Style');

  const Header = () => (
    <div className={`px-3 py-3 ${dark ? 'bg-[#0f1115] border-b border-gray-800' : 'bg-white border-b border-gray-200'}`}>
      <div className="flex items-center gap-2 text-xs">
        <input type="checkbox" className={`${dark ? 'accent-blue-500' : 'accent-blue-600'}`} readOnly checked={!!element} />
        <span className={`${dark ? 'text-gray-300' : 'text-gray-800'} font-medium`}>{element ? `${element.type} Selected` : 'None Selected'}</span>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button onClick={()=>setTab('Style')} className={`text-sm pb-1 ${tab==='Style' ? (dark ? 'text-white border-b-2 border-white' : 'text-gray-900 border-b-2 border-gray-900') : (dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')}`}>Style</button>
          <button onClick={()=>setTab('Settings')} className={`text-sm pb-1 ${tab==='Settings' ? (dark ? 'text-white border-b-2 border-white' : 'text-gray-900 border-b-2 border-gray-900') : (dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')}`}>Settings</button>
          <button onClick={()=>setTab('Interactions')} className={`text-sm pb-1 ${tab==='Interactions' ? (dark ? 'text-white border-b-2 border-white' : 'text-gray-900 border-b-2 border-gray-900') : (dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')}`}>Interactions</button>
        </div>
      </div>
      <div className="mt-3">
        <label className={`text-[11px] uppercase tracking-wide ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Style selector</label>
        <div className="mt-1">
          <select className={`w-full h-8 rounded-md px-2 text-sm ${dark ? 'bg-[#0b0d11] border border-gray-800 text-gray-300' : 'bg-white border border-gray-200 text-gray-800'}`} defaultValue={'None'}>
            <option>None</option>
          </select>
        </div>
      </div>
    </div>
  );

  const EmptyCard = () => (
    <div className={`m-4 p-6 rounded-lg border ${dark ? 'bg-[#111318] border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'} text-center`}>
      <div className={`mx-auto w-10 h-10 rounded-md grid place-items-center mb-2 ${dark ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'} border ${dark ? 'border-gray-800' : 'border-gray-200'}`}>
        <FiMousePointer />
      </div>
      <div className={`text-sm font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>Make a selection</div>
      <div className={`text-xs mt-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Select an element on the canvas to activate this panel</div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full ${dark ? 'text-gray-200' : ''}`}>
      <Header />

      <div className={`overflow-auto flex-1 ${dark ? 'bg-[#0b0d11]' : 'bg-white'}`}>
        {!element ? (
          <EmptyCard />
        ) : (
          <div className="p-4 space-y-4">
            {tab === 'Style' && (
              <>
                <StylePanel element={element} onChange={onChange} />
                <LayoutPanel element={element} onChange={onChange} />
              </>
            )}
            {tab === 'Settings' && (
              <>
                <DataPanel element={element} onChange={onChange} />
                <AdvancedPanel element={element} onChange={onChange} />
              </>
            )}
            {tab === 'Interactions' && (
              <div className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-600'}`}>Interactions are coming soon.</div>
            )}
          </div>
        )}
      </div>

      {element && (
        <div className={`p-3 border-t ${dark ? 'border-gray-800 bg-[#0f1115]' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between">
            <button
              onClick={onDelete}
              className="text-sm px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-500 flex items-center gap-2"
            >
              <FiTrash2 /> Delete
            </button>
            <button
              onClick={() => navigator?.clipboard?.writeText(JSON.stringify(element, null, 2))}
              className={`text-sm px-3 py-1.5 rounded-lg border ${dark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} flex items-center gap-2`}
            >
              <FiCopy /> Copy JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StylePanel({ element, onChange }) {
  const update = (patch) => onChange({ ...element, style: { ...(element.style || {}), ...patch } });
  const updateRoot = (patch) => onChange({ ...element, ...patch });

  return (
    <div className="space-y-4 text-sm">
      {element.type === 'text' && (
        <div className="space-y-2">
          <label className="text-xs text-gray-600">Text</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-2 py-1"
            value={element.content || ''}
            onChange={(e) => updateRoot({ content: e.target.value })}
            placeholder="Text content"
          />
        </div>
      )}

      <FieldGroup label="Typography">
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="Font size" value={parseInt(element.style?.fontSize || 16)} onChange={(v) => update({ fontSize: `${v}px` })} />
          <NumberInput label="Line height" value={parseInt(element.style?.lineHeight || 24)} onChange={(v) => update({ lineHeight: `${v}px` })} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ColorInput label="Color" value={element.style?.color || '#0f172a'} onChange={(v) => update({ color: v })} />
          <SelectInput label="Weight" value={element.style?.fontWeight || 400} onChange={(v) => update({ fontWeight: Number(v) })} options={[300, 400, 500, 600, 700]} />
        </div>
      </FieldGroup>

      <FieldGroup label="Spacing (Padding)">
        <div className="grid grid-cols-4 gap-2">
          {['pt', 'pr', 'pb', 'pl'].map((k) => (
            <NumberInput
              key={k}
              label={k.toUpperCase()}
              value={parseInt((element.style || {})[k] || 0)}
              onChange={(v) => update({ [k]: `${v}px` })}
            />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="Background / Border">
        <div className="grid grid-cols-2 gap-2">
          <ColorInput label="Background" value={element.style?.background || '#ffffff'} onChange={(v) => update({ background: v })} />
          <ColorInput label="Border color" value={element.style?.borderColor || '#e5e7eb'} onChange={(v) => update({ borderColor: v, borderStyle: 'solid', borderWidth: element.style?.borderWidth || '1px' })} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="Border width" value={parseInt(element.style?.borderWidth || 1)} onChange={(v) => update({ borderWidth: `${v}px`, borderStyle: 'solid' })} />
          <NumberInput label="Radius" value={parseInt(element.style?.borderRadius || 12)} onChange={(v) => update({ borderRadius: `${v}px` })} />
        </div>
        <div>
          <label className="text-xs text-gray-600">Shadow (preset)</label>
          <select
            className="w-full border border-gray-200 rounded-lg px-2 py-1"
            value={element.style?.boxShadow || 'sm'}
            onChange={(e) => update({ boxShadow: e.target.value === 'none' ? 'none' : '0 1px 2px rgba(0,0,0,0.05)' })}
          >
            <option value="none">None</option>
            <option value="sm">Soft</option>
          </select>
        </div>
      </FieldGroup>

      <FieldGroup label="Size">
        <div className="grid grid-cols-2 gap-2">
          <TextInput label="Width" value={element.style?.width || '100%'} onChange={(v) => update({ width: v })} />
          <TextInput label="Height" value={element.style?.height || 'auto'} onChange={(v) => update({ height: v })} />
        </div>
      </FieldGroup>
    </div>
  );
}

function LayoutPanel({ element, onChange }) {
  const update = (patch) => onChange({ ...element, style: { ...(element.style || {}), ...patch } });

  return (
    <div className="space-y-4 text-sm">
      <FieldGroup label="Display">
        <div className="grid grid-cols-3 gap-2">
          {['block', 'flex', 'grid'].map((d) => (
            <button
              key={d}
              onClick={() => update({ display: d })}
              className={`text-xs px-2 py-1 rounded-lg border ${element.style?.display === d ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="Flex / Grid">
        <div className="grid grid-cols-2 gap-2">
          <SelectInput label="Justify" value={element.style?.justifyContent || 'flex-start'} onChange={(v) => update({ justifyContent: v })} options={['flex-start', 'center', 'space-between', 'space-around', 'flex-end']} />
          <SelectInput label="Align" value={element.style?.alignItems || 'stretch'} onChange={(v) => update({ alignItems: v })} options={['stretch', 'flex-start', 'center', 'flex-end']} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="Gap" value={parseInt(element.style?.gap || 0)} onChange={(v) => update({ gap: `${v}px` })} />
          <NumberInput label="Cols (grid)" value={parseInt(element.style?.gridTemplateColumns?.split(' ').length || 1)} onChange={(v) => update({ display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, v)}, minmax(0, 1fr))` })} />
        </div>
      </FieldGroup>

      <FieldGroup label="Position">
        <div className="grid grid-cols-2 gap-2">
          <SelectInput label="Position" value={element.style?.position || 'relative'} onChange={(v) => update({ position: v })} options={['relative', 'absolute', 'fixed', 'sticky']} />
          <NumberInput label="Z-Index" value={parseInt(element.style?.zIndex || 1)} onChange={(v) => update({ zIndex: v })} />
        </div>
      </FieldGroup>
    </div>
  );
}

function DataPanel({ element, onChange }) {
  const updateRoot = (patch) => onChange({ ...element, ...patch });

  return (
    <div className="space-y-4 text-sm">
      <FieldGroup label="Element">
        <div className="grid grid-cols-2 gap-2">
          <TextInput label="ID" value={element.id} onChange={() => {}} disabled />
          <TextInput label="Type" value={element.type} onChange={() => {}} disabled />
        </div>
      </FieldGroup>

      {element.type === 'image' && (
        <FieldGroup label="Image Source">
          <TextInput label="src" value={element.src || ''} onChange={(v) => updateRoot({ src: v })} placeholder="https://..." />
          <TextInput label="alt" value={element.alt || ''} onChange={(v) => updateRoot({ alt: v })} placeholder="description" />
        </FieldGroup>
      )}

      {element.type === 'button' && (
        <FieldGroup label="Link">
          <TextInput label="URL" value={element.href || ''} onChange={(v) => updateRoot({ href: v })} placeholder="https://..." />
        </FieldGroup>
      )}
    </div>
  );
}

function AdvancedPanel({ element, onChange }) {
  const updateRoot = (patch) => onChange({ ...element, ...patch });
  return (
    <div className="space-y-4 text-sm">
      <FieldGroup label="Custom Attributes">
        <TextInput label="data-id" value={element['data-id'] || ''} onChange={(v)=>updateRoot({ ['data-id']: v })} />
        <TextInput label="class" value={element.className || ''} onChange={(v)=>updateRoot({ className: v })} />
      </FieldGroup>
      <FieldGroup label="Aria">
        <TextInput label="aria-label" value={element['aria-label'] || ''} onChange={(v)=>updateRoot({ ['aria-label']: v })} />
      </FieldGroup>
    </div>
  );
}

/* ============================================================================
   Bottom Toolbar
============================================================================ */
function BottomToolbar({ zoom, setZoom, device, setDevice, onUndo, onRedo, canUndo, canRedo, dark, showGrid, setShowGrid, showRulers, setShowRulers, overflowMode, setOverflowMode, gridSize, setGridSize, snapSize, setSnapSize }) {
  const [openAdjust, setOpenAdjust] = useState(false);
  const [openGridOpts, setOpenGridOpts] = useState(false);
  const adjustRef = useRef(null);
  const gridRef = useRef(null);
  useEffect(()=>{
    const onDown = (e)=>{ if (openAdjust && adjustRef.current && !adjustRef.current.contains(e.target)) setOpenAdjust(false); };
    document.addEventListener('mousedown', onDown);
    return ()=>document.removeEventListener('mousedown', onDown);
  }, [openAdjust]);
  useEffect(()=>{
    const onDown = (e)=>{ if (openGridOpts && gridRef.current && !gridRef.current.contains(e.target)) setOpenGridOpts(false); };
    document.addEventListener('mousedown', onDown);
    return ()=>document.removeEventListener('mousedown', onDown);
  }, [openGridOpts]);

  const setFit = () => setZoom(Math.min(1, (window.innerHeight - 240) / 700));

  return (
    <div className={`h-10 backdrop-blur border-t flex items-center px-3 ${dark ? 'bg-[#0f1115]/95 border-gray-800 text-gray-300' : 'bg-white/90 border-gray-200'}`}>
      {/* Left: selection trail (static Body for now) */}
      <div className="flex items-center gap-2">
        <div className={`w-4 h-4 rounded-sm ${dark ? 'bg-gray-700' : 'bg-gray-300'}`} />
        <span className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Body</span>
      </div>

      <div className="flex-1" />

      {/* Right: zoom, devices, overflow, toggles */}
      <div className="flex items-center gap-2">
        <div className="relative" ref={adjustRef}>
          <button
            title="Adjust zoom"
            onClick={()=>setOpenAdjust(v=>!v)}
            className={`px-2 h-8 rounded-md text-xs font-medium ${dark ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-gray-50'}`}
          >
            {Math.round(zoom * 100)}%
          </button>
          {openAdjust && (
            <div className={`absolute bottom-10 left-0 z-50 w-28 rounded-md border ${dark ? 'bg-[#0f1115] border-gray-800' : 'bg-white border-gray-200'} shadow`}> 
              {[
                {label: '25%', val: 0.25},
                {label: '50%', val: 0.5},
                {label: '75%', val: 0.75},
                {label: '100%', val: 1},
              ].map(o=> (
                <button key={o.label} className={`w-full text-left px-3 py-1.5 text-xs ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`} onClick={()=>{ setZoom(o.val); setOpenAdjust(false); }}>
                  {o.label}
                </button>
              ))}
              <div className={`${dark ? 'border-gray-800' : 'border-gray-200'} border-t`}/>
              <button className={`w-full text-left px-3 py-1.5 text-xs ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`} onClick={()=>{ setFit(); setOpenAdjust(false); }}>
                Fit
              </button>
            </div>
          )}
        </div>
        <button title="Zoom out" className={`w-8 h-8 rounded-md grid place-items-center ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`} onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.1).toFixed(2)))}>
          <FiZoomOut />
        </button>
        <button title="Zoom in" className={`w-8 h-8 rounded-md grid place-items-center ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`} onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}>
          <FiZoomIn />
        </button>
        <div className={`mx-1 w-px h-5 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />
        {Object.keys(DEVICE_PRESETS).map((d) => (
          <button
            key={d}
            title={d}
            className={`w-8 h-8 rounded-md grid place-items-center ${device === d ? (dark ? 'text-blue-400' : 'text-blue-600') : ''} ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
            onClick={() => setDevice(d)}
          >
            {d === 'Desktop' && <FiMonitor />}
            {d === 'Tablet' && <FiTablet />}
            {d === 'Mobile' && <FiSmartphone />}
          </button>
        ))}
        <div className={`mx-1 w-px h-5 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />
        <select
          title="Overflow"
          className={`h-8 text-xs rounded-md px-2 ${dark ? 'bg-[#0f1115] border border-gray-800 text-gray-300' : 'bg-white border border-gray-200 text-gray-700'}`}
          value={overflowMode || 'Auto'}
          onChange={(e)=>setOverflowMode(e.target.value)}
        >
          <option>Auto</option>
          <option>Hidden</option>
          <option>Scroll</option>
          <option>Visible</option>
        </select>
        <div className={`mx-1 w-px h-5 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />
        <div className="relative" ref={gridRef}>
          <div className="flex items-center">
            <button title="Toggle Grid" className={`w-8 h-8 rounded-md grid place-items-center ${showGrid ? (dark ? 'text-blue-400' : 'text-blue-600') : ''} ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`} onClick={() => setShowGrid(v=>!v)}>
              <FiGrid />
            </button>
            <button title="Grid options" className={`w-6 h-8 rounded-md grid place-items-center text-xs ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`} onClick={()=>setOpenGridOpts(v=>!v)}>
              ▾
            </button>
          </div>
          {openGridOpts && (
            <div className={`absolute bottom-10 right-0 z-50 w-56 rounded-md border ${dark ? 'bg-[#0f1115] border-gray-800 text-gray-200' : 'bg-white border-gray-200 text-gray-800'} shadow`}> 
              <div className="px-3 py-2 flex items-center justify-between text-xs">
                <span>Show grid</span>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={!!showGrid} onChange={(e)=>setShowGrid(e.target.checked)} />
                </label>
              </div>
              <div className={`${dark ? 'border-gray-800' : 'border-gray-200'} border-t`} />
              <div className="px-3 py-2 text-xs flex items-center justify-between gap-2">
                <span>Grid size</span>
                <input type="number" min={4} max={80} step={2} value={parseInt(gridSize||20)} onChange={(e)=>setGridSize(Math.max(4,Math.min(80, parseInt(e.target.value||20))))} className={`w-16 h-7 rounded-md px-2 ${dark ? 'bg-[#0f1115] border border-gray-800 text-gray-300' : 'bg-white border border-gray-200 text-gray-700'}`} />
              </div>
              <div className="px-3 py-2 text-xs flex items-center justify-between gap-2">
                <span>Snap size</span>
                <input type="number" min={1} max={80} step={1} value={parseInt(snapSize||8)} onChange={(e)=>setSnapSize(Math.max(1,Math.min(80, parseInt(e.target.value||8))))} className={`w-16 h-7 rounded-md px-2 ${dark ? 'bg-[#0f1115] border border-gray-800 text-gray-300' : 'bg-white border border-gray-200 text-gray-700'}`} />
              </div>
              <div className={`${dark ? 'border-gray-800' : 'border-gray-200'} border-t`} />
              <div className="px-3 py-2 text-xs flex items-center gap-2">
                <span className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>Presets:</span>
                {[
                  {label:'8', val:8},{label:'10', val:10},{label:'20', val:20},{label:'40', val:40}
                ].map(p=> (
                  <button key={p.label} className={`px-2 h-6 rounded border text-xs ${dark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`} onClick={()=>{ setGridSize(p.val); setSnapSize(Math.max(1, Math.round(p.val/2))); }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button title="Toggle Rulers" className={`w-8 h-8 rounded-md grid place-items-center ${showRulers ? (dark ? 'text-blue-400' : 'text-blue-600') : ''} ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`} onClick={() => setShowRulers(v=>!v)}>
          <FiFileText />
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
   Inputs (small UI atoms)
============================================================================ */
function FieldGroup({ label, children }) {
  return (
    <div className="space-y-2">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="space-y-2 p-3 rounded-xl border border-gray-200 shadow-sm bg-white">
        {children}
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, disabled }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-600">{label}</label>
      <input
        className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm disabled:bg-gray-50 disabled:text-gray-400"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

function NumberInput({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-600">{label}</label>
      <input
        type="number"
        className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm"
        value={isNaN(value) ? 0 : value}
        onChange={(e) => onChange?.(parseInt(e.target.value || 0))}
      />
    </div>
  );
}

function ColorInput({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-600">{label}</label>
      <input
        type="color"
        className="w-full h-8 border border-gray-200 rounded-lg"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-600">{label}</label>
      <select
        className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   Small: LeftRailButton (active indicator + consistent hit-area)
---------------------------------------------------------------------------- */
function LeftRailButton({ title, active, onClick, children, dark }) {
  return (
    <div className="relative">
      {active && (
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded ${dark ? 'bg-blue-500/80' : 'bg-blue-600/80'}`} />
      )}
      <button
        title={title}
        aria-label={title}
        className={`ml-[3px] w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${active ? (dark ? 'text-blue-400' : 'text-blue-600') : ''} ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}

/* ============================================================================
   Utilities
============================================================================ */
function normalizeStyle(style = {}) {
  const {
    pt, pr, pb, pl,
    background, borderColor, borderStyle, borderWidth, borderRadius, boxShadow,
    fontSize, lineHeight, fontWeight, color,
    justifyContent, alignItems, gap, display,
    position, zIndex,
    width, height,
    gridTemplateColumns,
  } = style;

  return {
    width, height, display, position,
    zIndex,
    paddingTop: pt, paddingRight: pr, paddingBottom: pb, paddingLeft: pl,
    background, borderColor, borderStyle, borderWidth, borderRadius, boxShadow,
    fontSize, lineHeight, fontWeight, color,
    justifyContent, alignItems, gap,
    gridTemplateColumns,
  };
}

function buildElementFromLibrary({ componentType, structure }) {
  if (structure && Array.isArray(structure)) {
    // Prebuilt component: flatten structure to multiple elements
    return structure.map((node) => ({
      id: uuidv4(),
      type: node.type,
      content: node.content,
      src: node.src,
      alt: node.alt,
      style: {
        width: '100%',
        borderRadius: node.style?.borderRadius || '12px',
        background: node.style?.background || '#ffffff',
        ...node.style,
      },
    }));
  }

  // Simple single element
  const defaults = {
    div: { style: { background: '#ffffff', borderRadius: '12px', borderColor: '#e5e7eb', borderWidth: '1px', borderStyle: 'solid', pt: '12px', pb: '12px' } },
    text: { content: 'Text', style: { fontSize: '16px', lineHeight: '24px', color: '#0f172a' } },
    image: { src: 'https://via.placeholder.com/800x400?text=Image', style: { borderRadius: '12px' } },
    button: { content: 'Button', style: { background: '#2563EB', color: '#fff', borderRadius: '10px', pt: '10px', pb: '10px', pr: '16px', pl: '16px', display: 'inline-block' } },
  }[componentType] || {};

  return [{
    id: uuidv4(),
    type: componentType,
    content: defaults.content,
    src: defaults.src,
    style: {
      width: '100%',
      ...defaults.style,
    },
  }];
}

/* ============================================================================
   History (Undo/Redo)
============================================================================ */
function useHistory(initial) {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(initial);
  const [future, setFuture] = useState([]);

  const set = (next) => {
    setPast((p) => [...p, present]);
    setPresent(next);
    setFuture([]);
  };

  const undo = () => {
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, p.length - 1));
    setFuture((f) => [present, ...f]);
    setPresent(prev);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, present]);
    setPresent(next);
  };

  return {
    value: present,
    set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}

/* ============================================================================
   Main Editor Component
============================================================================ */
export default function Editor() {
  // Layout state
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [activeLeftTab, setActiveLeftTab] = useState('Elements');
  const [search, setSearch] = useState('');

  // Canvas state
  const [device, setDevice] = useState('Desktop');
  const [zoom, setZoom] = useState(1);
  const [dark, setDark] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [overflowMode, setOverflowMode] = useState('Auto');
  const [isSmall, setIsSmall] = useState(false);
  const leftAsideRef = useRef(null);
  const leftRailRef = useRef(null);
  const [gridSize, setGridSize] = useState(20);
  const [snapSize, setSnapSize] = useState(8);

  // Load persisted UI state on mount
  useEffect(() => {
    try {
      const ls = (k, d) => {
        const v = localStorage.getItem(k);
        if (v === null || v === undefined) return d;
        if (v === 'true' || v === 'false') return v === 'true';
        const num = Number(v);
        if (!Number.isNaN(num) && String(num) === v) return num;
        return v;
      };
      setDark(ls('editor.dark', true));
      setShowLeft(ls('editor.showLeft', true));
      setShowRight(ls('editor.showRight', true));
      setShowNavigator(ls('editor.showNavigator', false));
      setShowGrid(ls('editor.showGrid', true));
      setShowRulers(ls('editor.showRulers', true));
      setActiveLeftTab(ls('editor.activeLeftTab', 'Elements'));
      setGridSize(ls('editor.gridSize', 20));
      setSnapSize(ls('editor.snapSize', 8));
      const dev = ls('editor.device', 'Desktop');
      if (dev === 'Desktop' || dev === 'Tablet' || dev === 'Mobile') setDevice(dev);
      const z = Number(ls('editor.zoom', 1));
      if (!Number.isNaN(z) && z > 0.3 && z <= 2.5) setZoom(z);
    } catch {}
  }, []);

  // Click outside to close left sidebar (Webflow-like)
  useEffect(() => {
    const onDown = (e) => {
      if (!showLeft) return;
      const target = e.target;
      const insideAside = leftAsideRef.current && leftAsideRef.current.contains(target);
      const insideRail = leftRailRef.current && leftRailRef.current.contains(target);
      if (!insideAside && !insideRail) setShowLeft(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [showLeft]);

  // Persist UI state
  useEffect(() => { try { localStorage.setItem('editor.dark', String(dark)); } catch {} }, [dark]);
  useEffect(() => { try { localStorage.setItem('editor.showLeft', String(showLeft)); } catch {} }, [showLeft]);
  useEffect(() => { try { localStorage.setItem('editor.showRight', String(showRight)); } catch {} }, [showRight]);
  useEffect(() => { try { localStorage.setItem('editor.showNavigator', String(showNavigator)); } catch {} }, [showNavigator]);
  useEffect(() => { try { localStorage.setItem('editor.showGrid', String(showGrid)); } catch {} }, [showGrid]);
  useEffect(() => { try { localStorage.setItem('editor.showRulers', String(showRulers)); } catch {} }, [showRulers]);
  useEffect(() => { try { localStorage.setItem('editor.device', String(device)); } catch {} }, [device]);
  useEffect(() => { try { localStorage.setItem('editor.zoom', String(zoom)); } catch {} }, [zoom]);
  useEffect(() => { try { localStorage.setItem('editor.activeLeftTab', String(activeLeftTab)); } catch {} }, [activeLeftTab]);
  useEffect(() => { try { localStorage.setItem('editor.overflow', String(overflowMode)); } catch {} }, [overflowMode]);
  useEffect(() => { try { localStorage.setItem('editor.gridSize', String(gridSize)); } catch {} }, [gridSize]);
  useEffect(() => { try { localStorage.setItem('editor.snapSize', String(snapSize)); } catch {} }, [snapSize]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      // Ignore when typing in inputs or contentEditable
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if (k === '1') { setShowLeft(true); setActiveLeftTab('Elements'); }
      else if (k === '2') { setShowLeft(true); setActiveLeftTab('Components'); }
      else if (k === '3') { setShowLeft(true); setActiveLeftTab('Pages'); }
      else if (k === 'g') { setShowGrid(v=>!v); }
      else if (k === 'r') { setShowRulers(v=>!v); }
      else if (k === 'n') { setShowNavigator(v=>!v); }
      else if (k === 'l') { setShowLeft(v=>!v); }
      else if (k === 'escape') { setShowLeft(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Listen for global request to open Navigator from TopBar menu
  useEffect(() => {
    const openNav = () => setShowNavigator(true);
    window.addEventListener('editor.openNavigator', openNav);
    return () => window.removeEventListener('editor.openNavigator', openNav);
  }, []);

  // Document state with history
  const history = useHistory([]);
  const elements = history.value;
  const setElements = history.set;

  // Selection
  const [selectedId, setSelectedId] = useState(null);

  const onDropNewElement = useCallback((item) => {
    const built = buildElementFromLibrary(item);
    setElements([...elements, ...built]);
    setSelectedId(built[0]?.id ?? null);
    // Auto-close the left sidebar after a successful drop (slight delay for stability)
    setTimeout(() => setShowLeft(false), 120);
  }, [elements, setElements]);

  const updateSelected = useCallback((updater) => {
    if (!selectedId) return;
    const next = elements.map((el) => (el.id === selectedId ? updater(el) : el));
    setElements(next);
  }, [elements, selectedId, setElements]);

  const deleteSelected = () => {
    if (!selectedId) return;
    setElements(elements.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const selectedElement = useMemo(() => elements.find((el) => el.id === selectedId), [elements, selectedId]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`flex flex-col h-screen ${dark ? 'bg-[#0b0d11]' : 'bg-[#f8f9fa]'}`}>
        <TopBar
          projectName="New Project"
          breadcrumb={["Home","Desktop"]}
          device={device}
          setDevice={setDevice}
          onToggleLeft={() => setShowLeft((v) => !v)}
          onToggleRight={() => setShowRight((v) => !v)}
          onSave={() => toast.success('Project saved successfully')}
          onPreview={() => setShowPreview(true)}
          onGenerate={() => {
            const html = generateHTML(elements);
            navigator?.clipboard?.writeText(html);
            toast.success('Generated code copied to clipboard');
          }}
          dark={dark}
          setDark={setDark}
        />
        <div className={`grid ${isSmall ? 'grid-cols-[44px_1fr]' : (showRight ? (showLeft ? 'grid-cols-[44px_auto_1fr_auto]' : 'grid-cols-[44px_1fr_auto]') : (showLeft ? 'grid-cols-[44px_auto_1fr]' : 'grid-cols-[44px_1fr]'))} gap-4 p-4 flex-1 min-h-0`}>
          {/* Left tool rail - expanded icon bar */}
          <div ref={leftRailRef} className={`h-[calc(100vh-6rem)] sticky top-16 rounded-2xl border shadow-sm flex flex-col items-center py-2 ${dark ? 'border-gray-800 bg-[#0f1115] text-gray-300' : 'border-gray-200 bg-white text-gray-700'}`}>
            {/* Brand mark */}
            <div className={`w-8 h-8 rounded-lg grid place-items-center text-[10px] font-bold select-none ${dark ? 'bg-gradient-to-br from-blue-600/20 to-indigo-600/20 text-blue-300' : 'bg-blue-50 text-blue-700'}`} title="WebBuilder">
              WB
            </div>
            <div className={`my-2 w-6 h-px ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />

            {/* Create/Add */}
            <LeftRailButton title="Add (Library)" active={activeLeftTab==='Elements' && showLeft} onClick={()=>{ setShowLeft(true); setActiveLeftTab('Elements'); }} dark={dark}>
              <FiPlus />
            </LeftRailButton>
            {/* Pages */}
            <LeftRailButton title="Pages" active={activeLeftTab==='Pages' && showLeft} onClick={()=>{ setShowLeft(true); setActiveLeftTab('Pages'); }} dark={dark}>
              <FiFileText />
            </LeftRailButton>
            {/* Layers/Navigator moved to TopBar menu; removed from left rail */}
            {/* Components */}
            <LeftRailButton title="Components" active={activeLeftTab==='Components' && showLeft} onClick={()=>{ setShowLeft(true); setActiveLeftTab('Components'); }} dark={dark}>
              <FiGrid />
            </LeftRailButton>

            <div className={`my-2 w-6 h-px ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />

            {/* Grid toggle */}
            <LeftRailButton title="Grid" active={showGrid} onClick={()=>setShowGrid(v=>!v)} dark={dark}>
              <FiGrid />
            </LeftRailButton>
            {/* Rulers toggle */}
            <LeftRailButton title="Rulers" active={showRulers} onClick={()=>setShowRulers(v=>!v)} dark={dark}>
              <FiFileText />
            </LeftRailButton>

            <div className="mt-auto" />

            {/* Utility icons (placeholders) */}
            <LeftRailButton title="Settings" active={false} onClick={()=>toast.info('Settings coming soon')} dark={dark}>
              <FiUser />
            </LeftRailButton>
            <LeftRailButton title="Search" active={false} onClick={()=>toast.info('Search coming soon')} dark={dark}>
              <FiSearch />
            </LeftRailButton>
          </div>
          <AnimatePresence initial={false}>
            {showLeft && (
              isSmall ? (
                <>
                  <motion.div key="left-backdrop" className="fixed inset-0 z-40 bg-black/40" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowLeft(false)} />
                  <motion.aside ref={leftAsideRef} key="left-overlay" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className={`fixed z-50 top-3 left-3 bottom-3 w-[300px] rounded-2xl border shadow-xl overflow-hidden ${dark ? 'border-gray-800 bg-[#0f1115] text-gray-200' : 'border-gray-200 bg-white'}`}>
                    <LeftSidebar
                      activeTab={activeLeftTab}
                      setActiveTab={setActiveLeftTab}
                      search={search}
                      setSearch={setSearch}
                      onSelectPage={(id) => { console.log('Page selected:', id); setShowLeft(false); }}
                      dark={dark}
                    />
                  </motion.aside>
                </>
              ) : (
                <motion.aside ref={leftAsideRef}
                  key="left"
                  initial={{ x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -24, opacity: 0 }}
                  transition={{ type: 'tween', duration: 0.18, ease: 'easeOut' }}
                  className={`h-[calc(100vh-6rem)] sticky top-16 rounded-2xl border shadow-sm overflow-hidden ${dark ? 'border-gray-800 bg-[#0f1115] text-gray-200' : 'border-gray-200 bg-white'}`}
                >
                  <LeftSidebar
                    activeTab={activeLeftTab}
                    setActiveTab={setActiveLeftTab}
                    search={search}
                    setSearch={setSearch}
                    onSelectPage={(id) => { console.log('Page selected:', id); setShowLeft(false); }}
                    dark={dark}
                  />
                </motion.aside>
              )
            )}
          </AnimatePresence>

          <main className={`rounded-2xl border backdrop-blur-sm shadow-sm overflow-hidden ${dark ? 'border-gray-800 bg-[#0f1115]/80' : 'border-gray-200 bg-white/60'}`}>
            <Canvas
              elements={elements}
              setElements={setElements}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              device={device}
              zoom={zoom}
              setZoom={setZoom}
              onDropNewElement={onDropNewElement}
              dark={dark}
              showGrid={showGrid}
              showRulers={showRulers}
              overflowMode={overflowMode}
              onCanvasClick={() => setShowLeft(false)}
              gridSize={gridSize}
              snapSize={snapSize}
            />
          </main>

          <AnimatePresence initial={false}>
            {showNavigator && (
              <>
                <motion.div key="nav-backdrop" className="fixed inset-0 z-40 bg-black/40" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowNavigator(false)} />
                <motion.aside key="nav-overlay" initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -12, opacity: 0 }} transition={{ type: 'tween', duration: 0.16, ease: 'easeOut' }} className={`fixed z-50 top-3 left-3 bottom-3 w-[260px] rounded-2xl border shadow-xl overflow-hidden ${dark ? 'border-gray-800 bg-[#0f1115] text-gray-200' : 'border-gray-200 bg-white'}`}>
                  <NavigatorPanel
                    elements={elements}
                    selectedId={selectedId}
                    onSelect={(id)=>{ setSelectedId(id); setShowNavigator(false); }}
                    onReorder={(from, to) => {
                      if (from === to) return;
                      const next = [...elements];
                      const [m] = next.splice(from, 1);
                      next.splice(to, 0, m);
                      setElements(next);
                    }}
                    onDelete={(id)=>{
                      setElements(elements.filter(e=>e.id!==id));
                      if (selectedId===id) setSelectedId(null);
                    }}
                    dark={dark}
                  />
                </motion.aside>
              </>
            )}
          {showRight && (
              isSmall ? (
                <>
                  <motion.div key="right-backdrop" className="fixed inset-0 z-40 bg-black/40" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowRight(false)} />
                  <motion.aside key="right-overlay" initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 24, opacity: 0 }} transition={{ type: 'tween', duration: 0.18, ease: 'easeOut' }} className={`fixed z-50 top-3 right-3 bottom-3 w-[360px] max-w-[90vw] rounded-2xl border shadow-xl overflow-hidden ${dark ? 'border-gray-800 bg-[#0f1115] text-gray-200' : 'border-gray-200 bg-white'}`}>
                    <InspectorTabs
                      element={selectedElement}
                      onChange={(updated) => updateSelected(() => updated)}
                      onDelete={deleteSelected}
                      dark={dark}
                    />
                  </motion.aside>
                </>
              ) : (
                <motion.aside
                  key="right"
                  initial={{ x: 24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 24, opacity: 0 }}
                  transition={{ type: 'tween', duration: 0.18, ease: 'easeOut' }}
                  className={`h-[calc(100vh-6rem)] sticky top-16 rounded-2xl border shadow-sm overflow-hidden w-[360px] ${dark ? 'border-gray-800 bg-[#0f1115] text-gray-200' : 'border-gray-200 bg-white'}`}
                >
                  <InspectorTabs
                    element={selectedElement}
                    onChange={(updated) => updateSelected(() => updated)}
                    onDelete={deleteSelected}
                    dark={dark}
                  />
                </motion.aside>
              )
            )}
          </AnimatePresence>
      </div>
      <BottomToolbar
        zoom={zoom}
        setZoom={setZoom}
        device={device}
        setDevice={setDevice}
        onUndo={history.undo}
        onRedo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        dark={dark}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        showRulers={showRulers}
        setShowRulers={setShowRulers}
        overflowMode={overflowMode}
        setOverflowMode={setOverflowMode}
        gridSize={gridSize}
        setGridSize={setGridSize}
        snapSize={snapSize}
        setSnapSize={setSnapSize}
      />
    </div>
    <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} elements={elements} deviceWidth={DEVICE_PRESETS[device]} dark={dark} />
  </DndProvider>
  );
}

const generateHTML = (elements) => {
  const html = elements.map((el) => {
    switch (el.type) {
      case 'div':
        return `<div style="${Object.entries(el.style).map(([key, value]) => `${key}: ${value}`).join(';')}">${el.content}</div>`;
      case 'text':
        return `<p style="${Object.entries(el.style).map(([key, value]) => `${key}: ${value}`).join(';')}">${el.content}</p>`;
      case 'image':
        return `<img src="${el.src}" alt="${el.alt}" style="${Object.entries(el.style).map(([key, value]) => `${key}: ${value}`).join(';')}">`;
      case 'button':
        return `<button style="${Object.entries(el.style).map(([key, value]) => `${key}: ${value}`).join(';')}">${el.content}</button>`;
      default:
        return '';
    }
  }).join('');
  return `<html><body>${html}</body></html>`;
};

function PreviewModal({ open, onClose, elements, deviceWidth, dark }) {
  if (!open) return null;
  const html = generateHTML(elements);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
        className={`relative rounded-2xl shadow-2xl overflow-hidden w-[90vw] h-[85vh] border ${dark ? 'bg-[#0f1115] border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className={`flex items-center justify-between px-4 py-2 border-b ${dark ? 'border-gray-800 bg-[#0f1115]/90 text-gray-200' : 'border-gray-200 bg-white/80 text-gray-700'}`}>
          <div className="text-sm">Preview</div>
          <button onClick={onClose} className={`px-3 py-1.5 text-xs rounded-lg border ${dark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}>Close</button>
        </div>
        <div className={`${dark ? 'bg-[#0b0d11]' : 'bg-gray-50'} w-full h-full`}>
          <iframe title="preview" className={`w-full h-full ${dark ? 'bg-[#0b0d11]' : 'bg-white'}`} style={{ border: '0' }} srcDoc={html}></iframe>
        </div>
      </motion.div>
    </div>
  );
}