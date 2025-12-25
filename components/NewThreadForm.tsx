
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Bold, Italic, List, ListOrdered, Link as LinkIcon, Code, 
  Quote, AtSign, Image as ImageIcon, BarChart2, Home, 
  MessageSquare, Hash, Info, Search, ChevronDown, Check 
} from 'lucide-react';
import { View } from '../types';

interface NewThreadFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  setView: (view: View) => void;
}

const FORUM_OPTIONS = [
  { id: 'p/general', label: 'General' },
  { id: 'p/vibecoding', label: 'Vibecoding' },
  { id: 'p/intro', label: 'Introduce yourself' },
  { id: 'p/promo', label: 'Self-Promotion' }
];

const NewThreadForm: React.FC<NewThreadFormProps> = ({ onCancel, onSubmit, setView }) => {
  const [formData, setFormData] = useState({
    forumId: 'p/general',
    title: '',
    body: '' // Stores HTML string
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [forumSearch, setForumSearch] = useState('');
  const [showTitleError, setShowTitleError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync editor content to state
  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setFormData(prev => ({ ...prev, body: html === '<br>' ? '' : html }));
    }
  };

  // Keyboard shortcuts (Cmd/Ctrl + B, I)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        handleFormat('bold');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        handleFormat('italic');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedForum = FORUM_OPTIONS.find(f => f.id === formData.forumId) || FORUM_OPTIONS[0];

  const filteredForums = FORUM_OPTIONS.filter(f => 
    f.label.toLowerCase().includes(forumSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bodyContent = editorRef.current?.innerHTML || '';
    
    if (!formData.title.trim()) {
      setShowTitleError(true);
      return;
    }

    onSubmit({
      ...formData,
      body: bodyContent,
      forum: selectedForum.id
    });
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleEditorInput();
  };

  const ToolbarButton = ({ icon: Icon, label, tooltip, onClick }: { icon: any, label: string, tooltip: string, onClick: () => void }) => (
    <div className="relative group flex items-center justify-center">
      <button 
        type="button" 
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        aria-label={label}
        className="p-1.5 text-gray-400 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
      >
        <Icon className="w-4 h-4" />
      </button>
      {/* Sleek Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[11px] font-bold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
        {tooltip}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left Sidebar Navigation */}
        <aside className="hidden lg:block space-y-8 sticky top-24 h-fit">
          <nav className="space-y-1">
            <button 
              onClick={() => setView(View.FORUM_HOME)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-emerald-800 bg-emerald-50 rounded-xl"
            >
              <Home className="w-4 h-4" /> Home
            </button>
            <button 
              onClick={() => setView(View.RECENT_COMMENTS)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all"
            >
              <MessageSquare className="w-4 h-4" /> Recent comments
            </button>
          </nav>

          <section>
            <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Topic Forums</h3>
            <div className="space-y-1">
              {FORUM_OPTIONS.map((forum) => (
                <button 
                  key={forum.id} 
                  type="button"
                  onClick={() => setFormData({ ...formData, forumId: forum.id })}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all rounded-xl ${
                    formData.forumId === forum.id ? 'text-emerald-800 bg-emerald-50' : 'text-gray-500 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 opacity-50" /> {forum.id}
                </button>
              ))}
            </div>
          </section>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold text-emerald-900">Start new thread</h2>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Searchable Forum Selection */}
              <div className="space-y-2 relative" ref={dropdownRef}>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Forum</label>
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent hover:border-emerald-200 focus:border-emerald-800 rounded-2xl outline-none transition-all text-sm font-bold flex items-center justify-between cursor-pointer"
                >
                  <span>{selectedForum.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-gray-50 bg-gray-50">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          autoFocus
                          type="text"
                          placeholder="Search for a product..."
                          value={forumSearch}
                          onChange={(e) => setForumSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-0 outline-none focus:border-emerald-800 transition-all"
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {filteredForums.map(forum => (
                        <div 
                          key={forum.id}
                          onClick={() => {
                            setFormData({...formData, forumId: forum.id});
                            setIsDropdownOpen(false);
                          }}
                          className="px-5 py-4 flex items-center justify-between hover:bg-emerald-50 cursor-pointer transition-colors"
                        >
                          <span className={`text-sm ${formData.forumId === forum.id ? 'font-black text-emerald-800' : 'text-gray-700 font-bold'}`}>
                            {forum.label}
                          </span>
                          {formData.forumId === forum.id && <Check className="w-4 h-4 text-emerald-800" />}
                        </div>
                      ))}
                      {filteredForums.length === 0 && (
                        <div className="px-5 py-8 text-center text-sm text-gray-400 italic">
                          No forums found
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 font-medium pt-1 px-1">
                  Share and discuss tech, products, business, startups, or product recommendations.
                </p>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Title*</label>
                <input 
                  required
                  value={formData.title}
                  onChange={e => {
                    setFormData({...formData, title: e.target.value});
                    if (showTitleError) setShowTitleError(false);
                  }}
                  placeholder="What's on your mind?"
                  className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none transition-all text-xl font-bold placeholder:text-gray-300 ${
                    showTitleError ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-transparent focus:bg-white focus:border-emerald-800'
                  }`}
                />
              </div>

              {/* Body Content with Rich Text Editor & Functional Tooltips */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Body</label>
                <div className="border border-gray-100 rounded-3xl overflow-hidden focus-within:border-emerald-800 transition-all bg-white shadow-sm">
                  <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50/50 border-b border-gray-100">
                    <ToolbarButton icon={Bold} label="Bold" tooltip="Bold (Toggle with cmd & b)" onClick={() => handleFormat('bold')} />
                    <ToolbarButton icon={Italic} label="Italic" tooltip="Italic (Toggle with cmd & i)" onClick={() => handleFormat('italic')} />
                    <div className="w-[1px] h-4 bg-gray-200 mx-2" />
                    <ToolbarButton icon={ListOrdered} label="Ordered List" tooltip="Ordered list" onClick={() => handleFormat('insertOrderedList')} />
                    <ToolbarButton icon={List} label="Bullet List" tooltip="Bullet list" onClick={() => handleFormat('insertUnorderedList')} />
                    <div className="w-[1px] h-4 bg-gray-200 mx-2" />
                    <ToolbarButton icon={LinkIcon} label="Link" tooltip="Link" onClick={() => {
                      const url = prompt('Enter the link URL:');
                      if (url) handleFormat('createLink', url);
                    }} />
                    <ToolbarButton icon={Code} label="Code Block" tooltip="Code block" onClick={() => handleFormat('formatBlock', 'pre')} />
                    <ToolbarButton icon={Quote} label="Blockquote" tooltip="Blockquote" onClick={() => handleFormat('formatBlock', 'blockquote')} />
                    <div className="w-[1px] h-4 bg-gray-200 mx-2" />
                    <ToolbarButton icon={AtSign} label="Mention" tooltip="Mention @user or @product" onClick={() => {}} />
                    <ToolbarButton icon={ImageIcon} label="Image" tooltip="Upload an image" onClick={() => {}} />
                    <ToolbarButton icon={BarChart2} label="Poll" tooltip="Add poll" onClick={() => {}} />
                  </div>
                  
                  {/* Rich Text area */}
                  <div className="relative">
                    <div 
                      ref={editorRef}
                      contentEditable
                      onInput={handleEditorInput}
                      className="w-full px-6 py-6 bg-white outline-none min-h-[300px] text-lg leading-relaxed text-gray-700 prose prose-emerald max-w-none scroll-smooth"
                    />
                    {(!formData.body || formData.body === '<br>' || formData.body === '') && (
                      <div className="absolute top-6 left-6 pointer-events-none text-gray-300 text-lg font-medium">
                        Body
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-5 bg-emerald-50 rounded-[1.5rem] border border-emerald-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-800 shadow-sm shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <p className="text-xs text-emerald-900 font-bold leading-relaxed">
                  Community guidelines: Be respectful, helpful, and keep discussions relevant to the Muslim tech ecosystem. We're here to grow together.
                </p>
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4">
              <button 
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-sm font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
              >
                Discard
              </button>
              <button 
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-emerald-900/10 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
              >
                Post discussion
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default NewThreadForm;
