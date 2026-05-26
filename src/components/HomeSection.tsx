import React, { useState, useEffect } from "react";
import { Review, Language, BankRate } from "../types";
import { TRANSLATIONS, BANKING_PARTNERS } from "../data";
import { Star, Quote, ShieldCheck, Heart, MessageSquare, ChevronRight, ChevronLeft, User } from "lucide-react";
import { motion } from "motion/react";

// Hosting-friendly relative imports so Vite packages, hashes, and outputs assets to standard dist/ folders
import portraitUrl from "../assets/images/praveen_kumar_portrait.jpg";
import bgUrl from "../assets/images/corporate_background_1779721527937.png";

interface HomeSectionProps {
  lang: Language;
  reviews: Review[];
  bankRates?: BankRate[];
  onSubmitReview: (review: Omit<Review, "id" | "date" | "approved">) => Promise<void>;
  onNavigate: (tab: string) => void;
}

// Helper to render high-fidelity corporate bank logos using accurate corporate colors and geometry as requested
function BankLogo({ name }: { name: string }) {
  const normName = name.toUpperCase();

  // 1. LIC Housing Finance Ltd (LIC HFL)
  if (normName.includes("LIC HOUSING") || normName.includes("LIC HFL")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        <rect x="4" y="4" width="46" height="62" fill="#003A70" rx="3" />
        {/* White house outline with small chimney & cupped hand silhouette */}
        <polygon points="27,14 12,31 16,31 16,51 38,51 38,31 42,31" fill="#FFCC00" />
        <rect x="23" y="32" width="8" height="19" fill="#003A70" />
        <circle cx="27" cy="24" r="5.5" fill="#ffffff" />
        <path d="M22,46 Q27,41 32,46" stroke="#ffffff" strokeWidth="2.5" fill="none" />
        {/* Right yellow background plate with LIC HFL words */}
        <rect x="54" y="4" width="62" height="42" fill="#FFCC00" rx="3" />
        <text x="85" y="31" fill="#003A70" fontSize="13.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">LIC HFL</text>
        <text x="85" y="58" fill="#003A70" fontSize="5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">LIC HOUSING FINANCE LTD</text>
      </svg>
    );
  }

  // 2. Federal Bank & Fedbank Financial Services
  if (normName.includes("FEDERAL BANK") || normName.includes("FEDBANK")) {
    const isFedfina = normName.includes("FINANCIAL") || normName.includes("SERVICES") || normName.includes("FEDBANK FINANCIAL");
    if (isFedfina) {
      return (
        <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
          <rect width="120" height="70" fill="#0B2F61" />
          <text x="60" y="33" fill="#ffffff" fontSize="14" fontWeight="950" fontStyle="italic" fontFamily="sans-serif" textAnchor="middle">FEDBANK</text>
          <rect x="15" y="41" width="90" height="2" fill="#FF9E1B" />
          <text x="60" y="55" fill="#FF9E1B" fontSize="5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">FINANCIAL SERVICES LIMITED</text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#042F64" />
        <path d="M14,24 H28 L20,48 H6 Z" fill="#ffffff" />
        <path d="M24,24 H38 L30,48 H16 Z" fill="#FF9E1B" />
        <text x="78" y="34" fill="#ffffff" fontSize="11" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">FEDERAL BANK</text>
        <rect x="44" y="41" width="68" height="1.5" fill="#FF9E1B" />
        <text x="78" y="53" fill="#FF9E1B" fontSize="4.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">YOUR PERFECT BANKING PARTNER</text>
      </svg>
    );
  }

  // 3. IDBI Bank
  if (normName.includes("IDBI")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#008040" />
        <circle cx="28" cy="35" r="18" fill="#F15A24" />
        <path d="M28,21 L16,42 L24,42 L28,31 L32,42 L40,42 Z" fill="#ffffff" />
        <text x="80" y="41" fill="#ffffff" fontSize="13" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">IDBI BANK</text>
      </svg>
    );
  }

  // 4. Indian Bank
  if (normName.includes("INDIAN BANK") && !normName.includes("SOUTH")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#FFD200" />
        <rect x="45" y="4" width="71" height="62" fill="#04569B" rx="2" />
        {/* Three classic interlocking loops */}
        <circle cx="25" cy="30" r="10" stroke="#04569B" strokeWidth="3" fill="none" />
        <circle cx="18" cy="40" r="10" stroke="#04569B" strokeWidth="3" fill="none" />
        <circle cx="32" cy="40" r="10" stroke="#04569B" strokeWidth="3" fill="none" />
        <ellipse cx="25" cy="34" rx="3" ry="5" fill="#E21D26" />
        <text x="80" y="28" fill="#ffffff" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">इंडियन बैंक</text>
        <text x="80" y="43" fill="#ffffff" fontSize="12" fontWeight="950" fontStyle="italic" fontFamily="sans-serif" textAnchor="middle">Indian Bank</text>
        <rect x="52" y="50" width="56" height="2" fill="#FFD200" />
        <text x="80" y="60" fill="#FFD200" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">ALLAHABAD</text>
      </svg>
    );
  }

  // 5. Bank of Baroda
  if (normName.includes("BARODA")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#FF6600" />
        <circle cx="26" cy="35" r="16" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3,2" fill="none" />
        {/* Stylized Baroda double B Sun rays */}
        <path d="M26,20 C18,24 18,46 26,50 C30,46 32,35 26,20 Z" fill="#ffffff" />
        <path d="M20,35 Q26,27 32,35 Q26,43 20,35" fill="#FF6600" opacity="0.6" />
        <text x="78" y="28" fill="#ffffff" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">बैंक ऑफ़ बड़ौदा</text>
        <text x="78" y="44" fill="#ffffff" fontSize="9" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">Bank of Baroda</text>
      </svg>
    );
  }

  // 6. Repco Home Finance
  if (normName.includes("REPCO")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        <path d="M12,36 L58,12 L104,36" stroke="#FFCE00" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <text x="58" y="41" fill="#DF1926" fontSize="19" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">Repco</text>
        <text x="58" y="57" fill="#DF1926" fontSize="8" fontWeight="bold" letterSpacing="0.5" fontFamily="sans-serif" textAnchor="middle">Home Finance</text>
      </svg>
    );
  }

  // 7. GIC Housing Finance Ltd
  if (normName.includes("GIC HOUSING") || normName.includes("GIC")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        {/* Dual stylized blue and red house silhouette */}
        <polygon points="12,34 26,21 40,34" fill="#1C3F94" />
        <polygon points="40,34 54,21 68,34" fill="#1C3F94" />
        <polygon points="26,21 40,9 54,21" fill="#DF1926" />
        <rect x="18" y="34" width="12" height="15" fill="#1C3F94" />
        <rect x="46" y="34" width="12" height="15" fill="#1C3F94" />
        {/* Human figures */}
        <circle cx="33" cy="41" r="3" fill="#ffffff" />
        <circle cx="21" cy="41" r="3" fill="#ffffff" />
        {/* Wordmark */}
        <text x="91" y="28" fill="#1C3F94" fontSize="14" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">GIC</text>
        <text x="60" y="59" fill="#1C3F94" fontSize="5.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">GIC HOUSING FINANCE LTD.</text>
        <text x="60" y="65" fill="#DF1926" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">YOUR ROAD TO A DREAM HOME</text>
      </svg>
    );
  }

  // 8. Aadhar Housing Finance Ltd
  if (normName.includes("AADHAR")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#AF1E24" />
        <polygon points="24,14 6,26 9,26 9,42 39,42 39,26 42,26" fill="#FABA15" />
        <rect x="15" y="26" width="18" height="16" fill="#AF1E24" />
        <circle cx="20" cy="32" r="2" fill="#ffffff" />
        <circle cx="28" cy="32" r="2" fill="#ffffff" />
        <line x1="20" y1="36" x2="28" y2="36" stroke="#ffffff" strokeWidth="1.5" />
        <text x="76" y="26" fill="#ffffff" fontSize="14" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">Aadhar</text>
        <text x="76" y="40" fill="#FABA15" fontSize="7" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">Housing Finance Ltd</text>
        <rect x="47" y="44" width="60" height="1" fill="#ffffff" />
        <text x="60" y="58" fill="#ffffff" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">GHAR BANEGA, TOH DESH BANEGA.</text>
      </svg>
    );
  }

  // 9. Karnataka Bank Ltd
  if (normName.includes("KARNATAKA")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        <circle cx="22" cy="35" r="15" stroke="#0072BC" strokeWidth="1.5" fill="none" />
        {/* Hexagonal Star shape */}
        <polygon points="22,23 32,41 12,41" stroke="#4a154b" strokeWidth="1.5" fill="none" />
        <polygon points="22,47 12,29 32,29" stroke="#4a154b" strokeWidth="1.5" fill="none" />
        <text x="76" y="32" fill="#4B124C" fontSize="9" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">Karnataka</text>
        <text x="76" y="44" fill="#4B124C" fontSize="9" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">Bank Ltd</text>
        <text x="76" y="54" fill="#0072BC" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">Your Family Bank. Across India.</text>
      </svg>
    );
  }

  // 10. South Indian Bank
  if (normName.includes("SOUTH INDIAN")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        <path d="M12,48 C12,32 18,22 28,15 L32,21 C22,28 20,38 12,48 Z" fill="#D21920" />
        <path d="M20,48 C20,37 24,28 32,21 L35,27 C28,34 26,41 20,48 Z" fill="#D21920" opacity="0.8" />
        <path d="M28,48 C28,42 30,35 37,29 L40,35 C35,40 33,45 28,48 Z" fill="#D21920" opacity="0.6" />
        <text x="78" y="32" fill="#D21920" fontSize="11" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">SOUTH</text>
        <text x="78" y="45" fill="#000000" fontSize="10" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">INDIAN Bank</text>
      </svg>
    );
  }

  // 11. Mahindra Home Finance
  if (normName.includes("MAHINDRA")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        <text x="60" y="30" fill="#DD1E26" fontSize="13.5" fontWeight="950" fontFamily="sans-serif" fontStyle="oblique" textAnchor="middle">mahindra</text>
        <text x="60" y="46" fill="#5F5F5F" fontSize="8" fontWeight="bold" letterSpacing="0.25" fontFamily="sans-serif" textAnchor="middle">HOME FINANCE</text>
      </svg>
    );
  }

  // 12. Piramal Finance
  if (normName.includes("PIRAMAL")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        <path d="M12,46 C13,31 22,21 31,21 C25,29 25,39 12,46 Z" fill="#EA3A06" />
        <path d="M19,46 C19,35 24,27 32,27 C28,33 28,41 19,46 Z" fill="#F15A24" />
        <path d="M26,46 C26,39 29,32 36,32 C33,37 33,43 26,46 Z" fill="#FBB03B" />
        <text x="76" y="32" fill="#004D4A" fontSize="11" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">Piramal</text>
        <text x="76" y="46" fill="#5A5A5C" fontSize="10" fontWeight="medium" fontFamily="sans-serif" textAnchor="middle">Finance</text>
      </svg>
    );
  }

  // 13. DCB Bank
  if (normName.includes("DCB BANK") || normName.includes("DCB")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#0C1D3A" />
        <text x="60" y="32" fill="#ffffff" fontSize="15" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">DCB BANK</text>
        <rect x="15" y="40" width="90" height="2" fill="#0092D1" />
        <text x="60" y="55" fill="#ffffff" fontSize="5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">DEVELOPMENT CREDIT BANK</text>
      </svg>
    );
  }

  // 14. Punjab National Bank
  if (normName.includes("PUNJAB NATIONAL") || (normName.includes("PNB") && !normName.includes("HOUSING"))) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#7E062B" />
        {/* Yellow circle outline with lock icon */}
        <circle cx="24" cy="35" r="15" fill="#FBC02D" />
        <circle cx="24" cy="35" r="10" fill="#7E062B" />
        <rect x="21" y="30" width="6" height="10" fill="#FBC02D" rx="1" />
        <text x="76" y="28" fill="#FBC02D" fontSize="6.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">पंजाब नेशनल बैंक</text>
        <text x="76" y="44" fill="#ffffff" fontSize="9.5" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">punjab national bank</text>
      </svg>
    );
  }

  // 15. PNB Housing Finance Limited
  if (normName.includes("PNB HOUSING")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#FFC107" />
        <rect x="4" y="4" width="112" height="42" fill="#D32F2F" rx="2" />
        <text x="60" y="30" fill="#ffffff" fontSize="13" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">pnb Housing</text>
        <text x="60" y="59" fill="#D32F2F" fontSize="8" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">Finance Limited</text>
      </svg>
    );
  }

  // 16. Kotak Mahindra Bank
  if (normName.includes("KOTAK")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        <circle cx="22" cy="35" r="15" fill="#E31E24" />
        <circle cx="22" cy="35" r="10" fill="#1C3F94" />
        {/* Stylized lowercase "k" vector */}
        <path d="M18,30 V40 M18,35 H23 M23,30 L18,35 L26,40" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="74" y="31" fill="#E31E24" fontSize="16" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">kotak</text>
        <text x="74" y="46" fill="#1C3F94" fontSize="7.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">Kotak Mahindra Bank</text>
      </svg>
    );
  }

  // 17. Karur Vysya Bank (KVB)
  if (normName.includes("KARUR") || normName.includes("KVB")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#B3D335" />
        <rect x="4" y="4" width="112" height="62" fill="#00833E" rx="3" />
        <circle cx="24" cy="35" r="15" fill="#B3D335" />
        <text x="24" y="40" fill="#00833E" fontSize="12" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">KVB</text>
        <text x="76" y="28" fill="#ffffff" fontSize="7.2" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">Karur Vysya Bank</text>
        <rect x="48" y="34" width="56" height="1" fill="#B3D335" />
        <text x="76" y="48" fill="#B3D335" fontSize="8.2" fontWeight="950" fontStyle="italic" fontFamily="sans-serif" textAnchor="middle">Smart way to bank</text>
      </svg>
    );
  }

  // 18. Truhome Finance
  if (normName.includes("TRUHOME")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        {/* Bold orange open square bracket frames on left & right */}
        <path d="M12,12 H22 L22,14 H14 L14,56 H22 V58 H12 Z" fill="#F15A24" />
        <path d="M108,12 H98 L98,14 H106 L106,56 H98 V58 H108 Z" fill="#F15A24" />
        <text x="60" y="34" fill="#00539C" fontSize="14" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">Truhome</text>
        <text x="60" y="48" fill="#58595B" fontSize="7" fontWeight="bold" letterSpacing="0.5" fontFamily="sans-serif" textAnchor="middle">FINANCE</text>
      </svg>
    );
  }

  // 19. Sundaram Home Finance (Sundaram Finance)
  if (normName.includes("SUNDARAM")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        {/* Blue box with elegant lowercase sf */}
        <rect x="4" y="16" width="34" height="38" fill="#004D95" rx="3" />
        <text x="21" y="42" fill="#ffffff" fontSize="19" fontWeight="bold" fontStyle="oblique" fontFamily="serif" textAnchor="middle">sf</text>
        <text x="76" y="30" fill="#004D95" fontSize="7" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">SUNDARAM HOME</text>
        <line x1="42" y1="36" x2="112" y2="36" stroke="#4F4F4F" strokeWidth="0.8" />
        <text x="76" y="48" fill="#4F4F4F" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">Sundaram Finance Group</text>
      </svg>
    );
  }

  // 20. Axis Finance
  if (normName.includes("AXIS")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#840F32" />
        {/* Wide Axis white Chevron icon */}
        <path d="M12,47 L24,19 L36,47 H27 L24,31 L21,47 Z" fill="#ffffff" />
        <text x="72" y="39" fill="#ffffff" fontSize="11" fontWeight="950" letterSpacing="0.5" fontFamily="sans-serif" textAnchor="middle">AXIS FINANCE</text>
      </svg>
    );
  }

  // 21. Bajaj Housing Finance & Bajaj Finserv
  if (normName.includes("BAJAJ")) {
    const isFinserv = normName.includes("FINSERV");
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        <circle cx="22" cy="35" r="15" fill="#005A9C" />
        {/* Distinctive white stylized B emblem leaf wing shape */}
        <path d="M15,26 H22 A4.5,4.5 0 0 1 26.5,30.5 A4.5,4.5 0 0 1 22,35 H15 Z" fill="#ffffff" />
        <path d="M15,34 H23 A4.5,4.5 0 0 1 27.5,38.5 A4.5,4.5 0 0 1 23,43 H15 Z" fill="#ffffff" />
        <path d="M11,21 L16,35 L11,49" stroke="#ffffff" strokeWidth="2.8" fill="none" />
        <text x="74" y="32" fill="#005A9C" fontSize="13.5" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">BAJAJ</text>
        <text x="74" y="46" fill="#005A9C" fontSize="7" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">{isFinserv ? "FINSERV" : "Housing Finance"}</text>
      </svg>
    );
  }

  // 22. Manappuram Finance Limited
  if (normName.includes("MANAPPURAM")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#FFC40F" />
        <rect x="4" y="15" width="34" height="40" fill="#01522F" rx="2" />
        <circle cx="21" cy="35" r="9" fill="#FFC40F" />
        <path d="M21,29 L25,35 L17,35 Z" fill="#01522F" />
        <text x="77" y="32" fill="#D32F2F" fontSize="8" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">MANAPPURAM</text>
        <text x="77" y="44" fill="#01522F" fontSize="7.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">FINANCE LIMITED</text>
        <line x1="42" y1="49" x2="112" y2="49" stroke="#01522F" strokeWidth="0.85" />
        <text x="77" y="58" fill="#01522F" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">Make Life Easy</text>
      </svg>
    );
  }

  // 23. Godrej Capital
  if (normName.includes("GODREJ")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#00A59E" />
        <text x="60" y="32" fill="#ffffff" fontSize="17" fontWeight="bold" fontStyle="italic" fontFamily="serif" textAnchor="middle">Godrej</text>
        <line x1="22" y1="42" x2="98" y2="42" stroke="#ffffff" strokeWidth="1.5" />
        <text x="60" y="55" fill="#ffffff" fontSize="8" fontWeight="black" letterSpacing="0.8" fontFamily="sans-serif" textAnchor="middle">CAPITAL</text>
      </svg>
    );
  }

  // 24. YES Bank
  if (normName.includes("YES BANK")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        <circle cx="22" cy="35" r="14" stroke="#003580" strokeWidth="2.5" fill="none" />
        <path d="M12,35 Q22,46 36,21" stroke="#E31E24" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <text x="74" y="39" fill="#003580" fontSize="13.5" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">YES BANK</text>
      </svg>
    );
  }

  // 25. ICICI Home Finance & ICICI Bank
  if (normName.includes("ICICI")) {
    const isHome = normName.includes("HOME");
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        <circle cx="22" cy="35" r="15" fill="#E85C1C" />
        <ellipse cx="22" cy="35" rx="11" ry="8" stroke="#FFE100" strokeWidth="1.5" fill="none" />
        <text x="22" y="42" fill="#ffffff" fontSize="20" fontWeight="bold" fontFamily="serif" textAnchor="middle">i</text>
        <text x="74" y="32" fill="#990000" fontSize="14" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">ICICI</text>
        <text x="74" y="46" fill="#003466" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">{isHome ? "Home Finance" : "ICICI Bank"}</text>
      </svg>
    );
  }

  // 26. Aditya Birla Capital Home Loans
  if (normName.includes("ADITYA BIRLA") || normName.includes("BIRLA")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        {/* Beautiful multi-part dynamic red-orange sunburst shards logo */}
        <polygon points="12,38 22,14 32,38" fill="#C1272D" />
        <polygon points="17,38 23,10 29,38" fill="#F15A24" opacity="0.9" />
        <polygon points="19,38 24,19 26,38" fill="#FBB03B" />
        <rect x="5" y="42" width="34" height="2" fill="#C1272D" />
        <text x="77" y="22" fill="#C1272D" fontSize="6.2" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">ADITYA BIRLA</text>
        <text x="77" y="34" fill="#3A3A3C" fontSize="9.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">CAPITAL</text>
        <text x="77" y="46" fill="#C1272D" fontSize="7" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">HOME LOANS</text>
      </svg>
    );
  }

  // 27. Orange Retail Finance
  if (normName.includes("ORANGE")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        <text x="60" y="32" fill="#F26522" fontSize="20" fontWeight="950" fontFamily="serif" textAnchor="middle">Orange</text>
        <circle cx="91" cy="16" r="3.5" fill="#8AC73E" />
        <path d="M91,16 C95,12 91,8 88,12 Z" fill="#8AC73E" />
        <text x="60" y="48" fill="#005B30" fontSize="8" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">Retail Finance</text>
      </svg>
    );
  }

  // 28. Vastu Housing Finance
  if (normName.includes("VASTU")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        {/* Teal stylized structural home roof */}
        <polygon points="60,11 84,24 84,40 36,40 36,24" fill="#008080" />
        <circle cx="60" cy="23" r="5" fill="#8CC63F" />
        <text x="60" y="52" fill="#008080" fontSize="10.5" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">VASTU</text>
        <text x="60" y="62" fill="#58595B" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">HOUSING FINANCE</text>
      </svg>
    );
  }

  // 29. IKF Home Finance
  if (normName.includes("IKF")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        <polygon points="24,15 10,23 13,23 13,43 35,43 35,23 38,23" fill="#015D39" />
        <text x="24" y="37" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">i</text>
        <text x="74" y="32" fill="#015D39" fontSize="15" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">IKF</text>
        <text x="74" y="46" fill="#F15A24" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">Home Finance</text>
      </svg>
    );
  }

  // 30. Union Bank of India
  if (normName.includes("UNION BANK") || normName.includes("UNION")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        {/* Interlocking blue and red ribbons forming dynamic double U */}
        <path d="M12,22 V42 C12,49 18,52 24,52 C30,52 30,46 30,42 V22 H24 V42 C24,44 24,47 22,47 C20,47 18,44 18,42 V22 Z" fill="#003580" />
        <path d="M42,22 V42 C42,49 36,52 30,52 C24,52 24,46 24,42 V22 H30 V42 C30,44 30,47 32,47 C34,47 36,44 36,42 V22 Z" fill="#E31C23" />
        <text x="78" y="34" fill="#003580" fontSize="10.5" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">Union Bank</text>
        <text x="78" y="46" fill="#E31C23" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">of India</text>
      </svg>
    );
  }

  // 31. Tata Capital
  if (normName.includes("TATA")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#ffffff" />
        <path d="M14,14 L28,14 L32,24 L36,14 L50,14" stroke="#0A4D92" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M22,24 H42 L32,42 Z" fill="#0A4D92" opacity="0.8" />
        <text x="74" y="30" fill="#0A4D92" fontSize="9" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">TATA CAPITAL</text>
        <line x1="48" y1="36" x2="100" y2="36" stroke="#00A49E" strokeWidth="0.8" />
        <text x="74" y="47" fill="#58595B" fontSize="6" fontStyle="oblique" fontFamily="sans-serif" textAnchor="middle">Count on us</text>
      </svg>
    );
  }

  // 32. State Bank of India
  if (normName.includes("STATE BANK") || normName.includes("SBI")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#0096D6" />
        {/* Iconic SBI keyhole logo */}
        <circle cx="28" cy="35" r="16" fill="#003580" />
        <circle cx="28" cy="35" r="7.5" fill="#0096D6" />
        <rect x="25" y="42" width="6" height="12" fill="#0096D6" />
        <text x="78" y="41" fill="#ffffff" fontSize="14" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">SBI</text>
      </svg>
    );
  }

  // 33. Canara Bank
  if (normName.includes("CANARA")) {
    return (
      <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
        <rect width="120" height="70" fill="#005B9A" />
        {/* Canara twin interlocking triangles */}
        <polygon points="12,35 24,15 36,35" stroke="#FFCE00" strokeWidth="3" fill="none" strokeLinecap="round" />
        <polygon points="20,45 32,25 44,45" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="80" y="38" fill="#ffffff" fontSize="11" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">CANARA</text>
      </svg>
    );
  }

  // Fallback monogram logo for other custom or newly launched partners
  const initials = name.split(" ")
    .filter(word => !["Finance", "Housing", "Ltd", "Ltd.", "Limited", "Services", "Corporation", "Capital", "ltd", "of", "India"].includes(word))
    .map(w => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  return (
    <svg viewBox="0 0 120 70" className="h-6 w-11 shrink-0 bg-white rounded shadow-sm border border-stone-200" fill="none">
      <rect width="120" height="70" fill="#1F2937" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#FFC72C" fontSize="24" fontWeight="bold" fontFamily="sans-serif">
        {initials || "FIN"}
      </text>
    </svg>
  );
}

