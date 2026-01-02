
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Bold, Italic, List, ListOrdered, Link as LinkIcon, Code, 
  Quote, Hash, Info, Search, ChevronDown, Check, Loader2, Sparkles, MessageSquare, Rocket, Compass, Flame, Calendar, Mail, FileText, Menu, Star, Zap, Cpu, CheckSquare, Palette, Users, DollarSign, Megaphone, Layout, Triangle, Bot, Trophy, Activity, Wind, Brain, Moon, Dumbbell, Hotel, Map, Chrome, Figma, Slack, Wallet, ShoppingBag, CreditCard, Baby, BookOpen
} from 'lucide-react';
import { View, Forum, User } from '../types';
import { supabase } from '../lib/supabase';

const ICON_MAP: Record<string, any> = {
  Rocket, Compass, MessageSquare, Flame, Calendar, Mail, BookOpen, FileText, Menu, X, Star, Zap, Code, Cpu, CheckSquare, Palette, Users, DollarSign, Megaphone, Layout, Triangle, Bot, Sparkles, Trophy, Hash,
  Activity, Wind, Brain, Moon, Dumbbell, Hotel, Map, Chrome, Figma, Slack, Wallet, ShoppingBag, CreditCard, Baby
};

interface NewThreadFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  setView: (view: View) => void;
  user: User | null;
}

