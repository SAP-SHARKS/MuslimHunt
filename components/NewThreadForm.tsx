
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Bold, Italic, List, ListOrdered, Link as LinkIcon, Code, 
  Quote, AtSign, Image as ImageIcon, Info, Search, ChevronDown, Check, Hash, Loader2
} from 'lucide-react';
import { View, Forum, User } from '../types';
import { supabase } from '../lib/supabase';

interface NewThreadFormProps {
  onCancel: () => void;
  onSubmit: () => void;
  setView: (view: View) => void;
  user: User | null;
  forums: Forum[];
}

const NewThreadForm: React.FC<NewThreadFormProps> = ({ onCancel, onSubmit, setView, user, forums }) => {
  const [formData, setFormData] = useState({
    forumId: forums[0]?.id || '',
    title: '',
    body: ''
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [forumSearch, setForumSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forums.length > 0 && !formData.forumId) {
      setFormData(prev => ({ ...prev, forumId: forums[0].id }));
    }
  }, [forums]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, body: editorRef.current?.innerHTML || '' }));
    }
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleEditorInput();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title.trim() || !formData.forumId) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('threads').insert([{
        forum_id: formData.forumId,
        user_id: user.id,
        title: formData.title,
        body: formData.body,
        upvotes_count: 0,
        comment_count: 0
      }]);
      if (error) throw error;
      onSubmit();
    } catch (err) {
      console.error('[NewThread] Submission failed:', err);
      alert('Bismillah, something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedForum = forums.find(f => f.id === formData.forumId) || forums[0];
  const filteredForums = forums.filter(f => f.name.toLowerCase().includes(forumSearch.toLowerCase()));

  const ToolbarButton = ({ icon: Icon, tooltip, onClick }: any) => (
    <button 
      type="button" onClick={onClick} title={tooltip}
      className="p-1.5 text-gray-400 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif font-bold text-emerald-900">Start a new discussion</h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative" ref={dropdownRef}>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Choose Forum</label>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 shadow-sm hover:border-emerald-200 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-800"><Hash className="w-4 h-4" /></div>
              {selectedForum?.name || 'Select a forum...'}
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-gray-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text" placeholder="Search forums..." value={forumSearch} onChange={(e) => setForumSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:bg-white focus:ring-1 focus:ring-emerald-800 transition-all"
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredForums.map((f) => (
                  <button
                    key={f.id} type="button"
                    onClick={() => { setFormData({ ...formData, forumId: f.id }); setIsDropdownOpen(false); }}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-emerald-50 text-left transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className={`text-sm ${formData.forumId === f.id ? 'font-bold text-emerald-800' : 'text-gray-700'}`}>{f.name}</span>
                      <span className="text-[10px] text-gray-400 font-medium">p/{f.slug}</span>
                    </div>
                    {formData.forumId === f.id && <Check className="w-4 h-4 text-emerald-800" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-1">Discussion Title</label>
          <input
            required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Give your discussion a clear title..."
            className="w-full px-5 py-5 bg-white border border-gray-100 rounded-3xl text-xl font-bold text-gray-900 outline-none focus:border-emerald-800 transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-1">Message Body</label>
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden focus-within:border-emerald-800 transition-all shadow-sm">
            <div className="flex items-center gap-1 p-3 border-b border-gray-50 bg-gray-50/50">
              <ToolbarButton icon={Bold} tooltip="Bold" onClick={() => handleFormat('bold')} />
              <ToolbarButton icon={Italic} tooltip="Italic" onClick={() => handleFormat('italic')} />
              <div className="w-px h-4 bg-gray-200 mx-2" />
              <ToolbarButton icon={List} tooltip="Bullet List" onClick={() => handleFormat('insertUnorderedList')} />
              <ToolbarButton icon={ListOrdered} tooltip="Ordered List" onClick={() => handleFormat('insertOrderedList')} />
              <div className="w-px h-4 bg-gray-200 mx-2" />
              <ToolbarButton icon={LinkIcon} tooltip="Link" onClick={() => handleFormat('createLink', prompt('URL:') || '')} />
              <ToolbarButton icon={Quote} tooltip="Quote" onClick={() => handleFormat('formatBlock', 'blockquote')} />
            </div>
            <div
              ref={editorRef} contentEditable onInput={handleEditorInput}
              className="w-full min-h-[350px] p-8 outline-none prose prose-emerald max-w-none text-gray-700"
              placeholder="What's on your mind?"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Info className="w-4 h-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Share insights and stay respectful</p>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onCancel} className="px-8 py-4 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
            <button
              type="submit" disabled={isSubmitting}
              className="px-10 py-4 bg-emerald-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post Thread'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewThreadForm;
