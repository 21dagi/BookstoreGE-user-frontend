import React, { useState } from 'react';
import { Icon } from '@/shared/ui/Icon';
import { cn } from '@/shared/lib';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'order' | 'news' | 'wallet' | 'equb';
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'ትዕዛዝ ዝግጁ ነው', body: 'ትዕዛዝዎ በየኰኵሐ ሃይማኖት ሰንበት ት/ቤት ዝግጁ ሆኗል።', time: '2 ሰዓ በፊት', read: false, type: 'order' },
  { id: '2', title: 'አዲስ ዜና', body: 'አዲስ ዜና ለእርስዎ ታትሟል — ይፈትሹ!', time: '5 ሰዓ በፊት', read: false, type: 'news' },
  { id: '3', title: 'ቦርሳ ተሞልቷል', body: '500 ብር ወደ ቦርሳዎ ተጨምሯል።', time: '1 ቀን በፊት', read: true, type: 'wallet' },
];

const typeIcon = (type: NotificationItem['type']) => {
  const m: Record<NotificationItem['type'], string> = { order: '📦', news: '📰', wallet: '💳', equb: '🔄' };
  return m[type];
};

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  unreadCount?: number;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose, unreadCount = 0 }) => {
  const [items, setItems] = useState(MOCK_NOTIFICATIONS);

  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom sheet panel */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto z-[61]',
          'bg-bg-primary rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.22)] border-t border-border-subtle',
          'flex flex-col',
          'animate-slide-up',
        )}
        style={{ maxHeight: '75vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border-strong/60" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[17px] font-bold text-text-primary">ማሳወቂያዎች</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#7a2330] text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={markAll}
            className="text-[12px] font-semibold text-accent-500 hover:text-brand-500 transition-colors"
          >
            ሁሉንም አንብብ
          </button>
        </div>

        {/* Notification list */}
        <div className="overflow-y-auto flex-1 px-4 pb-6 flex flex-col gap-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-muted gap-2">
              <Icon name="Bell" size={36} className="opacity-30" />
              <span className="text-sm">ምንም ማሳወቂያ የለም</span>
            </div>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                onClick={() => setItems((prev) => prev.map((item) => item.id === n.id ? { ...item, read: true } : item))}
                className={cn(
                  'w-full flex items-start gap-3 p-3.5 rounded-2xl text-left transition-all',
                  n.read
                    ? 'bg-bg-card/60 border border-border-subtle/60'
                    : 'bg-bg-card border border-border-subtle shadow-sm',
                )}
              >
                <span className="w-9 h-9 rounded-full bg-bg-secondary flex items-center justify-center text-[18px] shrink-0 mt-0.5">
                  {typeIcon(n.type)}
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn('text-[13px] leading-tight', n.read ? 'font-medium text-text-secondary' : 'font-bold text-text-primary')}>
                      {n.title}
                    </span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[#7a2330] shrink-0" />}
                  </div>
                  <span className="text-[11.5px] text-text-secondary mt-0.5 line-clamp-2 leading-snug">{n.body}</span>
                  <span className="text-[10px] text-text-muted mt-1">{n.time}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.32,0.72,0,1); }
      `}</style>
    </>
  );
};
