import React, { useEffect, useState, useRef } from 'react';
import { Bell, Inbox, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { useAdminNotificationsQuery, useMarkNotificationAsReadMutation, useMarkAllNotificationsAsReadMutation } from '../hooks/useAdmin';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useAuth } from '../../../app/store/auth-context';
import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '../../../app/i18n/i18n-context';
import clsx from 'clsx';
import { formatDateTime } from '../../../shared/utils/date';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications = [] } = useAdminNotificationsQuery();
  const markAsRead = useMarkNotificationAsReadMutation();
  const markAllAsRead = useMarkAllNotificationsAsReadMutation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { locale } = useI18n();
  const dateLocale = locale === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-US';
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.token) return;

    const connection = new HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_API_URL + '/hub/admin', {
        accessTokenFactory: () => user.token as string,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log('Connected to AdminHub');
        connection.on('ReceiveNotification', (notification) => {
          console.log('Received notification:', notification);
          queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
        });
      })
      .catch((err) => console.error('Error connecting to AdminHub', err));

    return () => {
      connection.stop();
    };
  }, [user?.token, queryClient]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = (id: number) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'NEW_ORDER':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'LOW_STOCK':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'FAILED_PAYMENT':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Inbox className="w-5 h-5 text-slate-500" />;
    }
  };

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className="relative" ref={popupRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-500 hover:text-primary-600 rounded-lg relative focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
      >
        <Bell className="w-5 ml-1 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200/60 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            {notifications.length > 0 && unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-[28rem] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500">
                <Bell className="w-8 h-8 text-slate-300 mb-3" />
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notif: any) => (
                  <div 
                    key={notif.id}
                    onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                    className={clsx(
                      "p-4 flex gap-3 cursor-pointer transition-colors",
                      notif.isRead ? "bg-white opacity-70" : "bg-slate-50 hover:bg-slate-100"
                    )}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getIconForType(notif.notificationType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={clsx("text-sm mb-1", notif.isRead ? "text-slate-700 font-medium" : "text-slate-900 font-semibold")}>
                        {notif.title}
                      </p>
                      <p className={clsx("text-xs leading-relaxed", notif.isRead ? "text-slate-500" : "text-slate-600")}>
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {formatDateTime(notif.createdAt, undefined, dateLocale)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
