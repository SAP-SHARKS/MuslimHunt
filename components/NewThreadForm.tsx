
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

// Added default export and completed missing implementation
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

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif font-bold text-emerald-900">Start a new discussion</h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative" ref={dropdownRef}>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Select Forum</label>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-900 shadow-sm hover:border-emerald-200 transition-all"
          >
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-800" />
              {selectedForum.label}
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2 border-b border-gray-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search forums..."
                    value={forumSearch}
                    onChange={(e) => setForumSearch(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-gray-50 rounded-lg text-xs outline-none focus:bg-white focus:ring-1 focus:ring-emerald-800 transition-all"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredForums.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, forumId: f.id });
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-emerald-50 text-left transition-colors"
                  >
                    <span className={`text-sm ${formData.forumId === f.id ? 'font-bold text-emerald-800' : 'text-gray-700'}`}>
                      {f.label}
                    </span>
                    {formData.forumId === f.id && <Check className="w-4 h-4 text-emerald-800" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Discussion Title</label>
          <input
            required
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              setShowTitleError(false);
            }}
            placeholder="What would you like to discuss?"
            className={`w-full px-4 py-4 bg-white border ${showTitleError ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-100'} rounded-2xl text-xl font-bold text-gray-900 outline-none focus:border-emerald-800 transition-all placeholder:text-gray-200`}
          />
          {showTitleError && <p className="text-red-500 text-xs font-bold mt-1">Title is required</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Body</label>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden focus-within:border-emerald-800 transition-all">
            <div className="flex items-center gap-1 p-2 border-b border-gray-50 bg-gray-50/50">
              <ToolbarButton icon={Bold} label="Bold" tooltip="Bold (Ctrl+B)" onClick={() => handleFormat('bold')} />
              <ToolbarButton icon={Italic} label="Italic" tooltip="Italic (Ctrl+I)" onClick={() => handleFormat('italic')} />
              <div className="w-px h-4 bg-gray-200 mx-1" />
              <ToolbarButton icon={List} label="Bullet List" tooltip="Bullet List" onClick={() => handleFormat('insertUnorderedList')} />
              <ToolbarButton icon={ListOrdered} label="Ordered List" tooltip="Ordered List" onClick={() => handleFormat('insertOrderedList')} />
              <div className="w-px h-4 bg-gray-200 mx-1" />
              <ToolbarButton icon={LinkIcon} label="Link" tooltip="Link" onClick={() => {
                const url = prompt('Enter the URL:');
                if (url) handleFormat('createLink', url);
              }} />
              <ToolbarButton icon={Quote} label="Quote" tooltip="Quote" onClick={() => handleFormat('formatBlock', 'blockquote')} />
              <ToolbarButton icon={Code} label="Code" tooltip="Code" onClick={() => handleFormat('formatBlock', 'pre')} />
            </div>
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              className="w-full min-h-[300px] p-6 outline-none prose prose-emerald max-w-none text-gray-700"
              placeholder="Write your discussion here..."
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Info className="w-4 h-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Be respectful and helpful to others.</p>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-emerald-800 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg active:scale-95"
            >
              Post Thread
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewThreadForm;
