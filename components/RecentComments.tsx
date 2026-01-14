
import React, { useState, useRef } from 'react';
import { MessageSquare, Clock, Sparkles } from 'lucide-react';
import { View } from '../types';

interface RecentCommentsProps {
  setView: (view: View) => void;
  user: any;
  onViewProfile: (userId: string) => void;
  onSignIn: () => void;
}

const RecentComments: React.FC<RecentCommentsProps> = ({ setView, user, onViewProfile, onSignIn }) => {
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  const recentComments = [
    {
      id: 'rc1',
      forum: 'p/vibecoding',
      threadTitle: 'Which tech stack is best for Halal e-commerce in 2025?',
      author: {
        id: 'u_10',
        name: 'Pasindu (Riggz)',
        avatar: 'https://i.pravatar.cc/150?u=u_10',
        headline: 'HalalTech Enthusiast'
      },
      text: "@bobbydesign can't imagine what we will have after year or two. The scalability of Next.js combined with the local-first capabilities of Supabase is definitely the way forward for our ecosystem.",
      created_at: '2025-05-10T14:43:00Z'
    }
  ];

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return past.toLocaleDateString();
  };

  const handleMouseEnter = (commentId: string) => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    setHoveredCommentId(commentId);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredCommentId(null);
    }, 300);
  };

  return (
    <div className="space-y-8">
      <header className="mb-12 border-b border-emerald-50 pb-8">
        <div>
          <div className="flex items-center gap-2 text-[#004D40] mb-2">
            <MessageSquare className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Interactions</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-primary leading-none">Recent Comments</h1>
        </div>
      </header>

      <div className="space-y-4">
        {recentComments.map((comment) => (
          <div 
            key={comment.id} 
            className="group bg-white border border-gray-100 rounded-[2rem] p-6 hover:border-primary-light hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatTimeAgo(comment.created_at)}
                </span>
                <span className="text-[#004D40] bg-primary-light px-2 py-0.5 rounded-md">
                  {comment.forum}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#004D40] transition-colors leading-tight">
                {comment.threadTitle}
              </h2>
              <div className="flex items-start gap-4 pt-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                  <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-[15px] leading-relaxed line-clamp-2">
                    <span className="font-bold text-gray-900 mr-1">{comment.author.name}:</span>
                    {comment.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentComments;
