import React from 'react';
import { Bell, ArrowLeft, MessageSquare, Triangle, Clock } from 'lucide-react';
import { Notification } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';

interface NotificationsPageProps {
  notifications: Notification[];
  onBack: () => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onBack, onMarkAsRead }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-10 group font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to feed
      </button>

      <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-serif font-bold text-emerald-900 flex items-center gap-3">
          <Bell className="w-8 h-8 text-emerald-800" />
          Recent notifications
        </h1>
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
          {notifications.length} Total
        </span>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-[2rem] p-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-200" />
            </div>
            <p className="text-gray-400 font-medium italic">No notifications yet. Bismillah!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`flex items-start gap-4 p-6 bg-white border rounded-[1.5rem] transition-all hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 cursor-pointer ${n.is_read ? 'border-gray-100' : 'border-emerald-100 ring-1 ring-emerald-50'}`}
              onClick={() => onMarkAsRead(n.id)}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-50 shadow-sm">
                  {n.avatar_url ? (
                    <img src={n.avatar_url} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-800">
                      {n.type === 'upvote' ? <Triangle className="w-5 h-5 fill-emerald-800" /> : <MessageSquare className="w-5 h-5" />}
                    </div>
                  )}
                </div>
                {!n.is_read && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff6154] rounded-full border-2 border-white shadow-sm" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-900 leading-snug mb-1">
                  {n.message}
                </p>
                <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(n.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;