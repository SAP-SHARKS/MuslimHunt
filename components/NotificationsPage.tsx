import React, { useMemo } from 'react';
import { Bell, ArrowLeft, MessageSquare, Triangle, Clock } from 'lucide-react';
import { Notification } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';

interface NotificationsPageProps {
  notifications: Notification[];
  onBack: () => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onBack, onMarkAsRead }) => {

  const groupedNotifications = useMemo(() => {
    const today = new Date();
    const groups: Record<string, Notification[]> = {
      'Today': [],
      'Yesterday': [],
      'Earlier': []
    };

    notifications.forEach(n => {
      const d = new Date(n.created_at);
      if (d.toDateString() === today.toDateString()) {
        groups['Today'].push(n);
      } else {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) {
          groups['Yesterday'].push(n);
        } else {
          groups['Earlier'].push(n);
        }
      }
    });
    return groups;
  }, [notifications]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Recent notifications</h1>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedNotifications).map(([label, items]) => (
            items.length > 0 && (
              <div key={label}>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">{label}</h2>
                <div className="space-y-4">
                  {items.map(n => (
                    <div
                      key={n.id}
                      onClick={() => onMarkAsRead(n.id)}
                      className={`flex gap-4 p-5 rounded-2xl transition-all cursor-pointer border ${n.streak_days ? 'bg-amber-50/50 border-amber-100 hover:border-amber-200' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md'}`}
                    >
                      {/* Icon/Avatar */}
                      <div className="shrink-0">
                        {n.type === 'streak' ? (
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${n.streak_days && n.streak_days >= 5 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                            <Flame className={`w-6 h-6 ${n.streak_days && n.streak_days >= 5 ? 'fill-emerald-600' : 'fill-amber-600'}`} />
                            {n.streak_days && <span className="absolute text-[10px] font-bold text-white mt-1">{n.streak_days}</span>}
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shadow-sm relative">
                            {n.avatar_url ? (
                              <img src={n.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center ${n.type === 'approval' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                                {n.type === 'approval' ? <ShieldCheck className="w-6 h-6" /> : <Bell className="w-5 h-5" />}
                              </div>
                            )}
                            {!n.is_read && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-0.5">
                        <p className="text-sm text-gray-900 leading-relaxed">
                          {n.type === 'streak' ? (
                            <span>
                              You have been awarded a <span className="font-bold">Gone streaking {n.streak_days && n.streak_days >= 5 ? '5' : ''} badge</span>.
                              <br />
                              <span className="text-gray-500 font-normal">You maintained a streak for {n.streak_days} days</span>
                            </span>
                          ) : (
                            n.message
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 font-medium">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(n.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No new notifications.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Categories (Visual Replica) */}
      <div className="bg-[#0e1217] py-16 px-4 mt-20 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-6">Top Product Categories</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Engineering & Development</li>
              <li className="hover:text-white cursor-pointer transition-colors">Design & Creative</li>
              <li className="hover:text-white cursor-pointer transition-colors">Productivity</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-6">LLMs</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">AI Chatbots</li>
              <li className="hover:text-white cursor-pointer transition-colors">AI Infrastructure</li>
              <li className="hover:text-white cursor-pointer transition-colors">Prompt Engineering</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-6">Social & Community</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Social Networking</li>
              <li className="hover:text-white cursor-pointer transition-colors">Community Management</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-6">Finance</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Accounting Software</li>
              <li className="hover:text-white cursor-pointer transition-colors">Fundraising</li>
              <li className="hover:text-white cursor-pointer transition-colors">Investing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;