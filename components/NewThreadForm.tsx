
import React, { useState, useRef, useEffect } from 'react';
import { X, Bold, Italic, List, Link as LinkIcon, Code, Home, MessageSquare, Hash, Info, Search, ChevronDown, Check } from 'lucide-react';

interface NewThreadFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const FORUM_OPTIONS = [
  { id: 'p/general', label: 'General' },
  { id: 'p/vibecoding', label: 'Vibecoding' },
  { id: 'p/intro', label: 'Introduce yourself' },
  { id: 'p/promo', label: 'Self-Promotion' }
];

const NewThreadForm: React.FC<NewThreadFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    forumId: 'p/general',
    title: '',
    body: '' // This will store HTML
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [forumSearch, setForumSearch] = useState('');
  const [showTitleError, setShowTitleError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

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
  };

  const ToolbarIcon = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <button 
      type="button" 
      onClick={onClick}
      title={label}
      className="p-1.5 text-gray-400 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left Sidebar Navigation */}
        <aside className="hidden lg:block space-y-8">
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-emerald-800 bg-emerald-50 rounded-xl">
              <Home className="w-4 h-4" /> Home
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all">
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

          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Custom Searchable Forum Selection */}
              <div className="space-y-2 relative" ref={dropdownRef}>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Forum</label>
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent hover:border-emerald-200 focus:border-emerald-800 rounded-xl outline-none transition-all text-sm font-bold flex items-center justify-between cursor-pointer"
                >
                  <span>{selectedForum.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-gray-50">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          autoFocus
                          type="text"
                          placeholder="Search for a product..."
                          value={forumSearch}
                          onChange={(e) => setForumSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-0"
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredForums.map(forum => (
                        <div 
                          key={forum.id}
                          onClick={() => {
                            setFormData({...formData, forumId: forum.id});
                            setIsDropdownOpen(false);
                          }}
                          className="px-4 py-3 flex items-center justify-between hover:bg-emerald-50 cursor-pointer transition-colors"
                        >
                          <span className={`text-sm ${formData.forumId === forum.id ? 'font-bold text-emerald-800' : 'text-gray-700 font-medium'}`}>
                            {forum.label}
                          </span>
                          {formData.forumId === forum.id && <Check className="w-4 h-4 text-emerald-800" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 font-medium pt-1">
                  Share and discuss tech, products, business, startups, or product recommendations.
                </p>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Title*</label>
                <input 
                  required
                  value={formData.title}
                  onChange={e => {
                    setFormData({...formData, title: e.target.value});
                    if (showTitleError) setShowTitleError(false);
                  }}
                  placeholder="What's on your mind?"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-lg font-bold placeholder:text-gray-300 ${
                    showTitleError ? 'border-red-500 bg-red-50' : 'border-transparent focus:bg-white focus:border-emerald-800'
                  }`}
                />
              </div>

              {/* Body Content with Toolbar & Rich Text Editor */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Body</label>
                <div className="border border-gray-100 rounded-2xl overflow-hidden focus-within:border-emerald-800 transition-all">
                  <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-100">
                    <ToolbarIcon icon={Bold} label="Bold" onClick={() => handleFormat('bold')} />
                    <ToolbarIcon icon={Italic} label="Italic" onClick={() => handleFormat('italic')} />
                    <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                    <ToolbarIcon icon={List} label="Bullet List" onClick={() => handleFormat('insertUnorderedList')} />
                    <ToolbarIcon icon={LinkIcon} label="Link" onClick={() => {
                      const url = prompt('Enter the link URL:');
                      if (url) handleFormat('createLink', url);
                    }} />
                    <ToolbarIcon icon={Code} label="Code Block" onClick={() => {
                      // Simple code block implementation
                      handleFormat('formatBlock', '<pre>');
                    }} />
                  </div>
                  
                  {/* contentEditable div for Rich Text */}
                  <div className="relative">
                    <div 
                      ref={editorRef}
                      contentEditable
                      onInput={(e) => setFormData({ ...formData, body: (e.target as HTMLDivElement).innerHTML })}
                      className="w-full px-5 py-4 bg-white outline-none min-h-[200px] text-base leading-relaxed text-gray-700 prose prose-emerald max-w-none"
                    />
                    {(!formData.body || formData.body === '<br>') && (
                      <div className="absolute top-4 left-5 pointer-events-none text-gray-300 text-lg">
                        Body
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <Info className="w-4 h-4 text-emerald-800 shrink-0" />
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                  Community guidelines: Be respectful, helpful, and keep discussions relevant to the Muslim tech ecosystem.
                </p>
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Discard
              </button>
              <button 
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.98]"
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
