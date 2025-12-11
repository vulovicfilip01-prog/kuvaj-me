'use client';

import { useState, useEffect, useRef } from 'react';
import { LuBell } from 'react-icons/lu';
import { getNotifications, markAsRead, Notification } from '@/app/notifications/actions';
import Link from 'next/link';
import Image from 'next/image';

interface NotificationBellProps {
    initialUnreadCount: number;
}

export default function NotificationBell({ initialUnreadCount }: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch notifications when opening dropdown
    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            getNotifications()
                .then(data => {
                    setNotifications(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch notifications', err);
                    setIsLoading(false);
                });
        }
    }, [isOpen]);

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.is_read) {
            await markAsRead(notification.id);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n =>
                n.id === notification.id ? { ...n, is_read: true } : n
            ));
        }
        setIsOpen(false);
    };

    const getNotificationText = (type: Notification['type']) => {
        switch (type) {
            case 'follow': return 'te je zapratio/la';
            case 'comment': return 'je komentarisao/la tvoj recept';
            case 'like': return 'označio/la da mu/joj se sviđa tvoj recept';
            case 'review': return 'je ocenio/la tvoj recept';
            default: return 'ima novu aktivnost';
        }
    };

    const getLink = (notification: Notification) => {
        if (notification.type === 'follow') return `/profile/${notification.actor_id}`;
        if (notification.resource_id) return `/recipes/${notification.resource_id}`;
        return '#';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100"
            >
                <LuBell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-[100] animate-fadeIn">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-700 text-sm">Obaveštenja</h3>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 text-center text-slate-500 text-sm">Učitavanje...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                                <span className="text-2xl mb-2">🔕</span>
                                <p className="text-sm">Nema novih obaveštenja</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <Link
                                    key={notification.id}
                                    href={getLink(notification)}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${!notification.is_read ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="flex-shrink-0 w-8 h-8 relative rounded-full overflow-hidden bg-slate-200">
                                        {notification.profiles?.avatar_url ? (
                                            <Image
                                                src={notification.profiles.avatar_url}
                                                alt="Avatar"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xs font-bold">
                                                {notification.profiles?.display_name?.[0] || '?'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800">
                                            <span className="font-bold">{notification.profiles?.display_name || 'Korisnik'}</span>{' '}
                                            {getNotificationText(notification.type)}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {new Date(notification.created_at).toLocaleDateString('sr-RS')}
                                        </p>
                                    </div>
                                    {!notification.is_read && (
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                    )}
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