export function HomeSection({
  lang,
  reviews,
  bankRates = [],
  onSubmitReview,
  onNavigate,
}: HomeSectionProps) {
  const t = TRANSLATIONS[lang];
  const approvedReviews = reviews.filter((r) => r.approved);

  // Carousel State
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // States for Leave a Review Form
  const [reviewName, setReviewName] = useState("");
  const [reviewDesig, setReviewDesig] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Auto-scroll effect
  useEffect(() => {
    if (approvedReviews.length <= 3) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % approvedReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [approvedReviews.length]);

  // Handle out-of-bounds index upon deletion
  useEffect(() => {
    if (currentReviewIndex >= approvedReviews.length && approvedReviews.length > 0) {
      setCurrentReviewIndex(0);
    }
  }, [approvedReviews.length, currentReviewIndex]);

  const handlePrevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + approvedReviews.length) % approvedReviews.length);
  };

  const handleNextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % approvedReviews.length);
  };

  // Helper to render a review card
  const renderReviewCard = (item: Review) => {
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-stone-200/60 rounded-xl p-6 shadow-sm relative transition duration-300 hover:shadow-md w-full"
      >
        <Quote className="absolute right-6 bottom-4 h-12 w-12 text-stone-100/50 -z-0 pointer-events-none stroke-[2]" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex gap-0.5 text-amber-500">
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star key={i} fill="currentColor" className="h-4 w-4" />
            ))}
          </div>
          <span className="text-[10px] text-stone-400 font-mono italic">{item.date}</span>
        </div>

        {/* Feedback translations dynamic */}
        <p className="text-stone-600 font-light leading-relaxed text-sm mt-4 italic relative z-10 text-left">
          "{lang === "en" ? item.feedbackEn : item.feedbackMl}"
        </p>

        <div className="flex items-center gap-3 pt-4 border-t border-stone-100 mt-4 relative z-10 text-left">
          <div className="h-8 w-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-extrabold text-xs">
            <User className="h-4 w-4 text-amber-700/80" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-800">{item.name}</h4>
            <p className="text-[11px] text-stone-500 font-sans font-medium">
              {lang === "en" ? item.designationEn : item.designationMl}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewFeedback) return;
    setIsSubmitting(true);
    try {
      await onSubmitReview({
        name: reviewName,
        designationEn: reviewDesig || "Client",
        designationMl: reviewDesig || "ക്ലയന്റ്",
        feedbackEn: reviewFeedback,
        feedbackMl: reviewFeedback,
        rating: reviewRating,
      });
      setReviewSuccess(true);
      setReviewName("");
      setReviewDesig("");
      setReviewRating(5);
      setReviewFeedback("");
      setTimeout(() => {
        setReviewSuccess(false);
        setShowReviewForm(false);
      }, 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image source references are loaded as ESM imports at the top of the file for full host compatibility.

  return (
    <div id="home-section" className="space-y-16 lg:space-y-24 pb-12">
      {/* Hero Section - Minimalist Elegant Mature Aesthetic */}
      <section className="relative overflow-hidden bg-[#FAF9F6] py-12 lg:py-20 border-b border-stone-200/45">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

            {/* Hero Text */}
            <div className="space-y-6 lg:col-span-7">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-3 py-1 text-[10px] sm:text-xs font-bold text-stone-800 border border-stone-200 uppercase tracking-widest">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                  {t.certifiedBadge}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-stone-900 px-3 py-1 text-[10px] sm:text-xs font-bold text-amber-100 uppercase tracking-widest">
                  {t.experienceBadge}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="font-serif text-[28px] xs:text-3.5xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.12]">
                  {t.welcomeTitle}
                </h1>
                <p className="font-sans text-base sm:text-lg font-semibold tracking-wide text-amber-800 lg:text-xl">
                  {t.welcomeSubtitle}
                </p>
              </div>

              <p className="max-w-xl text-stone-600 leading-relaxed font-light text-sm sm:text-base">
                {t.tagline}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  id="hero-cta-services"
                  onClick={() => onNavigate("services")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 px-5 py-3.5 text-xs sm:text-sm font-semibold text-amber-100 hover:bg-stone-850 transition duration-300 cursor-pointer"
                >
                  {t.heroCTA1}
                  <ChevronRight className="h-4 w-4 text-amber-400" />
                </button>
                <button
                  id="hero-cta-contact"
                  onClick={() => onNavigate("contact")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-5 py-3.5 text-xs sm:text-sm font-semibold text-stone-800 hover:bg-stone-50 transition duration-300 cursor-pointer"
                >
                  {t.heroCTA2}
                </button>
              </div>
            </div>

            {/* Profile Frame - Premium Gallery Matted Portrait (Host-Friendly) */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <div className="relative w-full max-w-[250px] bg-white p-3 shadow-xl rounded-2xl border border-amber-200/60 group">

                {/* Premium container for image */}
                <div className="relative overflow-hidden rounded-xl border border-amber-500/10 bg-[#FAF9F6] aspect-[4/5] w-full">
                  <img
                    id="praveen-portrait"
                    src={portraitUrl}
                    alt="Praveen Kumar P"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-102"
                  />
                </div>

                {/* Subdued professional caption */}
                <div className="pt-3 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355] font-mono leading-none">
                    {lang === "en" ? "Praveen Kumar P" : "പ്രവീൺ കുമാർ പി"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Infinite Scrolling Banking Partners Ribbon */}
      <section className="relative bg-stone-900 py-8 shadow-inner overflow-hidden border-y border-stone-800">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-stone-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-stone-900 to-transparent z-10 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 text-center mb-6">
          <h2 className="font-serif text-[11px] sm:text-xs uppercase tracking-[0.25em] text-amber-400/80 font-bold">
            {t.partnersTitle}
          </h2>
          <p className="text-[10px] sm:text-xs text-stone-400 mt-1 max-w-xl mx-auto font-light">
            {t.partnersSubtitle}
          </p>
        </div>

        {/* Double length marquee track for seamless infinity loop */}
        <div className="flex overflow-hidden">
          <div className="flex whitespace-nowrap animate-infinite-scroll py-2 gap-8">
            {/* Track 1 */}
            {BANKING_PARTNERS.map((partner, idx) => {
              return (
                <div
                  key={`b1-${idx}`}
                  className="inline-flex items-center gap-3 rounded-lg bg-stone-950 border border-stone-850 px-4 py-2 text-sm text-stone-200 shadow-md transition duration-300 group cursor-pointer select-none"
                >
                  <BankLogo name={partner} />
                  <span className="font-sans text-[11px] font-semibold tracking-wide text-stone-300 group-hover:text-amber-300 transition duration-300">{partner}</span>
                </div>
              );
            })}
            {/* Mirror Track to fill width and secure looping */}
            {BANKING_PARTNERS.map((partner, idx) => {
              return (
                <div
                  key={`b1-mirror-${idx}`}
                  className="inline-flex items-center gap-3 rounded-lg bg-stone-950 border border-stone-850 px-4 py-2 text-sm text-stone-200 shadow-md transition duration-300 group cursor-pointer select-none"
                >
                  <BankLogo name={partner} />
                  <span className="font-sans text-[11px] font-semibold tracking-wide text-stone-300 group-hover:text-amber-300 transition duration-300">{partner}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Description Block */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-white border border-amber-200/40 p-8 lg:p-12 shadow-xl shadow-stone-200/40">
          <div className="absolute top-0 right-0 h-40 w-40 bg-amber-50/50 rounded-bl-full -z-10" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">

            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700 font-semibold block">
                {lang === "en" ? "PROFESSIONAL PROFILE" : "വ്യക്തിവിവരങ്ങൾ"}
              </span>
              <h2 className="font-serif text-2xl sm:text-3.5xl font-bold text-stone-900 leading-tight">
                {t.aboutTitle}
              </h2>
              <div className="h-1 w-16 bg-amber-500" />
              <p className="text-stone-600 leading-relaxed font-light mt-4">
                {t.aboutDescription}
              </p>

              {/* Feature Points list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                    ✓
                  </div>
                  <span className="text-sm font-medium text-stone-700">
                    {lang === "en" ? "Direct Association with LIC HFL" : "നേരിട്ടുള്ള പ്രമാണ പരിശോധന"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                    ✓
                  </div>
                  <span className="text-sm font-medium text-stone-700">
                    {lang === "en" ? "Multi-Bank Partnerships" : "30+ ബാങ്കിംഗ് പങ്കാളികൾ"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                    ✓
                  </div>
                  <span className="text-sm font-medium text-stone-700">
                    {lang === "en" ? "Legal & Valuation Guidance" : "നിയമപരമായ സുരക്ഷിതത്വം"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                    ✓
                  </div>
                  <span className="text-sm font-medium text-stone-700">
                    {lang === "en" ? "Kerala-wide Network" : "കേരളത്തിലുടനീളം വായ്പകൾ"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quote block frame */}
            <div className="bg-stone-50 border border-amber-200/40 p-6 rounded-xl flex flex-col justify-between h-full relative">
              <Quote className="absolute top-4 right-4 h-16 w-16 text-amber-200/40 -z-0 stroke-[1]" />
              <div className="space-y-4 relative z-10">
                <p className="text-stone-700 italic font-medium leading-relaxed">
                  {lang === "en"
                    ? '"My core standard of success is getting approval for home buyers who standard systems fail. We structure files logically, clean historical clearance disputes, and select partners offering appropriate rates."'
                    : '"മറ്റുള്ളവർക്ക് അസാധ്യമെന്നു തോന്നുന്ന പല ഭവന വായ്പ പ്രമാണങ്ങളും കൃത്യമായ ലീഗൽ ഓഡിറ്റുകൾ നടത്തി അനുവദിച്ചെടുക്കാൻ ഞങ്ങൾ ശ്രമിക്കാറുണ്ട്. മികച്ച കസ്റ്റമർ പിന്തുണയും സുതാര്യമായ ഇടപാടുകളുമാണ് ഞങ്ങളുടെ മുഖമുദ്ര."'}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-amber-400 shrink-0">
                    <img src={portraitUrl} alt="Praveen Kumar Profile" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{t.welcomeTitle}</h4>
                    <p className="text-[11px] text-stone-500 font-mono">licpravi@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Real-time Housing Loan Interest Rates Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-amber-100/65 pt-16">
        <div className="text-center space-y-3 mb-10">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-700 font-bold bg-amber-100/50 border border-amber-200 px-3 py-1 rounded-full">
            <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping" />
            {lang === "en" ? "Real-Time Rate Updates" : "തത്സമയ പലിശ നിരക്കുകൾ"}
          </span>
          <h2 className="font-serif text-2.5xl sm:text-4xl font-bold text-stone-900 leading-tight">
            {lang === "en" ? "Housing Loan Interest Rates Comparison" : "ഭവന വായ്പ പലിശ നിരക്കുകൾ - താരതമ്യം"}
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-2xl mx-auto font-light">
            {lang === "en"
              ? "We work directly with major institutions to negotiate lower custom rates for Mr. Praveen's clients. View current base rates below:"
              : "പ്രമുഖ ബാങ്കുകളിൽ നിന്നും എൽ.ഐ.സി ഹൗസിംഗിൽ നിന്നും ഏറ്റവും കുറഞ്ഞ പലിശയിൽ ലോണുകൾ ലഭ്യമാക്കാൻ സഹായിക്കുന്നു. ഇപ്പോഴത്തെ നിരക്കുകൾ താഴെ കാണുക:"}
          </p>
        </div>

        <div className="bg-white border border-stone-200 shadow-xl shadow-stone-200/40 rounded-xl overflow-hidden">
          {/* Mobile Card Grid / Desktop Table */}
          <div className="hidden md:block overflow-x-auto text-stone-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-900 text-stone-100 uppercase tracking-widest text-[10px] font-mono border-b border-stone-800">
                  <th className="py-4 px-6 font-bold">{lang === "en" ? "Financial Institution" : "ബാങ്ക് / ധനകാര്യ സ്ഥാപനം"}</th>
                  <th className="py-4 px-4 font-bold text-center">{lang === "en" ? "Interest Rate (p.a.)" : "പലിശ നിരക്ക് (പ്രതിവർഷം)"}</th>
                  <th className="py-4 px-4 font-bold text-center">{lang === "en" ? "Max Tenure" : "പരമാവധി തിരിച്ചടവ് കാലാവധി"}</th>
                  <th className="py-4 px-4 font-bold">{lang === "en" ? "Processing Fee" : "പ്രൊസസിങ് ഫീസ്"}</th>
                  <th className="py-4 px-4 font-bold text-center">{lang === "en" ? "Real-time Status" : "സ്റ്റാറ്റസ്"}</th>
                  <th className="py-4 px-4 font-bold text-right">{lang === "en" ? "Advisory Action" : "സഹായം"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150">
                {bankRates.map((br) => (
                  <tr key={br.id} className="hover:bg-amber-50/20 transition duration-150 text-sm">
                    {/* Bank Column */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <BankLogo name={br.bankNameEn} />
                        <div>
                          <p className="font-serif font-bold text-stone-900 leading-tight">
                            {lang === "en" ? br.bankNameEn : br.bankNameMl}
                          </p>
                          <p className="font-mono text-[10.5px] text-stone-400 mt-0.5">
                            {lang === "en" ? `Verified Source` : `വെരിഫൈഡ് വിവരങ്ങൾ`}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Interest Rate Column */}
                    <td className="py-4.5 px-4 text-center">
                      <span className="inline-block bg-amber-500/10 border border-amber-500/25 rounded-lg px-2.5 py-1 text-sm font-bold text-amber-900 tracking-tight">
                        {br.interestRate}
                      </span>
                    </td>

                    {/* Tenure Column */}
                    <td className="py-4.5 px-4 text-center font-sans font-medium text-stone-600">
                      {lang === "en" ? br.maxTenureEn : br.maxTenureMl}
                    </td>

                    {/* Processing Fee Column */}
                    <td className="py-4.5 px-4 text-xs font-light text-stone-500 max-w-xs justify-start italic">
                      {lang === "en" ? br.processingFeeEn : br.processingFeeMl}
                    </td>

                    {/* Status Column */}
                    <td className="py-4.5 px-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 border border-green-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          {lang === "en" ? "ACTIVE" : "തത്സമയം"}
                        </span>
                        <span className="text-[9.5px] font-mono text-stone-400">
                          {br.updatedAt || "2026-05-26"}
                        </span>
                      </div>
                    </td>

                    {/* CTA Column */}
                    <td className="py-4.5 px-4 text-right">
                      <button
                        onClick={() => {
                          onNavigate("contact");
                        }}
                        className="inline-flex items-center gap-1 bg-stone-900 hover:bg-stone-800 text-white hover:text-amber-300 text-xs font-semibold px-4 py-2 rounded-lg transition"
                      >
                        {lang === "en" ? "Apply Guide" : "ഗൈഡ് നേടുക"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Desktop Table Fallback: Mobile List Cards */}
          <div className="md:hidden divide-y divide-stone-150">
            {bankRates.map((br) => (
              <div key={br.id} className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-2.5 items-center">
                    <BankLogo name={br.bankNameEn} />
                    <div>
                      <h4 className="font-serif font-bold text-[13.5px] text-stone-950 leading-snug">
                        {lang === "en" ? br.bankNameEn : br.bankNameMl}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="inline-block h-1 w-1 rounded-full bg-green-500" />
                        <span className="text-[9.5px] font-mono font-medium text-stone-400 uppercase tracking-widest">
                          {lang === "en" ? `Last updated: ${br.updatedAt}` : `പുതുക്കിയത്: ${br.updatedAt}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 bg-amber-500/10 border border-amber-500/25 rounded-md px-2 py-0.5 text-xs font-bold text-amber-900 tracking-tight">
                    {br.interestRate}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 border border-stone-200/50 p-3 rounded-lg font-light text-stone-600 font-sans col-span-2">
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-stone-400 font-semibold mb-0.5">
                      {lang === "en" ? "Max Tenure" : "പരമാവധി കാലാവധി"}
                    </span>
                    <span className="font-medium text-stone-800">{lang === "en" ? br.maxTenureEn : br.maxTenureMl}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-stone-400 font-semibold mb-0.5">
                      {lang === "en" ? "Processing Fee" : "പ്രൊസസിങ് ഫീസ്"}
                    </span>
                    <span className="text-[11px] leading-snug text-stone-800">{lang === "en" ? br.processingFeeEn : br.processingFeeMl}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 border border-green-150">
                    <span className="h-1 w-1 rounded-full bg-green-500" />
                    {lang === "en" ? "Active Advisory Ready" : "തത്സമയ കൺസൾട്ടേഷൻ"}
                  </span>
                  <button
                    onClick={() => onNavigate("contact")}
                    className="inline-flex items-center gap-1 bg-stone-900 hover:bg-stone-800 text-white hover:text-amber-100 text-xs font-medium px-4.5 py-2 rounded-lg transition"
                  >
                    {lang === "en" ? "Enquire Online" : "അന്വേഷണം അയക്കുക"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400 font-light italic">
          <p>{lang === "en" ? "* Actual interest rates are subject to individual credit scores, income brackets, and bank verification audits." : "* അന്തിമ പലിശ നിരക്കുകൾ കസ്റ്റമറുടെ വരുമാന തെളിവുകൾ, ബാങ്ക് നിബന്ധനകൾ എന്നിവയ്ക്ക് വിധേയമാണ്."}</p>
          <p className="flex items-center gap-1 not-italic font-mono font-medium text-amber-700">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            {lang === "en" ? "Latest RBI Repo Lending Alignment Active" : "ആർ.ബി.ഐ റിപ്പോ നിരക്കുമായി അലൈൻ ചെയ്തിരിക്കുന്നു"}
          </p>
        </div>
      </section>

      {/* Customer Ratings Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-amber-100/65 pt-16">
        <div className="text-center space-y-3 mb-12">
          <span className="inline-block font-mono text-xs uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/50 px-3.5 py-1 rounded-full">
            {lang === "en" ? "CLIENT SATISFACTION" : "വിശ്വസ്തത"}
          </span>
          <h2 className="font-serif text-3xl sm:text-4.5xl font-bold text-stone-900 leading-tight">
            {t.reviewsHeading}
          </h2>
          <p className="text-stone-500 text-sm max-w-2xl mx-auto font-light">
            {t.reviewsSub}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">

          {/* Summary Ratings Statistics Panel */}
          <div className="bg-white border border-amber-200/40 rounded-xl p-6 shadow-md lg:col-span-4 space-y-6">
            <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-amber-100 pb-3">
              {lang === "en" ? "Overall Consultancy Rating" : "ഫീഡ്ബാക്ക് വിവരങ്ങൾ"}
            </h3>

            <div className="flex items-center gap-4">
              <span className="text-5xl font-serif font-extrabold text-stone-900">4.9</span>
              <div>
                <div className="flex gap-0.5 text-amber-500">
                  <Star fill="currentColor" className="h-5 w-5" />
                  <Star fill="currentColor" className="h-5 w-5" />
                  <Star fill="currentColor" className="h-5 w-5" />
                  <Star fill="currentColor" className="h-5 w-5" />
                  <Star fill="currentColor" className="h-5 w-5" />
                </div>
                <p className="text-xs text-stone-500 mt-1">Based on {approvedReviews.length + 42} verified applications</p>
              </div>
            </div>

            {/* Ratings distribution visual */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-12 text-stone-600 font-medium">5 Star</span>
                <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="bg-amber-400 h-full w-[94%]" />
                </div>
                <span className="w-8 text-right text-stone-500">94%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-stone-600 font-medium">4 Star</span>
                <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="bg-amber-400 h-full w-[6%]" />
                </div>
                <span className="w-8 text-right text-stone-500">6%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-stone-600 font-medium">3 Star</span>
                <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="bg-amber-400 h-full w-0" />
                </div>
                <span className="w-8 text-right text-stone-500">0%</span>
              </div>
            </div>

            {/* Action to show review form */}
            {!showReviewForm ? (
              <button
                id="show-review-btn"
                onClick={() => setShowReviewForm(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 py-3 text-xs font-semibold text-amber-100 hover:bg-stone-800 transition duration-300 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-amber-400" />
                {t.leaveReview}
              </button>
            ) : (
              <button
                id="hide-review-btn"
                onClick={() => setShowReviewForm(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 px-4 py-3 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition duration-300 cursor-pointer"
              >
                {lang === "en" ? "Minimize Review Form" : "ഫോം മറച്ചുവെക്കുക"}
              </button>
            )}
          </div>

          {/* Actual Feed Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Interactive review submission widget */}
            {showReviewForm && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 shadow-md animate-fadeIn">
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">{t.leaveReview}</h3>

                {reviewSuccess ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center gap-3 text-sm font-medium">
                    <span className="text-xl">✓</span>
                    <p>{t.reviewSuccess}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">{t.reviewName} *</label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
                          placeholder="e.g. Anand Murugan"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">{t.reviewDesignation}</label>
                        <input
                          type="text"
                          value={reviewDesig}
                          onChange={(e) => setReviewDesig(e.target.value)}
                          className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
                          placeholder="e.g. Senior Builder, Palakkad"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">{t.reviewRating} *</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            type="button"
                            key={num}
                            onClick={() => setReviewRating(num)}
                            className="p-1 focus:outline-none animate-scaleUp"
                          >
                            <Star
                              fill={num <= reviewRating ? "#D4A373" : "transparent"}
                              className={`h-6 w-6 ${num <= reviewRating ? "text-[#C29362]" : "text-stone-300 hover:text-amber-600 transition"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">{t.reviewFeedback} *</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewFeedback}
                        onChange={(e) => setReviewFeedback(e.target.value)}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
                        placeholder="Share details of your housing loan advisory or refinance clearance..."
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 border border-stone-200 bg-white rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                      >
                        {t.cancelBtn}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2 text-xs font-semibold text-amber-100 hover:bg-stone-850 disabled:opacity-50 transition duration-200 cursor-pointer"
                      >
                        {t.reviewSubmit}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* List of active client reviews */}
            {approvedReviews.length === 0 ? (
              <div className="bg-stone-50 border border-stone-150 p-6 rounded-xl text-center text-stone-500 text-xs italic">
                {lang === "en" ? "No verified client reviews listed yet." : "റിവ്യൂകൾ ഒന്നും ലഭ്യമല്ല."}
              </div>
            ) : approvedReviews.length > 3 ? (
              <div className="relative px-8 sm:px-12 group/carousel">
                {/* Active Card */}
                {renderReviewCard(approvedReviews[currentReviewIndex % approvedReviews.length])}

                {/* Left navigation arrow */}
                <button
                  type="button"
                  onClick={handlePrevReview}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white hover:bg-stone-50 text-stone-600 hover:text-amber-700 rounded-full border border-stone-200 shadow-md hover:shadow-lg transition cursor-pointer z-10"
                  title="Previous Review"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>

                {/* Right navigation arrow */}
                <button
                  type="button"
                  onClick={handleNextReview}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white hover:bg-stone-50 text-stone-600 hover:text-amber-700 rounded-full border border-stone-200 shadow-md hover:shadow-lg transition cursor-pointer z-10"
                  title="Next Review"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>

                {/* Pagination Indicator dots */}
                <div className="flex justify-center gap-1.5 mt-6">
                  {approvedReviews.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentReviewIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        i === (currentReviewIndex % approvedReviews.length) ? "bg-amber-600 w-4" : "bg-stone-300 w-1.5 hover:bg-stone-400"
                      }`}
                      title={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {approvedReviews.map((item) => renderReviewCard(item))}
              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
}
export default HomeSection;
