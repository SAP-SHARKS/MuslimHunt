
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NotificationBellProps {
  userId: string | undefined;
  onClick: () => void;
  isOpen?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userId, onClick, isOpen }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // Initial fetch of unread count
    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (!error && count !== null) {
        setUnreadCount(count);
      }
    };

    fetchUnreadCount();

    // Real-time listener for new notifications
    const channel = supabase
      .channel('public:notifications_bell')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          setUnreadCount((prev) => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new.is_read === true && payload.old.is_read === false) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          } else if (payload.new.is_read === false && payload.old.is_read === true) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative p-2 rounded-xl transition-all duration-200 active:scale-90 group flex items-center justify-center ${
        isOpen 
          ? 'bg-emerald-50 text-emerald-800' 
          : 'text-gray-400 hover:bg-emerald-50 hover:text-emerald-800'
      }`}
      aria-label="Notifications"
    >
      <Bell className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-[15deg]' : 'group-hover:rotate-12'}`} />
      
      {unreadCount > 0 && (
        <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff6154] border border-white shadow-sm">
          </span>
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
