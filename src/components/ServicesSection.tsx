import React, { useState } from "react";
import { Service, Language } from "../types";
import { TRANSLATIONS } from "../data";
import { DynamicIcon } from "./DynamicIcon";
import { ArrowRight, X, CheckCircle2 } from "lucide-react";

interface ServicesSectionProps {
  lang: Language;
  services: Service[];
  isAdminActive: boolean;
  onAddService: (service: Omit<Service, "id">) => Promise<void>;
  onUpdateService?: (service: Service) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
}

export function ServicesSection({
  lang,
  services,
}: ServicesSectionProps) {
  const t = TRANSLATIONS[lang];

  // Selected Service for detailed overlay view
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div id="services-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      
      {/* Services Header */}
      <div className="text-center space-y-3">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/50 px-3.5 py-1 rounded-full">
          {lang === "en" ? "WHAT WE OFFER" : "സേവനങ്ങൾ"}
        </span>
        <h2 className="font-serif text-3xl sm:text-4.5xl font-bold text-stone-900 leading-tight">
          {t.coreServicesTitle}
        </h2>
        <p className="text-stone-500 text-sm max-w-2xl mx-auto font-light">
          {t.coreServicesSubtitle}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="group block relative bg-white rounded-2xl border border-stone-250 border-stone-200 p-6 lg:p-8 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-lg hover:border-amber-500/20"
          >
            
            <div>
              {/* Category Icon Block */}
              <div className="flex items-center justify-between mb-4">
                <div id={`icon-cnt-${svc.id}`} className="p-3.5 rounded-xl bg-amber-500/10 text-amber-800 transition-all duration-300 group-hover:bg-stone-900 group-hover:text-amber-100 shadow-sm border border-amber-500/10">
                  <DynamicIcon name={svc.icon} className="h-6 w-6 stroke-[1.75]" />
                </div>
              </div>

              {/* Text Locale headings */}
              <h3 className="font-serif text-xl font-bold text-stone-950 mb-2">
                {lang === "en" ? svc.titleEn : svc.titleMl}
              </h3>
              <p className="text-stone-600 text-[14px] leading-relaxed font-light mt-1">
                {lang === "en" ? svc.descEn : svc.descMl}
              </p>
            </div>

            {/* Read Detail dynamic anchor */}
            <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
              <button
                id={`read-svc-${svc.id}`}
                onClick={() => setSelectedService(svc)}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-600 transition group-hover:translate-x-1 duration-200 cursor-pointer"
              >
                {t.readDetail}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] font-mono font-medium tracking-wider text-stone-400 bg-stone-50 px-2 py-1 rounded border border-stone-100 uppercase">
                {svc.id.startsWith("service-") ? "Custom" : "Core"}
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Details Modal Overlay */}
      {selectedService && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Elegant Header Band */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-stone-800 to-amber-600" />

            {/* Close Button top-right */}
            <button
              id="close-svc-detail-btn"
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Scroll Pane */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/50 text-amber-800 shrink-0">
                  <DynamicIcon name={selectedService.icon} className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-600">
                    {lang === "en" ? "ADVISORY SPECIFICATION" : "വായ്പാ പോർട്ട്‌ഫോളിയോ"}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    {lang === "en" ? selectedService.titleEn : selectedService.titleMl}
                  </h3>
                </div>
              </div>

              {/* Sub desc info */}
              <div className="bg-stone-50 border border-amber-100 p-4 rounded-xl text-stone-700 italic text-sm font-medium">
                "{lang === "en" ? selectedService.descEn : selectedService.descMl}"
              </div>

              {/* Full Detailed information specs */}
              <div className="space-y-4 pt-2">
                <h4 className="font-serif text-xs uppercase tracking-widest text-stone-400 font-bold">
                  {lang === "en" ? "PROCEDURE & DOCUMENTATION INFO" : "കൂടുതൽ വിവരങ്ങളും ഫയൽ ആവശ്യകതകളും"}
                </h4>
                
                <p className="text-stone-600 font-light leading-relaxed text-[15px]">
                  {lang === "en" ? selectedService.detailEn : selectedService.detailMl}
                </p>

                {/* Additional list bullets */}
                <div className="bg-amber-50/20 border border-amber-200/20 p-5 rounded-xl space-y-3 mt-4">
                  <h5 className="text-xs font-bold text-stone-800 font-sans tracking-wide uppercase">
                    {lang === "en" ? "Standard Required Clearence Papers" : "ആവശ്യമായ പ്രധാന രേഖകൾ"}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      <span>{lang === "en" ? "3 Years IT Returns / Salary slips" : "ശമ്പള സർട്ടിഫിക്കറ്റ് / വിറ്റുവരവ് രേഖ"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      <span>{lang === "en" ? "Valid Land Registry & Tax receipt" : "ഭൂമി ആധാരവും നികുതി രസീതും"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      <span>{lang === "en" ? "Encumbrance (കുടാൻ വഴിപത്രം)" : "കുടിശ്ശിക വില്ലേജ് സർട്ടിഫിക്കറ്റ്"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      <span>{lang === "en" ? "Municipal / Panchayat Blueprint" : "കെട്ടിട പ്ലാൻ & പെർമിറ്റ് കോപ്പി"}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Footer Control */}
            <div className="bg-stone-50 border-t border-stone-150 p-4 shrink-0 flex justify-end">
              <button
                id="modal-close-action-btn"
                onClick={() => setSelectedService(null)}
                className="inline-flex items-center justify-center rounded-lg bg-stone-900 hover:bg-stone-800 text-xs font-semibold px-5 py-2.5 text-amber-100 transition cursor-pointer"
              >
                {t.closeDetail}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
export default ServicesSection;
