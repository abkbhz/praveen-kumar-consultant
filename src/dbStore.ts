import { Service, NewsItem, Review, ContactEnquiry, BankRate } from "./types";
import { INITIAL_SERVICES, INITIAL_NEWS, INITIAL_REVIEWS, INITIAL_BANK_RATES } from "./data";
import { db, isFirebaseEnabled, handleFirestoreError, OperationType } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

// Helper keys for Local Storage
const LS_SERVICES = "praveen_services";
const LS_NEWS = "praveen_news";
const LS_REVIEWS = "praveen_reviews";
const LS_ENQUIRIES = "praveen_enquiries";
const LS_BANK_RATES = "praveen_bank_rates";

// Fallback dynamic database state
let localServices: Service[] = [];
let localNews: NewsItem[] = [];
let localReviews: Review[] = [];
let localEnquiries: ContactEnquiry[] = [];
let localBankRates: BankRate[] = [];

// Initialize local variables from local storage or defaults
function initLocalStorage() {
  const storedServices = localStorage.getItem(LS_SERVICES);
  if (storedServices) {
    localServices = JSON.parse(storedServices);
  } else {
    localServices = [...INITIAL_SERVICES];
    localStorage.setItem(LS_SERVICES, JSON.stringify(localServices));
  }

  const storedNews = localStorage.getItem(LS_NEWS);
  if (storedNews) {
    localNews = JSON.parse(storedNews);
  } else {
    localNews = [...INITIAL_NEWS];
    localStorage.setItem(LS_NEWS, JSON.stringify(localNews));
  }

  const storedReviews = localStorage.getItem(LS_REVIEWS);
  if (storedReviews) {
    localReviews = JSON.parse(storedReviews);
  } else {
    localReviews = [...INITIAL_REVIEWS];
    localStorage.setItem(LS_REVIEWS, JSON.stringify(localReviews));
  }

  const storedEnquiries = localStorage.getItem(LS_ENQUIRIES);
  if (storedEnquiries) {
    localEnquiries = JSON.parse(storedEnquiries);
  } else {
    localEnquiries = [];
    localStorage.setItem(LS_ENQUIRIES, JSON.stringify(localEnquiries));
  }

  const storedBankRates = localStorage.getItem(LS_BANK_RATES);
  if (storedBankRates) {
    localBankRates = JSON.parse(storedBankRates);
  } else {
    localBankRates = [...INITIAL_BANK_RATES];
    localStorage.setItem(LS_BANK_RATES, JSON.stringify(localBankRates));
  }
}

initLocalStorage();

