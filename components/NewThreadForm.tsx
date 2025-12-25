
import React, { useState } from 'react';
import { X, Bold, Italic, List, Link as LinkIcon, Code, Home, MessageSquare, Hash, Info } from 'lucide-react';

interface NewThreadFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const NewThreadForm: React.FC<NewThreadFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    forum: 'p/general',
    title: '',
    body: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) return;
    onSubmit(formData);
  };

  const ToolbarIcon = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <button 
      type="button" 
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
              {['p/general', 'p/vibecoding', 'p/ama', 'p/show-and-tell'].map((forum) => (
                <button key={forum} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all">
                  <Hash className="w-3.5 h-3.5 opacity-50" /> {forum}
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
            <div className="p-8 space-y-6">
              {/* Forum Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Forum</label>
                <select 
                  value={formData.forum}
                  onChange={e => setFormData({...formData, forum: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-xl outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                >
                  <option value="p/general">p/general</option>
                  <option value="p/vibecoding">p/vibecoding</option>
                  <option value="p/ama">p/ama</option>
                  <option value="p/show-and-tell">p/show-and-tell</option>
                </select>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-xl outline-none transition-all text-lg font-bold placeholder:text-gray-300"
                />
              </div>

              {/* Body Content with Toolbar */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Body</label>
                <div className="border border-gray-100 rounded-2xl overflow-hidden focus-within:border-emerald-800 transition-all">
                  <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-100">
                    <ToolbarIcon icon={Bold} label="Bold" />
                    <ToolbarIcon icon={Italic} label="Italic" />
                    <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                    <ToolbarIcon icon={List} label="Bullet List" />
                    <ToolbarIcon icon={LinkIcon} label="Link" />
                    <ToolbarIcon icon={Code} label="Code Block" />
                  </div>
                  <textarea 
                    required
                    rows={8}
                    value={formData.body}
                    onChange={e => setFormData({...formData, body: e.target.value})}
                    placeholder="Provide more context for your discussion..."
                    className="w-full px-5 py-4 bg-white outline-none resize-none text-base leading-relaxed placeholder:text-gray-300"
                  />
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
