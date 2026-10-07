import React, { useState } from 'react';
import { useLanguage } from '@/shared/i18n';
import { useThemeStore } from '@/shared/theme';
import { Icon } from '@/shared/ui/Icon';
import { cn } from '@/shared/lib';
import { NotificationPanel } from '@/shared/components/display/NotificationPanel';

// ─── Mock News Data ──────────────────────────────────────────────────────────

export interface NewsArticle {
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
  onOpenDetail?: (article: NewsArticle) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, language, featured = false, onOpenDetail }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  if (featured && article.images.length > 0) {
    // Hero card — full-bleed image with gradient
    return (
      <article className="relative rounded-2xl overflow-hidden shadow-lg border border-border-subtle mb-4 group">
        <div
          onClick={() => onOpenDetail?.(article)}
          className="relative aspect-[16/9] cursor-pointer"
        >
          <img
            src={article.images[0]}
            alt={article.title[language]}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDetail?.(article)}
              className="h-7 px-2.5 rounded-lg bg-bg-secondary hover:bg-bg-card border border-border-subtle text-text-primary text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all"
            >
              <Icon name="FileText" size={12} className="text-brand-500" />
              <span>{language === 'am' ? 'ሙሉ ዝርዝር' : 'Details'}</span>
            </button>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-[11px] font-bold text-[#7a2330] dark:text-[#E8886E] flex items-center gap-1"
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
            className="w-full h-full object-cover transition-opacity duration-300 cursor-pointer"
            loading="lazy"
            onClick={() => onOpenDetail?.(article)}
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
        <h3
          onClick={() => onOpenDetail?.(article)}
          className="font-bold text-[14px] text-text-primary leading-snug mb-1 cursor-pointer hover:text-brand-500 transition-colors"
        >
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
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-subtle/50">
          <div className="flex items-center gap-1.5 text-text-muted text-[10px]">
            <div className="w-5 h-5 rounded-full bg-bg-secondary flex items-center justify-center">
              <Icon name="User" size={11} />
            </div>
            <span>{article.author}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDetail?.(article)}
              className="h-6 px-2 rounded-lg bg-bg-secondary hover:bg-bg-card border border-border-subtle text-text-primary text-[10.5px] font-semibold flex items-center gap-1 active:scale-95 transition-all"
            >
              <Icon name="FileText" size={11} className="text-brand-500" />
              <span>{language === 'am' ? 'ዝርዝር' : 'Details'}</span>
            </button>

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
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const categories = ['all', ...Array.from(new Set(MOCK_NEWS.map((n) => n.category)))];

  const filtered = activeCategory === 'all'
    ? MOCK_NEWS
    : MOCK_NEWS.filter((n) => n.category === activeCategory);

  const pinnedArticle = filtered.find((n) => n.isPinned);
  const regularArticles = filtered.filter((n) => !n.isPinned);

  const pageTitle = language === 'am' ? 'ዜናዎች' : 'News';
  const allLabel = language === 'am' ? 'ሁሉም' : 'All';

  const relatedArticles = selectedArticle
    ? MOCK_NEWS.filter((n) => n.id !== selectedArticle.id)
    : [];

  return (
    <div className="w-full bg-bg-primary text-text-primary min-h-screen flex flex-col pb-24">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#681926] to-[#9B2236] flex items-center justify-center shrink-0 shadow-sm border border-border-subtle">
              <Icon name="Newspaper" size={18} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-extrabold text-text-primary leading-tight">{pageTitle}</span>
              <span className="text-[10.5px] font-medium text-text-muted leading-none mt-0.5">
                {language === 'am' ? 'የኰኵሐ ሃይማኖት ሰንበት ት/ቤት' : 'Kokoha Haymanot'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => changeLanguage(language === 'am' ? 'en' : 'am')}
              className="h-9 px-2.5 rounded-full bg-bg-card border border-border-subtle shadow-sm hover:border-brand-500/50 flex items-center gap-1.5 active:scale-95 transition-all text-text-primary"
              aria-label="Switch language"
            >
              <Icon name="Globe" size={15} className="text-brand-500 shrink-0" />
              <span className="text-[11.5px] font-bold tracking-tight">{language === 'am' ? 'አማ' : 'EN'}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full bg-bg-card border border-border-subtle shadow-sm flex items-center justify-center text-text-primary active:scale-95 transition-all"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Icon name="Sun" size={17} className="text-amber-400" />
              ) : (
                <Icon name="Moon" size={17} className="text-brand-500" />
              )}
            </button>

            <button
              onClick={() => setNotifOpen(true)}
              className="relative h-9 w-9 rounded-full bg-bg-card border border-border-subtle shadow-sm flex items-center justify-center text-text-primary active:scale-95 transition-all"
              aria-label="Notifications"
            >
              <Icon name="Bell" size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E5484D]" />
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
          <NewsCard
            article={pinnedArticle}
            language={language}
            featured
            onOpenDetail={(a) => setSelectedArticle(a)}
          />
        )}

        {/* Regular cards */}
        {regularArticles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            language={language}
            onOpenDetail={(a) => setSelectedArticle(a)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-2">
            <Icon name="Newspaper" size={36} className="opacity-30" />
            <span className="text-sm">{language === 'am' ? 'ምንም ዜና የለም' : 'No news yet'}</span>
          </div>
        )}
      </main>

      {/* ── Big News Article Detail Modal ─────────────────────────────── */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedArticle(null);
          }}
        >
          <div className="bg-bg-primary rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border border-border-subtle flex flex-col animate-slide-up sm:animate-scale-up">

            {/* Sticky Modal Bar */}
            <div className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-md px-4 py-3 border-b border-border-subtle flex items-center justify-between">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm"
                style={{ backgroundColor: selectedArticle.categoryColor }}
              >
                {selectedArticle.category}
              </span>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted hover:text-text-primary active:scale-95 transition-all"
                aria-label="Close"
              >
                <Icon name="X" size={17} />
              </button>
            </div>

            {/* Full Picture or Carousel */}
            {selectedArticle.images.length > 0 && (
              <div className="relative aspect-[16/10] bg-bg-secondary overflow-hidden shrink-0">
                <img
                  src={selectedArticle.images[0]}
                  alt={selectedArticle.title[language]}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Modal Body */}
            <div className="p-4 sm:p-5 flex flex-col gap-4">
              {/* Metadata row */}
              <div className="flex items-center justify-between text-[11.5px] text-text-muted">
                <div className="flex items-center gap-1.5 font-medium">
                  <Icon name="User" size={13} className="text-brand-500" />
                  <span>{selectedArticle.author}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{selectedArticle.date}</span>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" size={12} />
                    <span>{selectedArticle.readTime} {language === 'am' ? 'ደቂቃ' : 'min'}</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-[19px] sm:text-[21px] font-black text-text-primary leading-snug">
                {selectedArticle.title[language]}
              </h1>

              {/* Lead / Description */}
              <p className="text-[13.5px] font-medium text-text-secondary leading-relaxed bg-bg-secondary/60 p-3 rounded-2xl border border-border-subtle/60">
                {selectedArticle.description[language]}
              </p>

              {/* Full Content */}
              <div className="text-[13.5px] text-text-primary leading-relaxed whitespace-pre-line flex flex-col gap-2">
                {selectedArticle.fullContent[language]}
              </div>

              {/* ── Related News Section ─────────────────────────────── */}
              {relatedArticles.length > 0 && (
                <div className="pt-4 border-t border-border-subtle flex flex-col gap-3">
                  <h3 className="text-[14px] font-bold text-text-primary">
                    {language === 'am' ? 'ተዛማጅ ዜናዎች' : 'Related News'}
                  </h3>

                  <div className="flex flex-col gap-2.5">
                    {relatedArticles.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => setSelectedArticle(rel)}
                        className="p-2.5 rounded-2xl bg-bg-secondary hover:bg-bg-card border border-border-subtle flex items-center gap-3 cursor-pointer transition-all active:scale-[0.99]"
                      >
                        {rel.images.length > 0 ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-bg-card border border-border-subtle shrink-0">
                            <img src={rel.images[0]} alt={rel.title[language]} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-bg-card border border-border-subtle flex items-center justify-center text-text-muted shrink-0">
                            <Icon name="Newspaper" size={20} />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className="text-[10px] font-bold w-fit px-1.5 py-0.2 rounded"
                            style={{ color: rel.categoryColor }}
                          >
                            {rel.category}
                          </span>
                          <h4 className="text-[12.5px] font-bold text-text-primary truncate mt-0.5">
                            {rel.title[language]}
                          </h4>
                          <span className="text-[10px] text-text-muted mt-0.5">
                            {rel.date} · {rel.readTime} {language === 'am' ? 'ደቂቃ' : 'min'}
                          </span>
                        </div>
                        <Icon name="ChevronRight" size={16} className="text-text-muted shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Action */}
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="mt-2 h-11 w-full rounded-2xl bg-bg-secondary hover:bg-bg-card border border-border-subtle text-text-primary font-bold text-[13px] active:scale-[0.98] transition-all"
              >
                {language === 'am' ? 'ዝጋ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} unreadCount={2} />

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.28s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up { animation: scale-up 0.24s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default NewsPage;