// Firestore helper methods
async function fetchFirestoreCollection(colName: string): Promise<any[]> {
  const colRef = collection(db, colName);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Global data operations
export const dbStore = {
  // Services
  async getServices(): Promise<Service[]> {
    if (isFirebaseEnabled && db) {
      try {
        const data = await fetchFirestoreCollection("services");
        // Combine initial and customized services
        if (data.length === 0) {
          // If Firestore is empty, seed it with defaults
          for (const s of INITIAL_SERVICES) {
            await setDoc(doc(db, "services", s.id), s);
          }
          return [...INITIAL_SERVICES];
        }
        return data;
      } catch (error) {
        console.error("Firestore read error for services:", error);
        return [...localServices];
      }
    } else {
      return [...localServices];
    }
  },

  async addService(service: Omit<Service, "id"> & { id?: string }): Promise<Service> {
    const newId = service.id || "service-" + Date.now();
    const fullService: Service = { ...service, id: newId, custom: true };

    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, "services", newId), fullService);
        return fullService;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `services/${newId}`);
        throw error;
      }
    } else {
      localServices.push(fullService);
      localStorage.setItem(LS_SERVICES, JSON.stringify(localServices));
      return fullService;
    }
  },

  async deleteService(id: string): Promise<void> {
    if (isFirebaseEnabled && db) {
      try {
        await deleteDoc(doc(db, "services", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
        throw error;
      }
    } else {
      localServices = localServices.filter((s) => s.id !== id);
      localStorage.setItem(LS_SERVICES, JSON.stringify(localServices));
    }
  },

  // News Insights
  async getNews(): Promise<NewsItem[]> {
    if (isFirebaseEnabled && db) {
      try {
        const data = await fetchFirestoreCollection("news");
        if (data.length === 0) {
          for (const n of INITIAL_NEWS) {
            await setDoc(doc(db, "news", n.id), n);
          }
          return [...INITIAL_NEWS];
        }
        return data.sort((a, b) => b.date.localeCompare(a.date));
      } catch (error) {
        console.error("Firestore read error for news:", error);
        return [...localNews];
      }
    } else {
      return [...localNews].sort((a, b) => b.date.localeCompare(a.date));
    }
  },

  async addNews(news: Omit<NewsItem, "id">): Promise<NewsItem> {
    const id = "news-" + Date.now();
    const fullNews: NewsItem = { ...news, id, custom: true };

    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, "news", id), fullNews);
        return fullNews;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `news/${id}`);
        throw error;
      }
    } else {
      localNews.push(fullNews);
      localStorage.setItem(LS_NEWS, JSON.stringify(localNews));
      return fullNews;
    }
  },

  async deleteNews(id: string): Promise<void> {
    if (isFirebaseEnabled && db) {
      try {
        await deleteDoc(doc(db, "news", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `news/${id}`);
        throw error;
      }
    } else {
      localNews = localNews.filter((n) => n.id !== id);
      localStorage.setItem(LS_NEWS, JSON.stringify(localNews));
    }
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    if (isFirebaseEnabled && db) {
      try {
        const data = await fetchFirestoreCollection("reviews");
        if (data.length === 0) {
          for (const r of INITIAL_REVIEWS) {
            await setDoc(doc(db, "reviews", r.id), r);
          }
          return [...INITIAL_REVIEWS];
        }
        return data;
      } catch (error) {
        console.error("Firestore read error for reviews:", error);
        return [...localReviews];
      }
    } else {
      return [...localReviews];
    }
  },

  async addReview(review: Omit<Review, "id" | "date" | "approved">): Promise<Review> {
    const id = "review-" + Date.now();
    const fullReview: Review = {
      ...review,
      id,
      date: new Date().toISOString().split("T")[0],
      approved: false, // requires admin approvals by default
      custom: true,
    };

    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, "reviews", id), fullReview);
        return fullReview;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `reviews/${id}`);
        throw error;
      }
    } else {
      localReviews.push(fullReview);
      localStorage.setItem(LS_REVIEWS, JSON.stringify(localReviews));
      return fullReview;
    }
  },

  async approveReview(id: string): Promise<void> {
    if (isFirebaseEnabled && db) {
      try {
        const docRef = doc(db, "reviews", id);
        await updateDoc(docRef, { approved: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `reviews/${id}`);
        throw error;
      }
    } else {
      localReviews = localReviews.map((r) => (r.id === id ? { ...r, approved: true } : r));
      localStorage.setItem(LS_REVIEWS, JSON.stringify(localReviews));
    }
  },

  async deleteReview(id: string): Promise<void> {
    if (isFirebaseEnabled && db) {
      try {
        await deleteDoc(doc(db, "reviews", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `reviews/${id}`);
        throw error;
      }
    } else {
      localReviews = localReviews.filter((r) => r.id !== id);
      localStorage.setItem(LS_REVIEWS, JSON.stringify(localReviews));
    }
  },

  // Contact Enquiries / Submissions
  async getEnquiries(): Promise<ContactEnquiry[]> {
    if (isFirebaseEnabled && db) {
      try {
        return await fetchFirestoreCollection("enquiries");
      } catch (error) {
        console.error("Firestore read error for enquiries:", error);
        return [...localEnquiries];
      }
    } else {
      return [...localEnquiries];
    }
  },

  async addEnquiry(enquiry: Omit<ContactEnquiry, "id" | "date">): Promise<ContactEnquiry> {
    const id = "enquiry-" + Date.now();
    const fullEnquiry: ContactEnquiry = {
      ...enquiry,
      id,
      date: new Date().toISOString(),
    };

    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, "enquiries", id), fullEnquiry);
        return fullEnquiry;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `enquiries/${id}`);
        throw error;
      }
    } else {
      localEnquiries.push(fullEnquiry);
      localStorage.setItem(LS_ENQUIRIES, JSON.stringify(localEnquiries));
      return fullEnquiry;
    }
  },

  async deleteEnquiry(id: string): Promise<void> {
    if (isFirebaseEnabled && db) {
      try {
        await deleteDoc(doc(db, "enquiries", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `enquiries/${id}`);
        throw error;
      }
    } else {
      localEnquiries = localEnquiries.filter((e) => e.id !== id);
      localStorage.setItem(LS_ENQUIRIES, JSON.stringify(localEnquiries));
    }
  },

  // Bank Rates
  async getBankRates(): Promise<BankRate[]> {
    if (isFirebaseEnabled && db) {
      try {
        const data = await fetchFirestoreCollection("bankRates");
        if (data.length === 0) {
          for (const br of INITIAL_BANK_RATES) {
            await setDoc(doc(db, "bankRates", br.id), br);
          }
          return [...INITIAL_BANK_RATES];
        }
        return data;
      } catch (error) {
        console.error("Firestore read error for bankRates:", error);
        return [...localBankRates];
      }
    } else {
      return [...localBankRates];
    }
  },

  async addBankRate(rate: Omit<BankRate, "id">): Promise<BankRate> {
    const id = "rate-" + Date.now();
    const fullRate: BankRate = { ...rate, id };

    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, "bankRates", id), fullRate);
        return fullRate;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `bankRates/${id}`);
        throw error;
      }
    } else {
      localBankRates.push(fullRate);
      localStorage.setItem(LS_BANK_RATES, JSON.stringify(localBankRates));
      return fullRate;
    }
  },

  async updateBankRate(rate: BankRate): Promise<void> {
    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, "bankRates", rate.id), rate);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `bankRates/${rate.id}`);
        throw error;
      }
    } else {
      localBankRates = localBankRates.map((r) => r.id === rate.id ? rate : r);
      localStorage.setItem(LS_BANK_RATES, JSON.stringify(localBankRates));
    }
  },

  async deleteBankRate(id: string): Promise<void> {
    if (isFirebaseEnabled && db) {
      try {
        await deleteDoc(doc(db, "bankRates", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `bankRates/${id}`);
        throw error;
      }
    } else {
      localBankRates = localBankRates.filter((r) => r.id !== id);
      localStorage.setItem(LS_BANK_RATES, JSON.stringify(localBankRates));
    }
  },

  // Edit / Update Services in real-time
  async updateService(service: Service): Promise<void> {
    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, "services", service.id), service);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `services/${service.id}`);
        throw error;
      }
    } else {
      localServices = localServices.map((s) => s.id === service.id ? service : s);
      localStorage.setItem(LS_SERVICES, JSON.stringify(localServices));
    }
  },

  // Edit / Update News Insights in real-time
  async updateNews(news: NewsItem): Promise<void> {
    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, "news", news.id), news);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `news/${news.id}`);
        throw error;
      }
    } else {
      localNews = localNews.map((n) => n.id === news.id ? news : n);
      localStorage.setItem(LS_NEWS, JSON.stringify(localNews));
    }
  },

  // Edit / Update Reviews in real-time
  async updateReview(review: Review): Promise<void> {
    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, "reviews", review.id), review);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `reviews/${review.id}`);
        throw error;
      }
    } else {
      localReviews = localReviews.map((r) => r.id === review.id ? review : r);
      localStorage.setItem(LS_REVIEWS, JSON.stringify(localReviews));
    }
  }
};
