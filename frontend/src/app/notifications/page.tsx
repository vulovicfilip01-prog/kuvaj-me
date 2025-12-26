import { getNotifications, markAsRead, Notification } from './actions';
import { LuBell, LuCheckCheck } from 'react-icons/lu';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const notifications = await getNotifications();

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
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <LuBell className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 heading-font">Obaveštenja</h1>
                    </div>

                    {notifications.some(n => !n.is_read) && (
                        <button className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors text-sm">
                            <LuCheckCheck className="w-5 h-5" />
                            Označi sve kao pročitano
                        </button>
                    )}
                </div>

                <div className="space-y-4 animate-fadeIn">
                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
                            <div className="text-6xl mb-6 grayscale opacity-50">🔕</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Trenutno nema obaveštenja</h3>
                            <p className="text-slate-500">
                                Kada neko zaprati vaš profil ili reaguje na vaše recepte, to će se pojaviti ovde.
                            </p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`group relative bg-white p-5 rounded-2xl border transition-all hover:shadow-md ${!notification.is_read ? 'border-primary/20 bg-primary/[0.02]' : 'border-slate-100'}`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <Link href={`/profile/${notification.actor_id}`} className="flex-shrink-0">
                                        <div className="w-12 h-12 relative rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm hover:scale-105 transition-transform">
                                            {notification.profiles?.avatar_url ? (
                                                <Image
                                                    src={notification.profiles.avatar_url}
                                                    alt="Avatar"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-lg">
                                                    {notification.profiles?.display_name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <Link href={getLink(notification)} className="block group/link">
                                            <p className="text-slate-800 leading-tight">
                                                <span className="font-bold hover:text-primary transition-colors">
                                                    {notification.profiles?.display_name || 'Korisnik'}
                                                </span>
                                                {' '}
                                                <span className="text-slate-600">
                                                    {getNotificationText(notification.type)}
                                                </span>
                                            </p>
                                            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                                                {new Date(notification.created_at).toLocaleDateString('sr-RS', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </Link>
                                    </div>

                                    {/* Unread indicator */}
                                    {!notification.is_read && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/40 animate-pulse mt-2"></div>
                                    )}
                                </div>

                                {/* Mark as read action (integrated into click or separate button) */}
                                {!notification.is_read && (
                                    <form action={async () => {
                                        'use server';
                                        await markAsRead(notification.id);
                                    }} className="absolute top-4 right-4 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            className="p-1.5 text-slate-300 hover:text-primary transition-colors"
                                            title="Označi kao pročitano"
                                        >
                                            <LuCheckCheck className="w-5 h-5" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
