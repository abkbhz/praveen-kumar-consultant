import React, { useState, useEffect } from "react";
import { Language, Review, ContactEnquiry, Service, NewsItem, BankRate } from "../types";
import { TRANSLATIONS } from "../data";
import { dbStore } from "../dbStore";
import { auth, isFirebaseEnabled } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { DynamicIcon } from "./DynamicIcon";
import {
  Lock,
  Unlock,
  ShieldAlert,
  Sliders,
  Trash2,
  Check,
  User,
  Phone,
  Mail,
  Calendar,
  Layers,
  FileText,
  Star,
  Eye,
  Inbox,
  AlertCircle,
  LogIn,
  ShieldCheck,
  Plus,
  Sparkles,
  Clock,
  BookOpen,
  Edit2,
  X
} from "lucide-react";

interface AdminPanelProps {
  lang: Language;
  reviews: Review[];
  services: Service[];
  news: NewsItem[];
  bankRates: BankRate[];
  isAdminActive: boolean;
  onSetAdminActive: (active: boolean) => void;
  onApproveReview: (id: string) => Promise<void>;
  onUpdateReview?: (review: Review) => Promise<void>;
  onDeleteReview: (id: string) => Promise<void>;
  onAddService: (service: Omit<Service, "id">) => Promise<void>;
  onUpdateService?: (service: Service) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
  onAddNews: (newsItem: Omit<NewsItem, "id">) => Promise<void>;
  onUpdateNews?: (newsItem: NewsItem) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
  onAddBankRate: (rate: Omit<BankRate, "id">) => Promise<void>;
  onUpdateBankRate: (rate: BankRate) => Promise<void>;
  onDeleteBankRate: (id: string) => Promise<void>;
}

