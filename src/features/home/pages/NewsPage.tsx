import React, { useState } from 'react';
import { useLanguage } from '@/shared/i18n';
import { useThemeStore } from '@/shared/theme';
import { Icon } from '@/shared/ui/Icon';
import { cn } from '@/shared/lib';
import { NotificationPanel } from '@/shared/components/display/NotificationPanel';

// ─── Mock News Data ──────────────────────────────────────────────────────────

interface NewsArticle {
  id: string;
  category: string;
  categoryColor: string;
  title: { am: string; en: string };
  description: { am: string; en: string };
  fullContent: { am: string; en: string };
  images: string[];
  author: string;
  date: string;
  readTime: number;
  isPinned?: boolean;
}

const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1',
    category: 'ዜናዎች',
    categoryColor: '#7a2330',
    title: { am: 'አዲስ መጻሕፍት ደርሰዋል!', en: 'New Books Have Arrived!' },
    description: { am: 'የዚህ ወር አዳዲስ መጻሕፍት ሰንበት ት/ቤቱ ደርሰዋል። ሐዲሳዊ፣ ሃይማኖታዊ እና ትምህርታዊ መጻሕፍትን ያካትታሉ።', en: 'This month\'s new books have arrived at our bookstore. They include devotional, religious, and educational titles.' },
    fullContent: { am: 'ሙሉ ዝርዝር ለማየት... በዚህ ወር ከደረሱት መጻሕፍት ዋናዎቹ፦\n• ተፈፀሙ - ሃይማኖታዊ ምርምር\n• ብርሃን ማዶ - ትምህርታዊ ምርምር\n• ቅድስናን ፈልጉ - ሃይማኖታዊ ትምህርት\n\nሁሉም ከዋጋ ዝርዝሩ ጋር ያዘጋጀናቸው ናቸው። አሁን ወደ ቤተ-መጻሕፍቱ ይምጡ ወይም ትዕዛዝ ይስጡ።', en: 'Full details of this month\'s arrivals:\n• Fulfilled - Devotional Research\n• Light Beyond - Educational Study\n• Seek Holiness - Religious Teaching\n\nAll priced and ready. Visit or order now.' },
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80'],
    author: 'ቤተ-መጻሕፍቱ',
    date: '2026-10-07',
    readTime: 3,
    isPinned: true,
  },
  {
    id: '2',
    category: 'ሰንበት ቤ/ት',
    categoryColor: '#B2782A',
    title: { am: 'ሰንበት ትምህርት ቤቱ ለ2017 ዓ.ም ምዝገባ ተጀምሯል', en: 'Sunday School Registration for 2017 EC Has Begun' },
    description: { am: 'ለ2017 ዓ.ም የሰንበት ትምህርት ቤት ምዝገባ ተጀምሯል። ሁሉም ፍቁዳን ልጆቻቸውን ሊያስምዘግቡ ይችላሉ። ምዝገባው እስከ ጥቅምት 30 ቀን 2017 ዓ.ም ይቀጥላል።', en: 'Registration for the 2017 EC Sunday School has opened. Parents are welcome to enroll their children until Tikimt 30, 2017 EC.' },
    fullContent: { am: 'ምዝገባ መረጃ:\n\nዕድሜ: ከ5-15 ዓመት\nቀን: ሰሞኑን ቅዳሜ ዕለት\nቦታ: ዋናው አዳራሽ\nሰዓት: ከጠዋቱ 3:00 - 5:00 ሰዓት\n\nለበለጠ መረጃ ቢሮውን ያነጋግሩ።', en: 'Registration Details:\n\nAge: 5-15 years\nDay: This Saturday\nLocation: Main Hall\nTime: 9:00 AM - 11:00 AM\n\nContact the office for more information.' },
    images: [],
    author: 'አስተዳደሩ',
    date: '2026-10-05',
    readTime: 2,
  },
  {
    id: '3',
    category: 'ዋጋ ቅናሽ',
    categoryColor: '#16a34a',
    title: { am: '15% ቅናሽ — ይህ ሳምንት ብቻ!', en: '15% Discount — This Week Only!' },
    description: { am: 'ሁሉም ሃይማኖታዊ መጻሕፍት ለዚህ ሳምንት ብቻ 15% ቅናሽ ይደረጋቸዋል። ትዕዛዝዎን አሁኑኑ ያስቀምጡ።', en: 'All religious books have a 15% discount this week only. Place your order now.' },
    fullContent: { am: 'ቅናሹ ለሚከተሉት ምድቦች ይሠራል:\n\n• ሃይማኖታዊ ትምህርት\n• ፀሎት መጻሕፍት\n• ቅዱሳት ጽሑፎች\n\nቅናሹ ሐሙስ ጥቅምት 14 ቀን 2017 ዓ.ም ያበቃል።', en: 'The discount applies to:\n\n• Religious Education\n• Prayer Books\n• Sacred Texts\n\nDiscount ends Thursday, October 14, 2017 EC.' },
    images: ['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80'],
    author: 'ቤተ-መጻሕፍቱ',
    date: '2026-10-04',
    readTime: 2,
  },
  {
    id: '4',
    category: 'ዜናዎች',
    categoryColor: '#7a2330',
    title: { am: 'አዲስ ዲጂታል ካታሎጋችን ተጀምሯል', en: 'Our New Digital Catalog Is Live' },
    description: { am: 'ሁሉም መጻሕፍቶቻቸን አሁን ዲጂታሉን ካታሎጋችን ላይ ይገኛሉ። ፍለጋ ያቃልልዎ፤ ትዕዛዝ ቀጥታ ያስቀምጡ።', en: 'All our books are now available on our digital catalog. Search easily and order directly.' },
    fullContent: { am: 'ዲጂታሉ ካታሎጋችን ለሚያቀርባቸው ጥቅሞች:\n\n• ቀጥተኛ ፍለጋ\n• ዋጋ ዝርዝር\n• ቀጥታ ትዕዛዝ\n• የሒሳብ ቦርሳ ክፍያ\n\nዛሬ ይሞክሩ!', en: 'Benefits of our digital catalog:\n\n• Direct search\n• Price listing\n• Direct ordering\n• Wallet payment\n\nTry it today!' },
    images: [],
    author: 'ቴክ ቡድን',
    date: '2026-10-01',
    readTime: 1,
  },
];

