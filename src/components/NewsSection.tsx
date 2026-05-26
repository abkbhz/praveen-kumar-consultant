import React, { useState } from "react";
import { NewsItem, Language } from "../types";
import { TRANSLATIONS } from "../data";
import { Calendar, User, ArrowUpRight, X, Clock } from "lucide-react";

interface NewsSectionProps {
  lang: Language;
  news: NewsItem[];
  isAdminActive: boolean;
  onAddNews: (news: Omit<NewsItem, "id">) => Promise<void>;
  onUpdateNews?: (news: NewsItem) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
}

export function NewsSection({
  lang,
  news,
}: NewsSectionProps) {
  const t = TRANSLATIONS[lang];

  // Selected news item for full view overlay
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  return (
    <div id="news-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/50 px-3.5 py-1 rounded-full">
          {lang === "en" ? "MARKET ADVICE & INSIGHTS" : "വാർത്തകളും വിവരങ്ങളും"}
        </span>
        <h2 className="font-serif text-3xl sm:text-4.5xl font-bold text-stone-900 leading-tight block">
          {t.newsHeading}
        </h2>
        <p className="text-stone-500 text-sm max-w-2xl mx-auto font-light">
          {t.newsSub}
        </p>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
        {news.map((item) => (
          <article
            key={item.id}
            className="group relative bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            
            <div>
              {/* Optional dynamic picture */}
              <div className="relative aspect-video w-full overflow-hidden bg-stone-100 border-b border-stone-100">
                <img
                  src={item.image || "https://picsum.photos/seed/finance/800/600"}
                  alt={item.titleEn}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-102"
                />
                
                {/* Category tags absolute display */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center rounded-md bg-stone-900/85 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-amber-300 tracking-wide pointer-events-auto">
                    {lang === "en" ? item.categoryEn : item.categoryMl}
                  </span>
                </div>
              </div>

              {/* Text content summary */}
              <div className="p-6 space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {lang === "en" ? item.authorEn : item.authorMl}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug group-hover:text-amber-850">
                  {lang === "en" ? item.titleEn : item.titleMl}
                </h3>

                <p className="text-stone-600 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
                  {lang === "en" ? item.contentEn : item.contentMl}
                </p>
              </div>
            </div>

            {/* Read full article button trigger */}
            <div className="p-6 pt-0 border-t border-stone-50 mt-4 flex justify-between items-center">
              <button
                id={`read-news-btn-${item.id}`}
                onClick={() => setSelectedArticle(item)}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-600 transition duration-150 cursor-pointer"
              >
                {t.readMore}
                <ArrowUpRight className="h-4 w-4" />
              </button>
              
              <span className="text-[10px] text-stone-400 font-mono">
                {lang === "en" ? "5 Min Read" : "5 മിനിറ്റ് വായന"}
              </span>
            </div>

          </article>
        ))}
      </div>

      {/* Full Article Overlay Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-stone-200 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="absolute top-0 left-0 right-0 h-2 bg-amber-500" />

            <button
              id="close-news-detail-btn"
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-50 text-stone-400 hover:text-stone-700 transition z-10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Article container scroll */}
            <div className="overflow-y-auto flex-1">
              {/* Cover thumbnail */}
              <div className="relative aspect-video w-full bg-stone-100">
                <img
                  src={selectedArticle.image || "https://picsum.photos/seed/finance/800/600"}
                  alt={selectedArticle.titleEn}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                <span className="absolute bottom-6 left-6 rounded-md bg-amber-400 px-3 py-1 text-xs font-bold text-stone-900 uppercase">
                  {lang === "en" ? selectedArticle.categoryEn : selectedArticle.categoryMl}
                </span>
              </div>

              {/* Text elements */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Meta details */}
                <div className="flex flex-wrap gap-4 text-xs text-stone-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {selectedArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {lang === "en" ? selectedArticle.authorEn : selectedArticle.authorMl}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {lang === "en" ? "Published Financial Advice" : "ധനകാര്യ പ്രസിദ്ധീകരണം"}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3.5xl font-bold text-stone-950 leading-tight">
                  {lang === "en" ? selectedArticle.titleEn : selectedArticle.titleMl}
                </h3>

                <div className="h-0.5 w-16 bg-amber-500" />

                {/* Core news narrative */}
                <div className="text-stone-700 font-light leading-relaxed text-[15px] sm:text-[16px] space-y-4 font-sans whitespace-pre-line">
                  {lang === "en" ? selectedArticle.contentEn : selectedArticle.contentMl}
                </div>

                {/* Safe consulting call to action inline */}
                <div className="bg-amber-50/50 rounded-xl border border-amber-200/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-stone-900">
                      {lang === "en" ? "Need clear opinion on this update?" : "കൂടുതൽ വിവരങ്ങൾ നേരിട്ട് വേണോ?"}
                    </h4>
                    <p className="text-xs text-stone-500 leading-tight">
                      {lang === "en" ? "Praveen Kumar can review your document clearance requirements." : "പ്രവീൺ കുമാറിനെ നേരിട്ട് വിളിച്ച് നിങ്ങളുടെ സംശയങ്ങൾ ചോദിക്കൂ."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-stone-800 bg-amber-200/50 px-2.5 py-1.5 rounded">
                      +91 98479 14198
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Close */}
            <div className="bg-stone-50 border-t border-stone-100 p-4 shrink-0 flex justify-end">
              <button
                id="article-modal-close"
                onClick={() => setSelectedArticle(null)}
                className="inline-flex items-center justify-center rounded-lg bg-stone-900 hover:bg-stone-800 text-xs font-semibold px-5 py-2.5 text-amber-100 transition cursor-pointer"
              >
                {lang === "en" ? "Return to News List" : "തിരികെ പോവുക"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
export default NewsSection;
