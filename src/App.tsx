import React, { useState, useEffect } from "react";
import { Language, Service, NewsItem, Review, BankRate } from "./types";
import { dbStore } from "./dbStore";
import { TRANSLATIONS } from "./data";
import { HomeSection } from "./components/HomeSection";
import { ServicesSection } from "./components/ServicesSection";
import { NewsSection } from "./components/NewsSection";
import { ContactSection } from "./components/ContactSection";
import { AdminPanel } from "./components/AdminPanel";
import { auth } from "./firebase";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Languages,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Lock,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Building,
  ArrowRightLeft
} from "lucide-react";

export default function App() {
  // 1. Core State Handlers
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("praveen_lang");
    return (saved === "en" || saved === "ml" ? saved : "en") as Language;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
    const hash = window.location.hash.toLowerCase();
    if (path.endsWith("/admin") || hash === "#/admin" || hash === "#admin") {
      return "admin";
    }
    if (path.endsWith("/services") || hash === "#/services" || hash === "#services") {
      return "services";
    }
    if (path.endsWith("/news") || hash === "#/news" || hash === "#news") {
      return "news";
    }
    if (path.endsWith("/contact") || hash === "#/contact" || hash === "#contact") {
      return "contact";
    }
    return "home";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // HTML5 History & URL change triggers
  const changeTab = (tab: string) => {
    setActiveTab(tab);
    const targetPath = tab === "home" ? "/" : `/${tab}`;
    window.history.pushState({}, "", targetPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      const hash = window.location.hash.toLowerCase();
      if (path.endsWith("/admin") || hash === "#/admin" || hash === "#admin") {
        setActiveTab("admin");
      } else if (path.endsWith("/services") || hash === "#/services" || hash === "#services") {
        setActiveTab("services");
      } else if (path.endsWith("/news") || hash === "#/news" || hash === "#news") {
        setActiveTab("news");
      } else if (path.endsWith("/contact") || hash === "#/contact" || hash === "#contact") {
        setActiveTab("contact");
      } else {
        setActiveTab("home");
      }
    };

    window.addEventListener("popstate", handleLocation);
    window.addEventListener("hashchange", handleLocation);
    return () => {
      window.removeEventListener("popstate", handleLocation);
      window.removeEventListener("hashchange", handleLocation);
    };
  }, []);

  // Dynamic database states synced from firestore/localStorage
  const [services, setServices] = useState<Service[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bankRates, setBankRates] = useState<BankRate[]>([]);
  const [loading, setLoading] = useState(true);

  // Secure passcode session state
  const [isAdminActive, setIsAdminActive] = useState<boolean>(() => {
    return sessionStorage.getItem("praveen_admin_active") === "true";
  });

  // Global Auth Observer
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user && user.email === "licpravi@gmail.com") {
        handleSetAdminActive(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Track dynamic data reads
  const loadDatabaseState = async () => {
    try {
      setLoading(true);
      const [svcs, nws, revs, rates] = await Promise.all([
        dbStore.getServices(),
        dbStore.getNews(),
        dbStore.getReviews(),
        dbStore.getBankRates(),
      ]);
      setServices(svcs);
      setNews(nws);
      setReviews(revs);
      setBankRates(rates);
    } catch (err) {
      console.error("Failed to sync database state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseState();
  }, [isAdminActive]);

  // Language persistent switch
  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "ml" : "en";
    setLang(nextLang);
    localStorage.setItem("praveen_lang", nextLang);
  };

  // State modifiers passdown functions
  const handleAddService = async (service: Omit<Service, "id">) => {
    await dbStore.addService(service);
    await loadDatabaseState();
  };

  const handleUpdateService = async (service: Service) => {
    await dbStore.updateService(service);
    await loadDatabaseState();
  };

  const handleDeleteService = async (id: string) => {
    await dbStore.deleteService(id);
    await loadDatabaseState();
  };

  const handleAddNews = async (newsItem: Omit<NewsItem, "id">) => {
    await dbStore.addNews(newsItem);
    await loadDatabaseState();
  };

  const handleUpdateNews = async (newsItem: NewsItem) => {
    await dbStore.updateNews(newsItem);
    await loadDatabaseState();
  };

  const handleDeleteNews = async (id: string) => {
    await dbStore.deleteNews(id);
    await loadDatabaseState();
  };

  const handleAddBankRate = async (rate: Omit<BankRate, "id">) => {
    await dbStore.addBankRate(rate);
    await loadDatabaseState();
  };

  const handleUpdateBankRate = async (rate: BankRate) => {
    await dbStore.updateBankRate(rate);
    await loadDatabaseState();
  };

  const handleDeleteBankRate = async (id: string) => {
    await dbStore.deleteBankRate(id);
    await loadDatabaseState();
  };

  const handleSubmitReview = async (review: Omit<Review, "id" | "date" | "approved">) => {
    await dbStore.addReview(review);
    await loadDatabaseState();
  };

  const handleApproveReview = async (id: string) => {
    await dbStore.approveReview(id);
    await loadDatabaseState();
  };

  const handleUpdateReview = async (review: Review) => {
    await dbStore.updateReview(review);
    await loadDatabaseState();
  };

  const handleDeleteReview = async (id: string) => {
    await dbStore.deleteReview(id);
    await loadDatabaseState();
  };

  const handleAddEnquiry = async (enquiry: {
    name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    await dbStore.addEnquiry(enquiry);
  };

  // Lock status updater
  const handleSetAdminActive = (active: boolean) => {
    setIsAdminActive(active);
    sessionStorage.setItem("praveen_admin_active", active ? "true" : "false");
  };

  const t = TRANSLATIONS[lang];

  return (
    <div id="praveen-expert-consultancy" className="min-h-screen bg-stone-50 font-sans text-stone-800 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900 leading-normal antialiased">
      
      {/* Top Professional Trust Bar Banner */}
      <div className="bg-stone-950 text-amber-100/90 py-2 px-4 text-xs border-b border-amber-500/20">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-2 font-mono">
          <div className="flex items-center gap-1.5 tracking-wider">
            <span className="inline-block h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>{lang === "en" ? "LIC HFL Verified Corporate Advisor" : "എൽ.ഐ.സി ഭവന വായ്പ ഓതറൈസ്ഡ് കൺസൾട്ടന്റ്"}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a href="tel:+919847914198" className="hover:text-amber-400 transition flex items-center gap-1">
              <Phone className="h-3 w-3 text-amber-500" />
              <span>+91 98479 14198</span>
            </a>
            <a href="mailto:licpravi@gmail.com" className="hover:text-amber-400 transition flex items-center gap-1">
              <Mail className="h-3 w-3 text-amber-500" />
              <span>licpravi@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Luxury Header Navigation */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-stone-200/60 z-40 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
                    <div
              id="header-brand-logo"
              className="flex flex-col items-start cursor-pointer group select-none"
              onClick={() => changeTab("home")}
            >
              <span className="font-serif text-base sm:text-lg md:text-2xl font-bold tracking-normal sm:tracking-widest text-stone-900 group-hover:text-amber-800 transition duration-300 leading-tight whitespace-nowrap">
                Praveen Kumar P
              </span>
              <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-amber-700 font-bold block leading-none mt-1 whitespace-nowrap">
                {lang === "en" ? "Financial Advisory & Housing Loans" : "ഭവന വായ്പ ഉപദേശകൻ"}
              </span>
            </div>

            {/* Desktop Navigation Links (Lock option removed) */}
            <nav className="hidden md:flex items-center gap-1.5">
              {[
                { key: "home", label: t.navHome },
                { key: "services", label: t.navServices },
                { key: "news", label: t.navNews },
                { key: "contact", label: t.navContact },
              ].map((tab) => (
                <button
                  id={`nav-link-${tab.key}`}
                  key={tab.key}
                  onClick={() => changeTab(tab.key)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-lg cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-stone-900 text-amber-100 shadow-md shadow-stone-900/10"
                      : "text-stone-600 hover:text-stone-950 hover:bg-stone-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Utility Lang Switch and Mobile menu burger */}
            <div className="flex items-center gap-3">
              {/* Language Switch Ribbon Toggle */}
              <button
                id="language-badge-toggle"
                onClick={toggleLanguage}
                className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50/70 hover:bg-amber-100/85 px-3 py-1.5 text-xs font-semibold text-amber-900 transition duration-300 cursor-pointer select-none"
              >
                <Languages className="h-4 w-4 text-amber-700" />
                <span className="font-sans leading-none">{lang === "en" ? "മലയാളം" : "English"}</span>
              </button>

              {/* Mobile Burger Trigger */}
              <button
                id="mobile-burger-trigger"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 md:hidden transition cursor-pointer"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Collapsed Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="p-4 border-b border-stone-200 bg-white md:hidden animate-slideDown">
            <div className="flex flex-col gap-2">
              {[
                { key: "home", label: t.navHome },
                { key: "services", label: t.navServices },
                { key: "news", label: t.navNews },
                { key: "contact", label: t.navContact },
              ].map((tab) => (
                <button
                  id={`mobile-nav-link-${tab.key}`}
                  key={tab.key}
                  onClick={() => changeTab(tab.key)}
                  className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                    activeTab === tab.key
                      ? "bg-stone-800 text-amber-100"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Page Layout Core (Animated tab transitions) */}
      <main className="flex-1">
        {loading ? (
          <div className="mx-auto max-w-7xl px-4 py-32 flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs text-stone-400">Synchronizing database nodes...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="py-8"
            >
              {activeTab === "home" && (
                <HomeSection
                  lang={lang}
                  reviews={reviews}
                  bankRates={bankRates}
                  onSubmitReview={handleSubmitReview}
                  onNavigate={(tab) => changeTab(tab)}
                />
              )}
              {activeTab === "services" && (
                <ServicesSection
                  lang={lang}
                  services={services}
                  isAdminActive={isAdminActive}
                  onAddService={handleAddService}
                  onUpdateService={handleUpdateService}
                  onDeleteService={handleDeleteService}
                />
              )}
              {activeTab === "news" && (
                <NewsSection
                  lang={lang}
                  news={news}
                  isAdminActive={isAdminActive}
                  onAddNews={handleAddNews}
                  onUpdateNews={handleUpdateNews}
                  onDeleteNews={handleDeleteNews}
                />
              )}
              {activeTab === "contact" && (
                <ContactSection lang={lang} onAddEnquiry={handleAddEnquiry} />
              )}
              {activeTab === "admin" && (
                <AdminPanel
                  lang={lang}
                  reviews={reviews}
                  services={services}
                  news={news}
                  bankRates={bankRates}
                  isAdminActive={isAdminActive}
                  onSetAdminActive={handleSetAdminActive}
                  onApproveReview={handleApproveReview}
                  onUpdateReview={handleUpdateReview}
                  onDeleteReview={handleDeleteReview}
                  onAddService={handleAddService}
                  onUpdateService={handleUpdateService}
                  onDeleteService={handleDeleteService}
                  onAddNews={handleAddNews}
                  onUpdateNews={handleUpdateNews}
                  onDeleteNews={handleDeleteNews}
                  onAddBankRate={handleAddBankRate}
                  onUpdateBankRate={handleUpdateBankRate}
                  onDeleteBankRate={handleDeleteBankRate}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Aesthetic High-Contrast Footer Area */}
      <footer className="bg-stone-900 border-t border-amber-500/10 py-12 text-stone-400 text-xs mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Trademark details */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif text-lg font-bold text-amber-100 tracking-wider">Praveen Kumar P</h4>
            <p className="font-sans leading-relaxed text-stone-400 font-light max-w-sm">
              {lang === "en" 
                ? "Dedicated mortgage counseling that converts complex approvals into simplified housing pathways. Authorised associated consultant in Kerala." 
                : "സങ്കീർണ്ണമായ നിയമപ്രശ്നങ്ങളുള്ള വായ്പകളും അതിവേഗത്തിൽ പരിഹരിച്ചു ലളിതമായ ഭവന വായ്പകളാക്കി മാറ്റുന്നു. പാലക്കാട് ജില്ലയിലെ പ്രമുഖ ഫിനാൻഷ്യൽ ഉപദേശകൻ."}
            </p>
            <div className="flex gap-2">
              <span className="inline-block bg-stone-800 text-amber-300 font-mono text-[10px] uppercase font-bold px-3 py-1.5 rounded border border-stone-700 tracking-wider">
                {lang === "en" ? "25 Years Professional Service" : "25 വർഷത്തെ സേവന പാരമ്പര്യം"}
              </span>
            </div>
          </div>

          {/* Quick linkages */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="font-serif text-xs uppercase tracking-widest text-amber-300 font-bold">
              {lang === "en" ? "Consulting Portals" : "പെട്ടെന്ന് കാണുവാൻ"}
            </h5>
            <div className="flex flex-col gap-2.5">
              {[
                { key: "home", label: t.navHome },
                { key: "services", label: t.navServices },
                { key: "news", label: t.navNews },
                { key: "contact", label: t.navContact },
              ].map((lnk) => (
                <button
                  key={lnk.key}
                  onClick={() => changeTab(lnk.key)}
                  className="text-left text-xs text-stone-400 hover:text-amber-300 transition duration-150 cursor-pointer"
                >
                  {lnk.label}
                </button>
              ))}

            </div>
          </div>

          {/* Office and legal addresses */}
          <div className="md:col-span-5 space-y-4">
            <h5 className="font-serif text-xs uppercase tracking-widest text-amber-300 font-bold">
              {lang === "en" ? "Principal Offices" : "വിലാസങ്ങൾ"}
            </h5>
            <div className="space-y-3.5 leading-relaxed text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="font-light">
                  <strong>Office:</strong> LIC Housing Finance Ltd, Bus Stand, II Floor, Mannil Arcade, Opp. LIC of India, Branch I, Near KSRTC, Shornur Rd, Palakkad, Kerala 678014
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="font-light">
                  <strong>Home Address:</strong> Vayankara Puthanveedu, XG33+3GH, Mankurussi Temple Rd, Thachampara, Palakkad, Kerala 678595
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Outer Copy & License disclaimer */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-stone-800 pt-8 mt-8 text-center text-[10px] text-stone-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Praveen Kumar P - LIC Housing Finance & Financial Advisory Services. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono">
            <span>Subject to standard bank loan clearing protocols & KYC assessments.</span>
            <button
              onClick={() => changeTab("admin")}
              className="text-stone-600 hover:text-amber-400 font-mono transition opacity-50 hover:opacity-100 cursor-pointer"
            >
              {isAdminActive ? "• Admin Session Connected" : "Administrative Login"}
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