// ─── News Card Component ─────────────────────────────────────────────────────

interface NewsCardProps {
  article: NewsArticle;
  language: 'am' | 'en';
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, language, featured = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  if (featured && article.images.length > 0) {
    // Hero card — full-bleed image with gradient
    return (
      <article className="relative rounded-2xl overflow-hidden shadow-lg border border-border-subtle mb-4">
        <div className="relative aspect-[16/9]">
          <img
            src={article.images[0]}
            alt={article.title[language]}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Pinned badge */}
          {article.isPinned && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7a2330]/90 backdrop-blur-md text-white text-[10px] font-bold">
                <Icon name="Pin" size={10} />
                {language === 'am' ? 'ተሰካ' : 'Pinned'}
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: article.categoryColor + 'CC' }}>
              {article.category}
            </span>
          </div>

          <div className="absolute bottom-0 inset-x-0 p-4">
            <h2 className="text-white font-extrabold text-[17px] leading-snug drop-shadow mb-1">
              {article.title[language]}
            </h2>
            <p className={cn('text-white/80 text-[12px] leading-snug', expanded ? '' : 'line-clamp-2')}>
              {expanded ? article.fullContent[language] : article.description[language]}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-bg-card px-4 py-2.5 flex items-center justify-between border-t border-border-subtle">
          <div className="flex items-center gap-1.5 text-text-muted text-[10.5px]">
            <span>{article.author}</span>
            <span>·</span>
            <span>{article.readTime} {language === 'am' ? 'ደቂቃ ያነብቡ' : 'min read'}</span>
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[11px] font-bold text-[#7a2330] flex items-center gap-1"
          >
            {expanded
              ? (language === 'am' ? 'አሳጥር' : 'Show less')
              : (language === 'am' ? 'ተጨማሪ አንብብ' : 'Read more')}
            <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={12} />
          </button>
        </div>
      </article>
    );
  }

  // Regular card
  return (
    <article className={cn(
      'bg-bg-card rounded-2xl border border-border-subtle overflow-hidden shadow-sm transition-all duration-200',
      expanded && 'shadow-md',
    )}>
      {/* Image(s) */}
      {article.images.length > 0 && (
        <div className="relative aspect-[16/8] bg-bg-secondary overflow-hidden">
          <img
            src={article.images[activeImg]}
            alt={article.title[language]}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
          />
          {article.images.length > 1 && (
            <>
              {/* Image navigation dots */}
              <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                {article.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn('rounded-full transition-all', i === activeImg ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50')}
                  />
                ))}
              </div>
              {/* Arrows */}
              {activeImg > 0 && (
                <button onClick={() => setActiveImg((v) => v - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                  <Icon name="ChevronLeft" size={14} />
                </button>
              )}
              {activeImg < article.images.length - 1 && (
                <button onClick={() => setActiveImg((v) => v + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                  <Icon name="ChevronRight" size={14} />
                </button>
              )}
            </>
          )}
        </div>
      )}

      <div className="p-3.5">
        {/* Category + date row */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: article.categoryColor }}
          >
            {article.category}
          </span>
          <div className="flex items-center gap-1 text-text-muted text-[10px]">
            <Icon name="Clock" size={10} />
            <span>{article.readTime} {language === 'am' ? 'ደቂቃ' : 'min'}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[14px] text-text-primary leading-snug mb-1">
          {article.title[language]}
        </h3>

        {/* Description / Full content */}
        <p className={cn(
          'text-[12px] text-text-secondary leading-relaxed whitespace-pre-line',
          expanded ? '' : 'line-clamp-2',
        )}>
          {expanded ? article.fullContent[language] : article.description[language]}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 text-text-muted text-[10px]">
            <div className="w-5 h-5 rounded-full bg-bg-secondary flex items-center justify-center">
              <Icon name="User" size={11} />
            </div>
            <span>{article.author}</span>
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-[11px] font-bold transition-colors"
            style={{ color: article.categoryColor }}
          >
            {expanded
              ? (language === 'am' ? 'አሳጥር' : 'Show less')
              : (language === 'am' ? 'ተጨማሪ' : 'Read more')}
            <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={12} />
          </button>
        </div>
      </div>
    </article>
  );
};

// ─── Main NewsPage ──────────────────────────────────────────────────────────

const NewsPage: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(MOCK_NEWS.map((n) => n.category)))];

  const filtered = activeCategory === 'all'
    ? MOCK_NEWS
    : MOCK_NEWS.filter((n) => n.category === activeCategory);

  const pinnedArticle = filtered.find((n) => n.isPinned);
  const regularArticles = filtered.filter((n) => !n.isPinned);

  const pageTitle = language === 'am' ? 'ዜናዎች' : 'News';
  const allLabel = language === 'am' ? 'ሁሉም' : 'All';

  return (
    <div className="w-full bg-bg-primary text-text-primary min-h-screen flex flex-col pb-24">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#7a2330] flex items-center justify-center shrink-0">
              <Icon name="Newspaper" size={14} className="text-white" />
            </div>
            <span className="text-[15px] font-bold text-text-primary">{pageTitle}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => changeLanguage(language === 'am' ? 'en' : 'am')}
              className="h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center active:scale-95 transition-all"
            >
              <span className="text-[10px] font-extrabold text-brand-500">{language === 'am' ? 'EN' : 'አማ'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center active:scale-95 transition-all"
            >
              {resolvedTheme === 'dark'
                ? <Icon name="Sun" size={13} className="text-amber-400" />
                : <Icon name="Moon" size={13} className="text-brand-500" />
              }
            </button>
            <button
              onClick={() => setNotifOpen(true)}
              className="relative h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center active:scale-95 transition-all"
            >
              <Icon name="Bell" size={14} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#E5484D]" />
            </button>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar mt-2 pb-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all shadow-sm',
                activeCategory === cat
                  ? 'bg-[#7a2330] text-white'
                  : 'bg-bg-card border border-border-subtle text-text-secondary',
              )}
            >
              {cat === 'all' ? allLabel : cat}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 pt-3 pb-3 flex flex-col gap-3">
        {/* Pinned hero */}
        {pinnedArticle && (
          <NewsCard article={pinnedArticle} language={language} featured />
        )}

        {/* Regular cards */}
        {regularArticles.map((article) => (
          <NewsCard key={article.id} article={article} language={language} />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-2">
            <Icon name="Newspaper" size={36} className="opacity-30" />
            <span className="text-sm">{language === 'am' ? 'ምንም ዜና የለም' : 'No news yet'}</span>
          </div>
        )}
      </main>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} unreadCount={2} />
    </div>
  );
};

export default NewsPage;