export function AdminPanel({
  lang,
  reviews,
  services,
  news,
  bankRates,
  isAdminActive,
  onSetAdminActive,
  onApproveReview,
  onUpdateReview,
  onDeleteReview,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddNews,
  onUpdateNews,
  onDeleteNews,
  onAddBankRate,
  onUpdateBankRate,
  onDeleteBankRate,
}: AdminPanelProps) {
  const t = TRANSLATIONS[lang];

  // Email & Password entry states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"enquiries" | "reviews" | "services" | "news" | "bankrates">("enquiries");

  const [googleLoading, setGoogleLoading] = useState(false);

  // Bank Rates adding / editing states
  const [rateBankNameEn, setRateBankNameEn] = useState("");
  const [rateBankNameMl, setRateBankNameMl] = useState("");
  const [rateInterest, setRateInterest] = useState("");
  const [rateMaxTenureEn, setRateMaxTenureEn] = useState("30 Years");
  const [rateMaxTenureMl, setRateMaxTenureMl] = useState("30 വർഷം");
  const [rateProcessingEn, setRateProcessingEn] = useState("0.5% of loan value");
  const [rateProcessingMl, setRateProcessingMl] = useState("ലോൺ തുകയുടെ 0.5%");
  const [isRateSubmitting, setIsRateSubmitting] = useState(false);

  // Editing state for bank rates
  const [editingRate, setEditingRate] = useState<BankRate | null>(null);
  const [editRateBankNameEn, setEditRateBankNameEn] = useState("");
  const [editRateBankNameMl, setEditRateBankNameMl] = useState("");
  const [editRateInterest, setEditRateInterest] = useState("");
  const [editRateMaxTenureEn, setEditRateMaxTenureEn] = useState("");
  const [editRateMaxTenureMl, setEditRateMaxTenureMl] = useState("");
  const [editRateProcessingEn, setEditRateProcessingEn] = useState("");
  const [editRateProcessingMl, setEditRateProcessingMl] = useState("");

  const startEditRate = (rate: BankRate) => {
    setEditingRate(rate);
    setEditRateBankNameEn(rate.bankNameEn);
    setEditRateBankNameMl(rate.bankNameMl);
    setEditRateInterest(rate.interestRate);
    setEditRateMaxTenureEn(rate.maxTenureEn);
    setEditRateMaxTenureMl(rate.maxTenureMl);
    setEditRateProcessingEn(rate.processingFeeEn);
    setEditRateProcessingMl(rate.processingFeeMl);
  };

  // Portfolios adding states
  const [svcTitleEn, setSvcTitleEn] = useState("");
  const [svcTitleMl, setSvcTitleMl] = useState("");
  const [svcDescEn, setSvcDescEn] = useState("");
  const [svcDescMl, setSvcDescMl] = useState("");
  const [svcDetailEn, setSvcDetailEn] = useState("");
  const [svcDetailMl, setSvcDetailMl] = useState("");
  const [svcIcon, setSvcIcon] = useState("Home");
  const [isSvcSubmitting, setIsSvcSubmitting] = useState(false);

  const POPULAR_ICONS = ["Home", "Briefcase", "Building", "ShieldCheck", "Coins", "Percent", "TrendingUp", "Scale"];

  // News adding states
  const [newsTitleEn, setNewsTitleEn] = useState("");
  const [newsTitleMl, setNewsTitleMl] = useState("");
  const [newsContentEn, setNewsContentEn] = useState("");
  const [newsContentMl, setNewsContentMl] = useState("");
  const [newsCategoryEnCustom, setNewsCategoryEnCustom] = useState("");
  const [newsCategoryMlCustom, setNewsCategoryMlCustom] = useState("");
  const [isNewsSubmitting, setIsNewsSubmitting] = useState(false);

  // Editing state for Services
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editSvcTitleEn, setEditSvcTitleEn] = useState("");
  const [editSvcTitleMl, setEditSvcTitleMl] = useState("");
  const [editSvcDescEn, setEditSvcDescEn] = useState("");
  const [editSvcDescMl, setEditSvcDescMl] = useState("");
  const [editSvcDetailEn, setEditSvcDetailEn] = useState("");
  const [editSvcDetailMl, setEditSvcDetailMl] = useState("");
  const [editSvcIcon, setEditSvcIcon] = useState("");
  const [isSvcUpdating, setIsSvcUpdating] = useState(false);

  const startEditService = (svc: Service) => {
    setEditingService(svc);
    setEditSvcTitleEn(svc.titleEn);
    setEditSvcTitleMl(svc.titleMl);
    setEditSvcDescEn(svc.descEn);
    setEditSvcDescMl(svc.descMl);
    setEditSvcDetailEn(svc.detailEn || svc.descEn);
    setEditSvcDetailMl(svc.detailMl || svc.descMl);
    setEditSvcIcon(svc.icon);
  };

  // Editing state for News
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [editNewsTitleEn, setEditNewsTitleEn] = useState("");
  const [editNewsTitleMl, setEditNewsTitleMl] = useState("");
  const [editNewsContentEn, setEditNewsContentEn] = useState("");
  const [editNewsContentMl, setEditNewsContentMl] = useState("");
  const [editNewsCategoryEn, setEditNewsCategoryEn] = useState("");
  const [editNewsCategoryMl, setEditNewsCategoryMl] = useState("");
  const [isNewsUpdating, setIsNewsUpdating] = useState(false);

  const startEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setEditNewsTitleEn(item.titleEn);
    setEditNewsTitleMl(item.titleMl);
    setEditNewsContentEn(item.contentEn);
    setEditNewsContentMl(item.contentMl);
    setEditNewsCategoryEn(item.categoryEn);
    setEditNewsCategoryMl(item.categoryMl);
  };

  // Editing state for Reviews
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editReviewName, setEditReviewName] = useState("");
  const [editReviewDesigEn, setEditReviewDesigEn] = useState("");
  const [editReviewDesigMl, setEditReviewDesigMl] = useState("");
  const [editReviewFeedbackEn, setEditReviewFeedbackEn] = useState("");
  const [editReviewFeedbackMl, setEditReviewFeedbackMl] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(5);
  const [isReviewUpdating, setIsReviewUpdating] = useState(false);

  const startEditReview = (review: Review) => {
    setEditingReview(review);
    setEditReviewName(review.name);
    setEditReviewDesigEn(review.designationEn);
    setEditReviewDesigMl(review.designationMl);
    setEditReviewFeedbackEn(review.feedbackEn);
    setEditReviewFeedbackMl(review.feedbackMl);
    setEditReviewRating(review.rating);
  };

  const handleReviewUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview || !editReviewName || !editReviewFeedbackEn || !editReviewFeedbackMl) return;
    setIsReviewUpdating(true);
    try {
      if (onUpdateReview) {
        await onUpdateReview({
          ...editingReview,
          name: editReviewName,
          designationEn: editReviewDesigEn,
          designationMl: editReviewDesigMl,
          feedbackEn: editReviewFeedbackEn,
          feedbackMl: editReviewFeedbackMl,
          rating: editReviewRating,
        });
      }
      setEditingReview(null);
    } catch (err) {
      console.error("Failed to update review:", err);
    } finally {
      setIsReviewUpdating(false);
    }
  };


  // Fetch enquiries if Admin is authorized
  const loadEnquiries = async () => {
    setLoadingEnquiries(true);
    try {
      const data = await dbStore.getEnquiries();
      setEnquiries(data.sort((a, b) => b.date.localeCompare(a.date)));
    } catch (err) {
      console.error("Failed to load enquiries:", err);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  useEffect(() => {
    if (isAdminActive) {
      loadEnquiries();
    }
  }, [isAdminActive]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Passcode fallback if they only type passcode (for offline demo mode)
    if (!email && (password === "2026" || password === "husky@123")) {
      onSetAdminActive(true);
      setErrorMsg("");
      setPassword("");
      return;
    }

    if (!auth) {
      setErrorMsg("Firebase is disabled or not set up.");
      return;
    }

    setErrorMsg("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user?.email === "licpravi@gmail.com") {
        onSetAdminActive(true);
        setEmail("");
        setPassword("");
      } else {
        setErrorMsg("Unauthorized account.");
        await signOut(auth);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Failed to sign in. Please verify your credentials.");
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setErrorMsg("Firebase is disabled or not set up.");
      return;
    }
    setGoogleLoading(true);
    setErrorMsg("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user?.email === "licpravi@gmail.com") {
        onSetAdminActive(true);
      } else {
        setErrorMsg("Unauthorized account. Only 'licpravi@gmail.com' is authorized as administrator.");
        await signOut(auth);
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err?.message || "Failed to sign in with Google.";
      if (
        err?.code === "auth/unauthorized-domain" ||
        errMsg.includes("unauthorized-domain") ||
        errMsg.includes("auth/unauthorized-domain")
      ) {
        errMsg = "Google Sign-In failed: The current domain is not authorized in your Firebase Project. Please add this domain to the 'Authorized domains' list in the Firebase Console (under Authentication > Settings > Authorized domains).";
      }
      setErrorMsg(errMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogout = async () => {
    if (auth && auth.currentUser) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error(err);
      }
    }
    onSetAdminActive(false);
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (confirm("Are you sure you want to dismiss this enquiry?")) {
      try {
        await dbStore.deleteEnquiry(id);
        setEnquiries(enquiries.filter((e) => e.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rateBankNameEn || !rateBankNameMl || !rateInterest) return;
    setIsRateSubmitting(true);
    try {
      await onAddBankRate({
        bankNameEn: rateBankNameEn,
        bankNameMl: rateBankNameMl,
        interestRate: rateInterest,
        maxTenureEn: rateMaxTenureEn || "30 Years",
        maxTenureMl: rateMaxTenureMl || "30 വർഷം",
        processingFeeEn: rateProcessingEn || "0.5% of loan value",
        processingFeeMl: rateProcessingMl || "ലോൺ തുകയുടെ 0.5%",
        updatedAt: new Date().toISOString().split("T")[0],
      });
      // reset
      setRateBankNameEn("");
      setRateBankNameMl("");
      setRateInterest("");
      setRateMaxTenureEn("30 Years");
      setRateMaxTenureMl("30 വർഷം");
      setRateProcessingEn("0.5% of loan value");
      setRateProcessingMl("ലോൺ തുകയുടെ 0.5%");
    } catch (err) {
      console.error("Failed to add bank rate:", err);
    } finally {
      setIsRateSubmitting(false);
    }
  };

  const handleRateUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRate || !editRateBankNameEn || !editRateBankNameMl || !editRateInterest) return;
    try {
      await onUpdateBankRate({
        id: editingRate.id,
        bankNameEn: editRateBankNameEn,
        bankNameMl: editRateBankNameMl,
        interestRate: editRateInterest,
        maxTenureEn: editRateMaxTenureEn,
        maxTenureMl: editRateMaxTenureMl,
        processingFeeEn: editRateProcessingEn,
        processingFeeMl: editRateProcessingMl,
        updatedAt: new Date().toISOString().split("T")[0],
      });
      setEditingRate(null);
    } catch (err) {
      console.error("Failed to update bank rate:", err);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!svcTitleEn || !svcTitleMl || !svcDescEn || !svcDescMl) return;
    setIsSvcSubmitting(true);
    try {
      await onAddService({
        titleEn: svcTitleEn,
        titleMl: svcTitleMl,
        descEn: svcDescEn,
        descMl: svcDescMl,
        detailEn: svcDetailEn || svcDescEn,
        detailMl: svcDetailMl || svcDescMl,
        icon: svcIcon,
      });
      // reset
      setSvcTitleEn("");
      setSvcTitleMl("");
      setSvcDescEn("");
      setSvcDescMl("");
      setSvcDetailEn("");
      setSvcDetailMl("");
      setSvcIcon("Home");
    } catch (err) {
      console.error("Failed to add service:", err);
    } finally {
      setIsSvcSubmitting(false);
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitleEn || !newsTitleMl || !newsContentEn || !newsContentMl) return;
    setIsNewsSubmitting(true);
    try {
      await onAddNews({
        titleEn: newsTitleEn,
        titleMl: newsTitleMl,
        contentEn: newsContentEn,
        contentMl: newsContentMl,
        categoryEn: newsCategoryEnCustom || "Advice",
        categoryMl: newsCategoryMlCustom || "ഉപദേശം",
        date: new Date().toISOString().split("T")[0],
        authorEn: "Praveen Kumar P",
        authorMl: "പ്രവീൺ കുമാർ പി",
        image: "https://picsum.photos/seed/" + Math.floor(Math.random() * 1000) + "/800/600",
      });
      // reset
      setNewsTitleEn("");
      setNewsTitleMl("");
      setNewsContentEn("");
      setNewsContentMl("");
      setNewsCategoryEnCustom("");
      setNewsCategoryMlCustom("");
    } catch (err) {
      console.error("Failed to add article:", err);
    } finally {
      setIsNewsSubmitting(false);
    }
  };

  const handleServiceUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editSvcTitleEn || !editSvcTitleMl || !editSvcDescEn || !editSvcDescMl) return;
    setIsSvcUpdating(true);
    try {
      if (onUpdateService) {
        await onUpdateService({
          id: editingService.id,
          titleEn: editSvcTitleEn,
          titleMl: editSvcTitleMl,
          descEn: editSvcDescEn,
          descMl: editSvcDescMl,
          detailEn: editSvcDetailEn || editSvcDescEn,
          detailMl: editSvcDetailMl || editSvcDescMl,
          icon: editSvcIcon,
        });
      }
      setEditingService(null);
    } catch (err) {
      console.error("Failed to update service:", err);
    } finally {
      setIsSvcUpdating(false);
    }
  };

  const handleNewsUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews || !editNewsTitleEn || !editNewsTitleMl || !editNewsContentEn || !editNewsContentMl) return;
    setIsNewsUpdating(true);
    try {
      if (onUpdateNews) {
        await onUpdateNews({
          ...editingNews,
          titleEn: editNewsTitleEn,
          titleMl: editNewsTitleMl,
          contentEn: editNewsContentEn,
          contentMl: editNewsContentMl,
          categoryEn: editNewsCategoryEn,
          categoryMl: editNewsCategoryMl,
        });
      }
      setEditingNews(null);
    } catch (err) {
      console.error("Failed to update article:", err);
    } finally {
      setIsNewsUpdating(false);
    }
  };

  const pendingReviews = reviews.filter((r) => !r.approved);
  const liveReviews = reviews.filter((r) => r.approved);

  return (
    <div id="admin-panel-container" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 pb-16">

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/50 px-3.5 py-1 rounded-full">
          {lang === "en" ? "SECURITY ACCESS" : "നിയന്ത്രണങ്ങൾ"}
        </span>
        <h2 className="font-serif text-3xl sm:text-4.5xl font-bold text-stone-900 leading-tight block">
          {t.adminTitle}
        </h2>
        {isAdminActive && (
          <p className="text-amber-800 text-xs sm:text-sm font-semibold max-w-lg mx-auto bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
            {t.adminSubtitle}
          </p>
        )}
      </div>

      {/* Unauthenticated Login Screen */}
      {!isAdminActive ? (
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />

          <div className="text-center space-y-2 mb-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-50/50 text-amber-800 border border-amber-200/50 flex items-center justify-center">
              <Lock className="h-6 w-6 stroke-[1.75]" />
            </div>
            <p className="text-stone-500 text-xs sm:text-sm font-light px-2 leading-relaxed">
              {t.loginDesc}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Administrator Email
                </label>
                <input
                  id="admin-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm focus:border-amber-500 focus:bg-white focus:outline-none"
                  placeholder="e.g. licpravi@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password / Passcode *
                </label>
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm focus:border-amber-500 focus:bg-white focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              id="admin-login-submit"
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-sm font-semibold text-amber-100 py-3 transition shadow-md cursor-pointer mb-2"
            >
              <Unlock className="h-4 w-4 text-amber-400" />
              {t.loginBtn}
            </button>
          </form>

          {isFirebaseEnabled && (
            <div className="mt-6 pt-6 border-t border-stone-100 space-y-4">
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-stone-200"></div>
                <span className="flex-shrink mx-4 text-stone-400 text-xs font-mono uppercase tracking-wider">or</span>
                <div className="flex-grow border-t border-stone-200"></div>
              </div>

              <button
                id="admin-google-login-btn"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-sm font-semibold text-stone-700 py-3 transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                <LogIn className="h-4 w-4 text-amber-700" />
                {googleLoading ? "Signing In with Google..." : "Continue with Google Account"}
              </button>

              <p className="text-[11px] text-stone-400 text-center font-mono">
                Authorized identity: abhinavkrishna3071@gmail.com
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Authenticated Control Center Layout */
        <div className="space-y-8 animate-fadeIn">

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-white border border-stone-200 p-5 rounded-xl text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif block">{services.length}</span>
              <span className="text-xs text-stone-500 tracking-wide uppercase font-medium">{lang === "en" ? "Portfolios" : "സേവനങ്ങൾ"}</span>
            </div>

            <div className="bg-white border border-stone-200 p-5 rounded-xl text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif block">{news.length}</span>
              <span className="text-xs text-stone-500 tracking-wide uppercase font-medium">{lang === "en" ? "Articles" : "ലേഖനങ്ങൾ"}</span>
            </div>

            <div className="bg-white border border-stone-200 p-5 rounded-xl text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif block">{pendingReviews.length}</span>
              <span className="text-xs text-stone-500 tracking-wide uppercase font-medium">{lang === "en" ? "Pending Reviews" : "പുതിയ റിവ്യൂകൾ"}</span>
            </div>

            <div className="bg-white border border-stone-200 p-5 rounded-xl text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif block">{enquiries.length}</span>
              <span className="text-xs text-stone-500 tracking-wide uppercase font-medium">{lang === "en" ? "Enquiries" : "രജിസ്റ്റർ ചെയ്തവ"}</span>
            </div>

          </div>

          {/* Action Tabs selector */}
          <div className="flex border-b border-stone-200 overflow-x-auto scrollbar-thin">
            <button
              id="admin-tab-enquiries"
              onClick={() => setActiveSubTab("enquiries")}
              className={`pb-3 px-6 text-sm font-bold tracking-wide border-b-2 transition whitespace-nowrap ${activeSubTab === "enquiries"
                ? "border-amber-600 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
            >
              Client Enquiries ({enquiries.length})
            </button>
            <button
              id="admin-tab-reviews"
              onClick={() => setActiveSubTab("reviews")}
              className={`pb-3 px-6 text-sm font-bold tracking-wide border-b-2 transition whitespace-nowrap ${activeSubTab === "reviews"
                ? "border-amber-600 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
            >
              Feedback Moderation ({pendingReviews.length} Pending)
            </button>
            <button
              id="admin-tab-services"
              onClick={() => setActiveSubTab("services")}
              className={`pb-3 px-6 text-sm font-bold tracking-wide border-b-2 transition whitespace-nowrap ${activeSubTab === "services"
                ? "border-amber-600 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
            >
              Manage Portfolios ({services.length})
            </button>
            <button
              id="admin-tab-news"
              onClick={() => setActiveSubTab("news")}
              className={`pb-3 px-6 text-sm font-bold tracking-wide border-b-2 transition whitespace-nowrap ${activeSubTab === "news"
                ? "border-amber-600 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
            >
              Advisory & Insights ({news.length})
            </button>
            <button
              id="admin-tab-bankrates"
              onClick={() => setActiveSubTab("bankrates")}
              className={`pb-3 px-6 text-sm font-bold tracking-wide border-b-2 transition whitespace-nowrap ${activeSubTab === "bankrates"
                ? "border-amber-600 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
            >
              Bank Interest Rates ({bankRates ? bankRates.length : 0})
            </button>
          </div>

          {/* Enquiries tab folder */}
          {activeSubTab === "enquiries" && (
            <div className="space-y-6">
              <h3 className="font-serif text-lg font-bold text-stone-900">Registered Client Consultation Folder</h3>

              {loadingEnquiries ? (
                <p className="text-xs font-mono text-stone-400">Loading enquiries...</p>
              ) : enquiries.length === 0 ? (
                <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 text-center space-y-2">
                  <Inbox className="mx-auto h-8 w-8 text-stone-400 stroke-[1.5]" />
                  <p className="text-stone-600 text-sm font-medium">No customer inquiries submitted yet.</p>
                  <p className="text-stone-400 text-xs">When customers submit the inquiry contact form, entries will display here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4 relative"
                    >
                      <button
                        id={`dismiss-enq-${enq.id}`}
                        onClick={() => handleDeleteEnquiry(enq.id)}
                        className="absolute top-4 right-4 p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-50 transition"
                        title="Dismiss Enquiry"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>

                      <div className="space-y-1">
                        <span className="text-[10px] text-amber-700 font-mono italic block">{new Date(enq.date).toLocaleString()}</span>
                        <h4 className="font-serif text-base font-bold text-stone-900">{enq.name}</h4>
                        <p className="text-xs font-semibold text-stone-600 bg-stone-50 inline-block px-2.5 py-1 rounded border border-stone-100">
                          Subject: {enq.subject}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3 flex flex-wrap gap-x-6 gap-y-1">
                        <a href={`tel:${enq.phone}`} className="flex items-center gap-1.5 hover:text-amber-800">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{enq.phone}</span>
                        </a>
                        <a href={`mailto:${enq.email}`} className="flex items-center gap-1.5 hover:text-amber-800">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{enq.email}</span>
                        </a>
                      </div>

                      <p className="text-stone-600 font-light text-xs bg-stone-50/50 p-4 border border-stone-100 rounded-lg leading-relaxed">
                        {enq.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Feedback Moderation folder */}
          {activeSubTab === "reviews" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-stone-900">Reviews & Ratings Management</h3>
                <p className="text-xs text-stone-500">Approve pending reviews submitted by consumers to live list them on the home page Rating grid.</p>
              </div>

              {pendingReviews.length === 0 ? (
                <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 text-center space-y-2">
                  <Star className="mx-auto h-8 w-8 text-stone-300 stroke-[1.5]" />
                  <p className="text-stone-600 text-sm font-medium">No pending feedback verification files.</p>
                  <p className="text-stone-400 text-xs">Newly submitted client ratings will wait here for admin authorization.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-sans text-xs uppercase tracking-wider text-amber-800 font-bold bg-amber-50 rounded px-2.5 py-1 inline-block">
                    Verification Required ({pendingReviews.length} items)
                  </h4>

                  {pendingReviews.map((item) => (
                    <div
                      key={item.id}
                      className="bg-stone-50 border-l-4 border-amber-500 rounded-r-xl p-5 flex flex-col sm:flex-row justify-between sm:items-start gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex gap-1 text-amber-500">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <Star key={i} fill="currentColor" className="h-3.5 w-3.5" />
                          ))}
                        </div>
                        <p className="text-stone-850 italic text-sm font-light">"{item.feedbackEn}"</p>
                        <div className="flex gap-4 text-xs font-mono text-stone-500">
                          <span className="font-bold text-stone-850">{item.name}</span>
                          <span>{item.designationEn}</span>
                          <span>{item.date}</span>
                        </div>
                      </div>

                      {/* Approval triggers */}
                      <div className="flex gap-2 shrink-0">
                        <button
                          id={`edit-rev-pending-${item.id}`}
                          onClick={() => startEditReview(item)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 border border-stone-200 text-stone-700 bg-white rounded-lg hover:bg-stone-50 transition cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          id={`approve-rev-${item.id}`}
                          onClick={() => onApproveReview(item.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 bg-stone-900 text-amber-100 rounded-lg hover:bg-stone-800 transition shadow cursor-pointer animate-pulse"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          id={`reject-rev-${item.id}`}
                          onClick={() => onDeleteReview(item.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 border border-stone-200 text-red-600 bg-white rounded-lg hover:bg-red-50 transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Verified active feedback files */}
              <div className="space-y-4 pt-6">
                <h4 className="font-serif text-sm font-bold text-stone-900">{lang === "en" ? "Currently Active Reviews" : "നിലവിൽ വെബ്‌സൈറ്റിലുള്ള റിവ്യൂകൾ"} ({liveReviews.length})</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {liveReviews.map((item) => (
                    <div key={item.id} className="bg-white border border-stone-150 p-4 rounded-xl flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex gap-0.5 text-amber-500">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <Star key={i} fill="currentColor" className="h-3 w-3" />
                          ))}
                        </div>
                        <p className="text-stone-600 italic text-xs leading-relaxed line-clamp-3">"{item.feedbackEn}"</p>
                        <p className="text-[10px] text-stone-500 font-bold">{item.name} - {item.designationEn}</p>
                      </div>

                      <div className="flex gap-1 items-center shrink-0">
                        <button
                          id={`edit-rev-active-${item.id}`}
                          onClick={() => startEditReview(item)}
                          className="text-stone-400 hover:text-amber-600 p-1 rounded hover:bg-stone-50 cursor-pointer"
                          title="Edit Review"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {item.custom && (
                          <button
                            id={`delete-rev-${item.id}`}
                            onClick={() => {
                              if (confirm("Are you sure you want to permanently remove this review?")) {
                                onDeleteReview(item.id);
                              }
                            }}
                            className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-stone-50 cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Services Administration tab folder */}
          {activeSubTab === "services" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-stone-900">Manage Service Portfolios</h3>
                <p className="text-xs text-stone-500">Add new financial/loan service offerings or remove custom portfolios.</p>
              </div>

              {/* Service custom form */}
              <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-amber-800">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  <h4 className="font-serif text-base font-bold text-stone-900">Add New Loan Category / Advisory Portfolio</h4>
                </div>

                <form onSubmit={handleServiceSubmit} className="space-y-4">
                  {/* Title fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Portfolio Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={svcTitleEn}
                        onChange={(e) => setSvcTitleEn(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                        placeholder="e.g. LAP Professional Loan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Portfolio Title (Malayalam) *</label>
                      <input
                        type="text"
                        required
                        value={svcTitleMl}
                        onChange={(e) => setSvcTitleMl(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                        placeholder="ഉദാ: വസ്തുവിന്മേലുള്ള വായ്പകൾ"
                      />
                    </div>
                  </div>

                  {/* Icon selection */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2">Category Icon Selector</label>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_ICONS.map((iconName) => (
                        <button
                          type="button"
                          key={iconName}
                          onClick={() => setSvcIcon(iconName)}
                          className={`p-2.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${svcIcon === iconName
                            ? "bg-amber-600 text-white border-amber-600 shadow-md transform -translate-y-0.5"
                            : "bg-white text-stone-600 border-stone-200 hover:border-amber-500"
                            }`}
                        >
                          <DynamicIcon name={iconName} className="h-5 w-5" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Short descriptions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Short Pitch (English) *</label>
                      <textarea
                        required
                        rows={2}
                        value={svcDescEn}
                        onChange={(e) => setSvcDescEn(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                        placeholder="Brief pitch for english overview card..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Short Pitch (Malayalam) *</label>
                      <textarea
                        required
                        rows={2}
                        value={svcDescMl}
                        onChange={(e) => setSvcDescMl(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                        placeholder="മലയാളത്തിലുള്ള ചെറിയ വിവരണം..."
                      />
                    </div>
                  </div>

                  {/* Large Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Specifications (English)</label>
                      <textarea
                        rows={6}
                        value={svcDetailEn}
                        onChange={(e) => setSvcDetailEn(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none min-h-[120px] resize-y overflow-y-auto"
                        placeholder="Full criteria specifications, required key documents..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Specifications (Malayalam)</label>
                      <textarea
                        rows={6}
                        value={svcDetailMl}
                        onChange={(e) => setSvcDetailMl(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none min-h-[120px] resize-y overflow-y-auto"
                        placeholder="വായ്‌പയെക്കുറിച്ചുള്ള വിശദമായ വിവരങ്ങൾ..."
                      />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-end pt-3 border-t border-stone-200">
                    <button
                      type="submit"
                      disabled={isSvcSubmitting}
                      className="inline-flex items-center gap-1.5 bg-stone-900 text-amber-100 hover:bg-stone-800 text-xs font-bold px-5 py-2.5 rounded-lg disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="h-4 w-4 text-amber-400" />
                      Save Service Portfolio
                    </button>
                  </div>
                </form>
              </div>

              {/* Service list section for quick deletions */}
              <div className="space-y-4">
                <h4 className="font-serif text-sm font-bold text-stone-900">Current active services list</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((svc) => (
                    <div key={svc.id} className="bg-white border border-stone-200 p-4 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-800 shrink-0">
                          <DynamicIcon name={svc.icon} className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 text-xs truncate">{svc.titleEn}</p>
                          <p className="text-stone-500 text-[10px] truncate">{svc.titleMl}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-semibold tracking-wider text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-100 uppercase">
                          {svc.custom ? "Custom" : "Core"}
                        </span>
                        <button
                          onClick={() => startEditService(svc)}
                          className="text-stone-400 hover:text-amber-600 p-1 rounded hover:bg-stone-50 shrink-0 cursor-pointer"
                          title="Edit Portfolio"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {svc.custom && (
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to remove this service portfolio?")) {
                                onDeleteService(svc.id);
                              }
                            }}
                            className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-stone-50 shrink-0 cursor-pointer"
                            title="Delete Portfolio"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Advisory & Insights (News) tab folder */}
          {activeSubTab === "news" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-stone-900">Manage Market Advisory & Insights</h3>
                <p className="text-xs text-stone-500">Publish fresh financial articles, bank updates, or sector policies, or manage older articles.</p>
              </div>

              {/* News Publish form */}
              <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-amber-800">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  <h4 className="font-serif text-base font-bold text-stone-900">Publish New Financial Recommendation / Bank Rate Update</h4>
                </div>

                <form onSubmit={handleNewsSubmit} className="space-y-4">
                  {/* Title fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Article Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={newsTitleEn}
                        onChange={(e) => setNewsTitleEn(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                        placeholder="e.g. New SBI home loan rates updates"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Article Title (Malayalam) *</label>
                      <input
                        type="text"
                        required
                        value={newsTitleMl}
                        onChange={(e) => setNewsTitleMl(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                        placeholder="ഉദാ: മാറിയ പുതിയ പലിശ നിരക്കുകൾ"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Category (English) *</label>
                      <input
                        type="text"
                        required
                        value={newsCategoryEnCustom}
                        onChange={(e) => setNewsCategoryEnCustom(e.target.value)}
                        placeholder="e.g. Rate Updates / Home Loan Advice"
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Category (Malayalam) *</label>
                      <input
                        type="text"
                        required
                        value={newsCategoryMlCustom}
                        onChange={(e) => setNewsCategoryMlCustom(e.target.value)}
                        placeholder="ഉദാ: പലിശ നിരക്ക് മാറ്റങ്ങൾ"
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Full Description text content */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Narrative Content (English) *</label>
                      <textarea
                        required
                        rows={4}
                        value={newsContentEn}
                        onChange={(e) => setNewsContentEn(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                        placeholder="Write the full financial advice text here..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Narrative Content (Malayalam) *</label>
                      <textarea
                        required
                        rows={4}
                        value={newsContentMl}
                        onChange={(e) => setNewsContentMl(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                        placeholder="വിശദമായ വിവരണം മലയാളത്തിൽ എഴുതുക..."
                      />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-end pt-3 border-t border-stone-200">
                    <button
                      type="submit"
                      disabled={isNewsSubmitting}
                      className="inline-flex items-center gap-1.5 bg-stone-900 text-amber-100 hover:bg-stone-800 text-xs font-bold px-5 py-2.5 rounded-lg disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="h-4 w-4 text-amber-400" />
                      Publish Advisory Article
                    </button>
                  </div>
                </form>
              </div>

              {/* Advisory list with active deletion controls */}
              <div className="space-y-4">
                <h4 className="font-serif text-sm font-bold text-stone-900">Currently published articles</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {news.map((item) => (
                    <div key={item.id} className="bg-white border border-stone-200 p-4 rounded-xl flex items-center justify-between gap-4">
                      <div className="min-w-0 flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-stone-105 bg-stone-100 text-stone-605 text-stone-600 shrink-0">
                          <BookOpen className="h-5 w-5 text-amber-800" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 text-xs truncate">{item.titleEn}</p>
                          <p className="text-stone-500 text-[10px] truncate">{item.date} • {item.categoryEn}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-semibold tracking-wider text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-100 uppercase">
                          {item.custom ? "Custom" : "Core"}
                        </span>
                        <button
                          onClick={() => startEditNews(item)}
                          className="text-stone-400 hover:text-amber-600 p-1 rounded hover:bg-stone-50 shrink-0 cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {item.custom && (
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to permanently delete this financial article?")) {
                                onDeleteNews(item.id);
                              }
                            }}
                            className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-stone-50 shrink-0 cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "bankrates" && (
            <div className="space-y-6">
              <h3 className="font-serif text-lg font-bold text-stone-900">Configure Loan Interest Rates</h3>
              <p className="text-xs text-stone-500 leading-relaxed max-w-2xl font-light">
                Manage partnering banking institutions, customize live interest rates, maximum tenures, and file processing fee criteria. These tables synchronize instantly across the Home loan comparison grid.
              </p>

              {/* Add Bank Rate form */}
              <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-amber-800">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  <h4 className="font-serif text-base font-bold text-stone-900 font-sans">Add Partner Bank Rate profile</h4>
                </div>

                <form onSubmit={handleRateSubmit} className="space-y-4 font-sans text-stone-700">
                  {/* Bank Name fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Bank Name (English) *</label>
                      <input
                        type="text"
                        required
                        value={rateBankNameEn}
                        onChange={(e) => setRateBankNameEn(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                        placeholder="e.g. State Bank of India"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Bank Name (Malayalam) *</label>
                      <input
                        type="text"
                        required
                        value={rateBankNameMl}
                        onChange={(e) => setRateBankNameMl(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                        placeholder="e.g. സ്റ്റേറ്റ് ബാങ്ക് ഓഫ് ഇന്ത്യ"
                      />
                    </div>
                  </div>

                  {/* Interest Rate & Max Tenure */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1 font-sans font-bold text-stone-900">Interest Rate Range *</label>
                      <input
                        type="text"
                        required
                        value={rateInterest}
                        onChange={(e) => setRateInterest(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none font-mono"
                        placeholder="e.g. 8.40% - 9.15%"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Max Tenure (English)</label>
                      <input
                        type="text"
                        required
                        value={rateMaxTenureEn}
                        onChange={(e) => setRateMaxTenureEn(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1 font-sans">Max Tenure (Malayalam)</label>
                      <input
                        type="text"
                        required
                        value={rateMaxTenureMl}
                        onChange={(e) => setRateMaxTenureMl(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Processing Fees */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Processing Fee (English)</label>
                      <input
                        type="text"
                        required
                        value={rateProcessingEn}
                        onChange={(e) => setRateProcessingEn(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Processing Fee (Malayalam)</label>
                      <input
                        type="text"
                        required
                        value={rateProcessingMl}
                        onChange={(e) => setRateProcessingMl(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-3 border-t border-stone-200">
                    <button
                      type="submit"
                      disabled={isRateSubmitting}
                      className="inline-flex items-center gap-1.5 bg-stone-900 text-amber-100 hover:bg-stone-800 text-xs font-bold px-5 py-2.5 rounded-lg disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="h-4 w-4 text-amber-400" />
                      Add Bank Rate Profile
                    </button>
                  </div>
                </form>
              </div>

              {/* List of currently registered Bank Rate profiles with Edit/Delete */}
              <div className="space-y-4 text-stone-700 font-sans">
                <h4 className="font-serif text-sm font-bold text-stone-900">Currently Registered Interest Rates</h4>

                <div className="border border-stone-250 border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-stone-200 text-left text-xs font-sans">
                      <thead className="bg-stone-50 font-bold text-stone-800 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="px-5 py-3.5">Bank Name</th>
                          <th className="px-5 py-3.5 font-bold text-stone-900">Interest Rate (p.a.)</th>
                          <th className="px-5 py-3.5">Max Tenure</th>
                          <th className="px-5 py-3.5">Processing Fee</th>
                          <th className="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-150 text-stone-700">
                        {bankRates && bankRates.map((rate) => (
                          <tr key={rate.id} className="hover:bg-stone-50/55 transition">
                            <td className="px-5 py-4 font-bold text-stone-950">
                              <div>{rate.bankNameEn}</div>
                              <div className="text-[10px] text-stone-400 font-normal">{rate.bankNameMl}</div>
                            </td>
                            <td className="px-5 py-4 font-mono font-bold text-amber-900 text-sm">{rate.interestRate}</td>
                            <td className="px-5 py-4">
                              <div>{rate.maxTenureEn}</div>
                              <div className="text-[10px] text-stone-400 font-normal">{rate.maxTenureMl}</div>
                            </td>
                            <td className="px-5 py-4">
                              <div>{rate.processingFeeEn}</div>
                              <div className="text-[10px] text-stone-400 font-normal">{rate.processingFeeMl}</div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="inline-flex gap-2">
                                <button
                                  onClick={() => startEditRate(rate)}
                                  className="px-2.5 py-1.5 rounded border border-stone-200 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-[10px] tracking-wide transition cursor-pointer"
                                >
                                  Edit Info
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm(`Are you sure you want to permanently delete rates profile for ${rate.bankNameEn}?`)) {
                                      await onDeleteBankRate(rate.id);
                                    }
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[10px] font-bold text-red-600 transition cursor-pointer"
                                  title="Delete Bank Profile"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Editing Bank Rate Modal Popup */}
          {editingRate && (
            <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn text-stone-700">
              <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-stone-800 to-amber-600" />

                <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                  <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Edit Bank Interest Rates
                  </h3>
                  <button
                    onClick={() => setEditingRate(null)}
                    className="p-1 px-2 text-xs font-semibold rounded hover:bg-stone-200 text-stone-500 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleRateUpdateSubmit} className="p-6 overflow-y-auto space-y-4 font-sans text-stone-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold">Bank Name (English) *</label>
                      <input
                        type="text"
                        required
                        value={editRateBankNameEn}
                        onChange={(e) => setEditRateBankNameEn(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold">Bank Name (മലയാളം) *</label>
                      <input
                        type="text"
                        required
                        value={editRateBankNameMl}
                        onChange={(e) => setEditRateBankNameMl(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">Interest Rate *</label>
                      <input
                        type="text"
                        required
                        value={editRateInterest}
                        onChange={(e) => setEditRateInterest(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">Max Tenure (English) *</label>
                      <input
                        type="text"
                        required
                        value={editRateMaxTenureEn}
                        onChange={(e) => setEditRateMaxTenureEn(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">Max Tenure (Malayalam) *</label>
                      <input
                        type="text"
                        required
                        value={editRateMaxTenureMl}
                        onChange={(e) => setEditRateMaxTenureMl(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">Processing Fee (English) *</label>
                      <input
                        type="text"
                        required
                        value={editRateProcessingEn}
                        onChange={(e) => setEditRateProcessingEn(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">Processing Fee (Malayalam) *</label>
                      <input
                        type="text"
                        required
                        value={editRateProcessingMl}
                        onChange={(e) => setEditRateProcessingMl(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex justify-end gap-3 font-sans">
                    <button
                      type="button"
                      onClick={() => setEditingRate(null)}
                      className="px-4 py-2 text-xs font-bold rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-100 transition cursor-pointer animate-duration-150"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Editing Service Modal Popup */}
          {editingService && (
            <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn text-stone-700">
              <div className="bg-white rounded-2xl max-w-3xl w-full border border-stone-200 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-stone-800 to-amber-600" />

                <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                  <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Edit Advisory Service Portfolio
                  </h3>
                  <button
                    onClick={() => setEditingService(null)}
                    className="p-1 px-2 text-xs font-semibold rounded hover:bg-stone-200 text-stone-500 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleServiceUpdateSubmit} className="p-6 overflow-y-auto space-y-4 font-sans text-stone-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold">Service Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={editSvcTitleEn}
                        onChange={(e) => setEditSvcTitleEn(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold">Service Title (Malayalam) *</label>
                      <input
                        type="text"
                        required
                        value={editSvcTitleMl}
                        onChange={(e) => setEditSvcTitleMl(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">Short Pitch (English) *</label>
                      <textarea
                        required
                        rows={2}
                        value={editSvcDescEn}
                        onChange={(e) => setEditSvcDescEn(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-sans font-bold">Short Pitch (Malayalam) *</label>
                      <textarea
                        required
                        rows={2}
                        value={editSvcDescMl}
                        onChange={(e) => setEditSvcDescMl(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 border-t border-stone-100 pt-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">Detailed Specs & Clearance Rules (English)</label>
                    <textarea
                      rows={6}
                      value={editSvcDetailEn}
                      onChange={(e) => setEditSvcDetailEn(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[120px] resize-y overflow-y-auto"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-sans">Detailed Specs & Clearance Rules (Malayalam)</label>
                    <textarea
                      rows={6}
                      value={editSvcDetailMl}
                      onChange={(e) => setEditSvcDetailMl(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans min-h-[120px] resize-y overflow-y-auto"
                    />
                  </div>

                  <div className="space-y-2 border-t border-stone-100 pt-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold">Service Category Icon</label>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_ICONS.map((ico) => (
                        <button
                          key={ico}
                          type="button"
                          onClick={() => setEditSvcIcon(ico)}
                          className={`p-2.5 rounded-lg border text-sm flex justify-center items-center cursor-pointer transition ${editSvcIcon === ico
                            ? "bg-stone-900 border-amber-500 text-amber-300"
                            : "bg-white border-stone-200 hover:bg-stone-50 text-stone-600"
                            }`}
                        >
                          <DynamicIcon name={ico} className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex justify-end gap-3 font-sans">
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2 text-xs font-bold rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 transition cursor-pointer"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={isSvcUpdating}
                      className="px-5 py-2 text-xs font-bold rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-100 disabled:opacity-50 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSvcUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Editing News/Advisory Modal Popup */}
          {editingNews && (
            <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn text-stone-700">
              <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-stone-800 to-amber-600" />

                <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                  <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Edit Advisory Article & Recommendations
                  </h3>
                  <button
                    onClick={() => setEditingNews(null)}
                    className="p-1 px-2 text-xs font-semibold rounded hover:bg-stone-200 text-stone-500 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleNewsUpdateSubmit} className="p-6 overflow-y-auto space-y-4 font-sans text-stone-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold">Article Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={editNewsTitleEn}
                        onChange={(e) => setEditNewsTitleEn(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold">Article Title (Malayalam) *</label>
                      <input
                        type="text"
                        required
                        value={editNewsTitleMl}
                        onChange={(e) => setEditNewsTitleMl(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold">Category (English) *</label>
                      <input
                        type="text"
                        required
                        value={editNewsCategoryEn}
                        onChange={(e) => setEditNewsCategoryEn(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-sans font-bold font-sans">Category (Malayalam) *</label>
                      <input
                        type="text"
                        required
                        value={editNewsCategoryMl}
                        onChange={(e) => setEditNewsCategoryMl(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 border-t border-stone-100 pt-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold">Narrative Content (English) *</label>
                    <textarea
                      required
                      rows={5}
                      value={editNewsContentEn}
                      onChange={(e) => setEditNewsContentEn(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-sans font-bold">Narrative Content (Malayalam) *</label>
                    <textarea
                      required
                      rows={5}
                      value={editNewsContentMl}
                      onChange={(e) => setEditNewsContentMl(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                    />
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex justify-end gap-3 font-sans">
                    <button
                      type="button"
                      onClick={() => setEditingNews(null)}
                      className="px-4 py-2 text-xs font-bold rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 transition cursor-pointer"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={isNewsUpdating}
                      className="px-5 py-2 text-xs font-bold rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-100 disabled:opacity-50 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {isNewsUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Editing Review Modal Popup */}
          {editingReview && (
            <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn text-stone-700">
              <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-stone-800 to-amber-600" />

                <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                  <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    {lang === "en" ? "Edit Client Feedback" : "ക്ലയന്റ് അഭിപ്രായം തിരുത്തുക"}
                  </h3>
                  <button
                    onClick={() => setEditingReview(null)}
                    className="p-1 px-2 text-xs font-semibold rounded hover:bg-stone-200 text-stone-500 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleReviewUpdateSubmit} className="p-6 overflow-y-auto space-y-4 font-sans text-stone-700 text-left">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold">
                      {lang === "en" ? "Client Name *" : "ക്ലയന്റ് പേര് *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={editReviewName}
                      onChange={(e) => setEditReviewName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                    />
                  </div>

                  {/* Designations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold">
                        {lang === "en" ? "Designation (English)" : "പദവി (English)"}
                      </label>
                      <input
                        type="text"
                        value={editReviewDesigEn}
                        onChange={(e) => setEditReviewDesigEn(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold font-sans">
                        {lang === "en" ? "Designation (Malayalam)" : "പദവി (Malayalam)"}
                      </label>
                      <input
                        type="text"
                        value={editReviewDesigMl}
                        onChange={(e) => setEditReviewDesigMl(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                      />
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold">
                      {lang === "en" ? "Rating (1-5) *" : "റേറ്റിംഗ് (1-5) *"}
                    </label>
                    <div className="flex gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setEditReviewRating(num)}
                          className="focus:outline-none cursor-pointer"
                        >
                          <Star
                            fill={num <= editReviewRating ? "#D4A373" : "transparent"}
                            className={`h-6 w-6 ${num <= editReviewRating ? "text-[#C29362]" : "text-stone-300 hover:text-amber-605 transition"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Contents */}
                  <div className="space-y-1 border-t border-stone-100 pt-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-bold">
                      {lang === "en" ? "Feedback (English) *" : "അഭിപ്രായം (English) *"}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={editReviewFeedbackEn}
                      onChange={(e) => setEditReviewFeedbackEn(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 font-sans font-bold">
                      {lang === "en" ? "Feedback (Malayalam) *" : "അഭിപ്രായം (Malayalam) *"}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={editReviewFeedbackMl}
                      onChange={(e) => setEditReviewFeedbackMl(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                    />
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex justify-end gap-3 font-sans">
                    <button
                      type="button"
                      onClick={() => setEditingReview(null)}
                      className="px-4 py-2 text-xs font-bold rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 transition cursor-pointer"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={isReviewUpdating}
                      className="px-5 py-2 text-xs font-bold rounded-lg bg-stone-900 hover:bg-stone-850 text-amber-100 disabled:opacity-50 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {isReviewUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Secure Sign Out strip */}
          <div className="flex justify-end pt-8 border-t border-stone-200">
            <button
              id="admin-logout-btn"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 px-5 py-2.5 text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Sign Out Securely
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
export default AdminPanel;
