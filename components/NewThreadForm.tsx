
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Bold, Italic, List, ListOrdered, Link as LinkIcon, Code, 
  Quote, AtSign, Image as ImageIcon, BarChart2, Home, 
  MessageSquare, Hash, Info, Search, ChevronDown, Check, PlusSquare
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

const TOPIC_FORUMS = [
  'p/general', 'p/vibecoding', 'p/ama', 'p/introduce-yourself', 'p/self-promotion'
];

const PRODUCT_FORUMS = [
  'p/bult-ai', 'p/notisprite', 'p/groq-chat', 'p/pretty-prompt', 'p/weather-mini-for-mac'
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

  // Implement /p/new permalink on mount
  useEffect(() => {
    window.history.pushState({}, '', '/p/new');
    // Revert URL on unmount (if handled via setView elsewhere, this is a safety)
    return () => {
      if (window.location.pathname === '/p/new') {
        window.history.pushState({}, '', '/');
      }
    };
  }, []);

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
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[11px] font-bold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
        {tooltip}
      </div>
    </div>
  );

  const SidebarLink = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-xl ${
        active 
        ? 'text-emerald-800 bg-emerald-50 font-bold' 
        : 'text-gray-500 hover:text-emerald-800 hover:bg-emerald-50'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-emerald-800' : 'text-gray-400 opacity-70 group-hover:text-emerald-800 group-hover:opacity-100'}`} />
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Re-architected High-Fidelity Left Sidebar */}
        <aside className="hidden lg:block space-y-10 sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pr-2">
          <nav className="space-y-1">
            <SidebarLink icon={Home} label="Home" onClick={() => setView(View.HOME)} />
            <SidebarLink icon={MessageSquare} label="Recent comments" onClick={() => setView(View.RECENT_COMMENTS)} />
            <SidebarLink icon={Search} label="Search all threads" onClick={() => {}} />
            <SidebarLink icon={PlusSquare} label="Start new thread" active={true} onClick={() => {}} />
          </nav>

          <section>
            <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Topic Forums</h3>
            <div className="space-y-0.5">
              {TOPIC_FORUMS.map((fid) => (
                <button 
                  key={fid} 
                  type="button"
                  onClick={() => setFormData({ ...formData, forumId: fid })}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all rounded-xl ${
                    formData.forumId === fid ? 'text-emerald-800 bg-emerald-50 font-bold' : 'text-gray-500 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <Hash className={`w-3.5 h-3.5 ${formData.forumId === fid ? 'opacity-100' : 'opacity-40'}`} /> 
                  <span className="truncate">{fid}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Product Forums</h3>
            <div className="space-y-0.5">
              {PRODUCT_FORUMS.map((fid) => (
                <button 
                  key={fid} 
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all"
                >
                  <Hash className="w-3.5 h-3.5 opacity-40" /> 
                  <span className="truncate">{fid}</span>
                </button>
              ))}
            </div>
          </section>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-serif font-bold text-emerald-900 tracking-tight">Start new thread</h2>
            <button 
              onClick={() => {
                window.history.pushState({}, '', '/');
                onCancel();
              }} 
              className="p-2.5 hover:bg-emerald-50 text-gray-400 hover:text-emerald-800 rounded-full transition-all active:scale-95"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 overflow-hidden">
            <div className="p-8 sm:p-12 space-y-10">
              {/* Searchable Forum Selection */}
              <div className="space-y-2.5 relative" ref={dropdownRef}>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] px-1">Select Forum</label>
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent hover:border-emerald-200 focus:border-emerald-800 rounded-[1.25rem] outline-none transition-all text-base font-bold flex items-center justify-between cursor-pointer shadow-sm"
                >
                  <span className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-emerald-800 opacity-50" />
                    {selectedForum.label}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-emerald-800' : ''}`} />
                </div>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-3 bg-white border border-gray-100 shadow-2xl rounded-[1.5rem] z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300 ring-4 ring-emerald-900/5">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          autoFocus
                          type="text"
                          placeholder="Search for a forum..."
                          value={forumSearch}
                          onChange={(e) => setForumSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-emerald-900/5 outline-none focus:border-emerald-800 transition-all font-medium"
                        />
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto custom-scrollbar p-2">
                      {filteredForums.map(forum => (
                        <div 
                          key={forum.id}
                          onClick={() => {
                            setFormData({...formData, forumId: forum.id});
                            setIsDropdownOpen(false);
                          }}
                          className={`px-4 py-3.5 flex items-center justify-between hover:bg-emerald-50 cursor-pointer transition-all rounded-xl mb-1 last:mb-0 ${
                            formData.forumId === forum.id ? 'bg-emerald-50' : ''
                          }`}
                        >
                          <span className={`text-sm ${formData.forumId === forum.id ? 'font-black text-emerald-800' : 'text-gray-700 font-bold'}`}>
                            {forum.label}
                          </span>
                          {formData.forumId === forum.id && <Check className="w-4 h-4 text-emerald-800" />}
                        </div>
                      ))}
                      {filteredForums.length === 0 && (
                        <div className="px-5 py-10 text-center text-sm text-gray-400 italic">
                          No forums found for "{forumSearch}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-400 font-bold pt-1 px-1">
                  Share and discuss tech, products, business, startups, or product recommendations.
                </p>
              </div>

              {/* Title Input */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] px-1">Title*</label>
                <input 
                  required
                  value={formData.title}
                  onChange={e => {
                    setFormData({...formData, title: e.target.value});
                    if (showTitleError) setShowTitleError(false);
                  }}
                  placeholder="What's on your mind?"
                  className={`w-full px-6 py-5 bg-gray-50 border rounded-[1.25rem] outline-none transition-all text-2xl font-black placeholder:text-gray-300 shadow-sm ${
                    showTitleError ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-transparent focus:bg-white focus:border-emerald-800 focus:shadow-emerald-900/5'
                  }`}
                />
              </div>

              {/* Body Content with Rich Text Editor */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] px-1">Body</label>
                <div className="border border-gray-100 rounded-[1.5rem] overflow-hidden focus-within:border-emerald-800 focus-within:ring-4 focus-within:ring-emerald-900/5 transition-all bg-white shadow-sm">
                  <div className="flex flex-wrap items-center gap-1 px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                    <ToolbarButton icon={Bold} label="Bold" tooltip="Bold (Toggle with cmd & b)" onClick={() => handleFormat('bold')} />
                    <ToolbarButton icon={Italic} label="Italic" tooltip="Italic (Toggle with cmd & i)" onClick={() => handleFormat('italic')} />
                    <div className="w-[1px] h-5 bg-gray-200 mx-2" />
                    <ToolbarButton icon={ListOrdered} label="Ordered List" tooltip="Ordered list" onClick={() => handleFormat('insertOrderedList')} />
                    <ToolbarButton icon={List} label="Bullet List" tooltip="Bullet list" onClick={() => handleFormat('insertUnorderedList')} />
                    <div className="w-[1px] h-5 bg-gray-200 mx-2" />
                    <ToolbarButton icon={LinkIcon} label="Link" tooltip="Link" onClick={() => {
                      const url = prompt('Enter the link URL:');
                      if (url) handleFormat('createLink', url);
                    }} />
                    <ToolbarButton icon={Code} label="Code Block" tooltip="Code block" onClick={() => handleFormat('formatBlock', 'pre')} />
                    <ToolbarButton icon={Quote} label="Blockquote" tooltip="Blockquote" onClick={() => handleFormat('formatBlock', 'blockquote')} />
                    <div className="w-[1px] h-5 bg-gray-200 mx-2" />
                    <ToolbarButton icon={AtSign} label="Mention" tooltip="Mention @user or @product" onClick={() => {}} />
                    <ToolbarButton icon={ImageIcon} label="Image" tooltip="Upload an image" onClick={() => {}} />
                    <ToolbarButton icon={BarChart2} label="Poll" tooltip="Add poll" onClick={() => {}} />
                  </div>
                  
                  <div className="relative">
                    <div 
                      ref={editorRef}
                      contentEditable
                      onInput={handleEditorInput}
                      className="w-full px-8 py-8 bg-white outline-none min-h-[320px] text-lg leading-relaxed text-gray-800 prose prose-emerald max-w-none scroll-smooth"
                    />
                    {(!formData.body || formData.body === '<br>' || formData.body === '') && (
                      <div className="absolute top-8 left-8 pointer-events-none text-gray-300 text-lg font-bold">
                        Share your thoughts with the community...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-emerald-50/50 rounded-[1.5rem] border border-emerald-100 shadow-sm">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-800 shadow-sm shrink-0 mt-1">
                  <Info className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">Community Guidelines</p>
                  <p className="text-sm text-emerald-900 font-medium leading-relaxed">
                    Be respectful, helpful, and keep discussions relevant to the Muslim tech ecosystem. We're here to grow together and support Halal-conscious digital builders.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 sm:px-12 py-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-6">
              <button 
                type="button"
                onClick={() => {
                  window.history.pushState({}, '', '/');
                  onCancel();
                }}
                className="px-6 py-3 text-sm font-black text-gray-400 hover:text-emerald-800 transition-all uppercase tracking-[0.2em] active:scale-95"
              >
                Discard
              </button>
              <button 
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-black px-12 py-4.5 rounded-[1.25rem] shadow-xl shadow-emerald-900/15 hover:shadow-emerald-900/25 hover:-translate-y-0.5 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-sm"
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
