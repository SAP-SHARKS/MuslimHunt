
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Bold, Italic, List, ListOrdered, Link as LinkIcon, Code, 
  Quote, Info, Search, ChevronDown, Check, Hash
} from 'lucide-react';
import { View, ForumCategory } from '../types';
import { supabase } from '../lib/supabase';

interface NewThreadFormProps {
  onCancel: () => void;
  onSubmit: (data: { category_id: number; title: string; body: string }) => void;
  setView: (view: View) => void;
}

const NewThreadForm: React.FC<NewThreadFormProps> = ({ onCancel, onSubmit, setView }) => {
  const [formData, setFormData] = useState({
    forumCategoryId: null as number | null,
    title: '',
    body: '' 
  });

  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [forumSearch, setForumSearch] = useState('');
  const [showTitleError, setShowTitleError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchForumCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('forum_categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setCategories(data || []);
        if (data && data.length > 0) {
          setFormData(prev => ({ ...prev, forumCategoryId: data[0].id }));
        }
      } catch (err) {
        console.error('Error fetching forum categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchForumCategories();
  }, []);

  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setFormData(prev => ({ ...prev, body: html === '<br>' ? '' : html }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') { e.preventDefault(); handleFormat('bold'); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') { e.preventDefault(); handleFormat('italic'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedForum = categories.find(f => f.id === formData.forumCategoryId);
  const filteredForums = categories.filter(f => f.name.toLowerCase().includes(forumSearch.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bodyContent = editorRef.current?.innerHTML || '';
    if (!formData.title.trim()) { setShowTitleError(true); return; }
    if (formData.forumCategoryId === null) return;
    onSubmit({ title: formData.title, body: bodyContent, category_id: formData.forumCategoryId });
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleEditorInput();
  };

  const ToolbarButton = ({ icon: Icon, tooltip, onClick }: { icon: any, tooltip: string, onClick: () => void }) => (
    <button 
      type="button" 
      onClick={onClick}
      title={tooltip}
      className="p-1.5 text-gray-400 hover:text-[#004D40] hover:bg-primary-light rounded transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 bg-white lg:bg-transparent">
      {/* Mobile Sub-Header */}
      <div className="flex lg:hidden items-center gap-4 mb-4 px-4">
        <button type="button" className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
          Latest <ChevronDown size={14} />
        </button>
        <button type="button" className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
          Forums <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between lg:mb-8 mb-4 px-4 lg:px-0">
        <h2 className="text-2xl lg:text-3xl font-semibold lg:font-bold text-primary">Start new thread</h2>
        <button onClick={onCancel} className="lg:p-2 p-1 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 lg:px-0 px-4">
        <div className="relative" ref={dropdownRef}>
          <label className="hidden lg:block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Select Forum</label>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={loading}
            className="w-full flex items-center justify-between px-4 lg:px-5 py-3 lg:py-3.5 bg-gray-50 lg:bg-white border-transparent lg:border-gray-200 lg:border rounded-xl text-sm font-bold text-gray-900 lg:shadow-sm hover:border-primary-light transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#004D40]" />
              {loading ? 'Loading forums...' : (selectedForum?.name || 'Select Forum')}
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search forums..."
                    value={forumSearch}
                    onChange={(e) => setForumSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm outline-none focus:bg-white focus:ring-1 focus:ring-emerald-800 transition-all"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredForums.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => { setFormData({ ...formData, forumCategoryId: f.id }); setIsDropdownOpen(false); }}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-primary-light text-left transition-colors"
                  >
                    <span className={`text-sm ${formData.forumCategoryId === f.id ? 'font-bold text-[#004D40]' : 'text-gray-700'}`}>
                      {f.name}
                    </span>
                    {formData.forumCategoryId === f.id && <Check className="w-4 h-4 text-[#004D40]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="hidden lg:block text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Discussion Title</label>
          <input
            required
            value={formData.title}
            onChange={(e) => { setFormData({ ...formData, title: e.target.value }); setShowTitleError(false); }}
            placeholder="Title*"
            className={`w-full px-0 lg:px-5 py-3 lg:py-5 bg-white lg:border ${showTitleError ? 'border-red-300 ring-4 ring-red-50' : 'border-transparent lg:border-gray-200'} rounded-2xl text-xl font-bold text-gray-900 outline-none focus:border-[#004D40] transition-all placeholder:text-gray-300`}
          />
        </div>

        <div className="space-y-2">
          <label className="hidden lg:block text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Body</label>
          <div className="bg-white lg:border border-transparent lg:border-gray-200 rounded-2xl overflow-hidden focus-within:border-[#004D40] transition-all lg:shadow-sm">
            <div className="flex items-center gap-1 p-2.5 border-b border-gray-100 bg-gray-50/30">
              <ToolbarButton icon={Bold} tooltip="Bold (Ctrl+B)" onClick={() => handleFormat('bold')} />
              <ToolbarButton icon={Italic} tooltip="Italic (Ctrl+I)" onClick={() => handleFormat('italic')} />
              <div className="w-px h-4 bg-gray-200 mx-1" />
              <ToolbarButton icon={List} tooltip="Bullet List" onClick={() => handleFormat('insertUnorderedList')} />
              <ToolbarButton icon={ListOrdered} tooltip="Ordered List" onClick={() => handleFormat('insertOrderedList')} />
              <div className="w-px h-4 bg-gray-200 mx-1" />
              <ToolbarButton icon={LinkIcon} tooltip="Link" onClick={() => { const url = prompt('Enter URL:'); if (url) handleFormat('createLink', url); }} />
              <ToolbarButton icon={Quote} tooltip="Quote" onClick={() => handleFormat('formatBlock', 'blockquote')} />
            </div>
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              className="w-full min-h-[300px] lg:min-h-[350px] p-0 lg:p-6 lg:pt-6 pt-4 outline-none prose prose-emerald max-w-none text-gray-700"
              placeholder="Body"
            />
          </div>
        </div>

        <div className="pt-6 flex items-center justify-between border-t border-gray-100">
          <div className="hidden lg:flex items-center gap-2 text-gray-400">
            <Info size={16} />
            <p className="text-[11px] font-bold uppercase tracking-widest">Community Guidelines Apply</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto justify-end">
            <button type="button" onClick={onCancel} className="hidden lg:block px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="lg:px-10 px-8 lg:py-3.5 py-2.5 bg-white lg:bg-[#004D40] text-[#004D40] lg:text-white rounded-full lg:rounded-xl border border-gray-200 lg:border-transparent font-black text-sm uppercase tracking-widest hover:bg-gray-50 lg:hover:bg-primary-dark transition-all shadow-sm lg:shadow-lg active:scale-95">
              <span className="lg:hidden">Submit</span>
              <span className="hidden lg:inline">Post Thread</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewThreadForm;