const NewThreadForm: React.FC<NewThreadFormProps> = ({ onCancel, onSubmit, setView, user }) => {
  // 1. Dynamic Data Fetching & 2. State Management
  const [forums, setForums] = useState<Forum[]>([]);
  const [loadingForums, setLoadingForums] = useState(true);
  const [formData, setFormData] = useState({
    forumId: '',
    title: '',
    body: ''
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [forumSearch, setForumSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        setLoadingForums(true);
        // Fetching all forums from Supabase 'forums' table
        const { data, error } = await supabase
          .from('forums')
          .select('id, name, slug, description, icon_name')
          .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        setForums(data || []);
        
        // 3. Dropdown Logic: Set default forumId to the first item once data is available
        if (data && data.length > 0) {
          setFormData(prev => ({ ...prev, forumId: data[0].id }));
        }
      } catch (err) {
        console.error('[Muslim Hunt] Failed to fetch forums:', err);
      } finally {
        setLoadingForums(false);
      }
    };
    fetchForums();
  }, []);

  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setFormData(prev => ({ ...prev, body: html === '<br>' ? '' : html }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedForum = forums.find(f => f.id === formData.forumId);
  const SelectedIcon = selectedForum ? (ICON_MAP[selectedForum.icon_name] || Hash) : Hash;

  // 3. Dropdown Logic: Ensure search filter works against the fetched 'name' column
  const filteredForums = forums.filter(f => 
    f.name.toLowerCase().includes(forumSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title.trim() || !formData.forumId) {
      alert("Please ensure you've selected a forum and entered a title.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 4. Data Integrity: Ensure the selected 'id' from the forums table is used
      const { data: thread, error: threadError } = await supabase
        .from('threads')
        .insert([{
          forum_id: formData.forumId, // Selected ID from database
          user_id: user.id,
          title: formData.title,
          body: formData.body,
          upvotes_count: 0,
          comment_count: 0
        }])
        .select()
        .single();

      if (threadError) throw threadError;

      // Handle notification for the user (non-critical)
      try {
        await supabase.from('notifications').insert([{
          user_id: user.id,
          type: 'comment',
          message: `Your thread "${formData.title}" is now live in p/${selectedForum?.slug}.`,
          is_read: false
        }]);
      } catch (nErr) {
        console.warn('Notification insert failed, continuing...', nErr);
      }

      onSubmit(thread);
    } catch (err: any) {
      console.error('CRITICAL: Thread submission failed!', err);
      alert(`Submission failed: ${err.message || 'Check your connection.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleEditorInput();
  };

  const ToolbarButton = ({ icon: Icon, tooltip, onClick }: any) => (
    <button 
      type="button" 
      onClick={onClick}
      title={tooltip}
      className="p-2 text-gray-400 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-all"
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-emerald-900">New Discussion</h2>
          <p className="text-gray-400 font-medium text-sm">Share insights or ask questions to the Muslim tech community.</p>
        </div>
        <button onClick={onCancel} className="p-3 hover:bg-gray-100 rounded-full transition-colors active:scale-90">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Forum Selection Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Select Forum</label>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={loadingForums}
            className="w-full flex items-center justify-between px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 shadow-sm hover:border-emerald-200 transition-all focus:border-emerald-800 outline-none"
          >
            <div className="flex items-center gap-3">
              {loadingForums ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SelectedIcon className="w-4 h-4 text-emerald-800" />
              )}
              {loadingForums ? 'Fetching forums...' : (selectedForum?.name || 'Choose a forum...')}
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-gray-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter forums..."
                    value={forumSearch}
                    onChange={(e) => setForumSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:bg-white focus:ring-1 focus:ring-emerald-800 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {filteredForums.length > 0 ? (
                  filteredForums.map((f) => {
                    // 3. Dropdown Logic: Map the icon_name from database to Lucide React icons
                    const Icon = ICON_MAP[f.icon_name] || Hash;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, forumId: f.id });
                          setIsDropdownOpen(false);
                          setForumSearch('');
                        }}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-emerald-50 text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${formData.forumId === f.id ? 'text-emerald-800' : 'text-gray-400'}`} />
                          <div>
                            <p className={`text-sm ${formData.forumId === f.id ? 'font-bold text-emerald-800' : 'text-gray-700 font-medium'}`}>{f.name}</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">p/{f.slug}</p>
                          </div>
                        </div>
                        {formData.forumId === f.id && <Check className="w-4 h-4 text-emerald-800" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-5 py-4 text-xs text-gray-400 italic">No forums match your search.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Discussion Title</label>
          <input
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="What's on your mind? Be descriptive..."
            className="w-full px-6 py-5 bg-white border border-gray-100 rounded-2xl text-xl font-bold text-gray-900 outline-none focus:border-emerald-800 transition-all shadow-sm placeholder:text-gray-200"
          />
        </div>

        {/* Rich Text Body */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Message Body</label>
          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden focus-within:border-emerald-800 transition-all shadow-sm">
            <div className="flex items-center gap-1 p-2 border-b border-gray-50 bg-gray-50/50">
              <ToolbarButton icon={Bold} tooltip="Bold" onClick={() => handleFormat('bold')} />
              <ToolbarButton icon={Italic} tooltip="Italic" onClick={() => handleFormat('italic')} />
              <div className="w-px h-4 bg-gray-200 mx-2" />
              <ToolbarButton icon={List} tooltip="Bullet List" onClick={() => handleFormat('insertUnorderedList')} />
              <ToolbarButton icon={ListOrdered} tooltip="Ordered List" onClick={() => handleFormat('insertOrderedList')} />
              <div className="w-px h-4 bg-gray-200 mx-2" />
              <ToolbarButton icon={LinkIcon} tooltip="Add Link" onClick={() => {
                const url = prompt('Enter the URL:');
                if (url) handleFormat('createLink', url);
              }} />
              <ToolbarButton icon={Quote} tooltip="Quote" onClick={() => handleFormat('formatBlock', 'blockquote')} />
            </div>
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              className="w-full min-h-[300px] p-8 outline-none prose prose-emerald max-w-none text-gray-800 font-medium"
              placeholder="Start typing your discussion here..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-50">
          <div className="flex items-center gap-3 text-gray-400">
            <Info className="w-5 h-5" />
            <p className="text-[11px] font-black uppercase tracking-widest">Post helpful content and be respectful of the community.</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-none px-10 py-4 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loadingForums}
              className="flex-1 sm:flex-none px-12 py-4 bg-emerald-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-emerald-900/10"
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
