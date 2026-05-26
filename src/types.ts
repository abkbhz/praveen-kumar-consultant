export type Language = "en" | "ml";

export interface Service {
  id: string;
  titleEn: string;
  titleMl: string;
  descEn: string;
  descMl: string;
  detailEn: string;
  detailMl: string;
  icon: string; // Lucide icon name
  custom?: boolean;
}

export interface NewsItem {
  id: string;
  titleEn: string;
  titleMl: string;
  contentEn: string;
  contentMl: string;
  date: string;
  authorEn: string;
  authorMl: string;
  categoryEn: string;
  categoryMl: string;
  image?: string;
  custom?: boolean;
}

export interface Review {
  id: string;
  name: string;
  designationEn: string;
  designationMl: string;
  feedbackEn: string;
  feedbackMl: string;
  rating: number;
  date: string;
  approved: boolean;
  custom?: boolean;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export interface BankRate {
  id: string;
  bankNameEn: string;
  bankNameMl: string;
  interestRate: string; // e.g. "8.35%"
  maxTenureEn: string;
  maxTenureMl: string;
  processingFeeEn: string;
  processingFeeMl: string;
  updatedAt: string;
}
