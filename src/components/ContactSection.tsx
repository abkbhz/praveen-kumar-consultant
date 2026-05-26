import React, { useState } from "react";
import { Language } from "../types";
import { TRANSLATIONS } from "../data";
import { Phone, Mail, MapPin, Navigation, Clock, CheckCircle2, Send, ExternalLink } from "lucide-react";

interface ContactSectionProps {
  lang: Language;
  onAddEnquiry: (enquiry: {
    name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
  }) => Promise<void>;
}

export function ContactSection({ lang, onAddEnquiry }: ContactSectionProps) {
  const t = TRANSLATIONS[lang];

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [msg, setMsg] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !msg) return;
    setIsSubmitting(true);
    try {
      // 1. Submit to local store
      await onAddEnquiry({
        name,
        phone,
        email: email || "Not Provided",
        subject: subject || "General Financial Enquiry",
        message: msg,
      });

      // 2. Prepare mailto action to go to licpravi@gmail.com
      const mailtoSubject = encodeURIComponent(`Consultation Inquiry: ${subject || "General Inquiry"}`);
      const mailtoBody = encodeURIComponent(
        `Dear Praveen Kumar Jivana Suraksha, \n\nI am contacting you from your professional financial website regarding an enquiry.\n\n` +
        `--------------------\n` +
        `CLIENT INFORMATION:\n` +
        `Name: ${name}\n` +
        `Contact Phone: ${phone}\n` +
        `Email: ${email || "Not Provided"}\n` +
        `--------------------\n\n` +
        `ENQUIRY BODY:\n${msg}\n\n` +
        `Please get back to me as soon as possible regarding this clearance.\n\nWarm regards,\n${name}`
      );
      
      const mailtoLink = `mailto:licpravi@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
      
      // 3. Complete simulation and open email client
      setIsSuccess(true);
      
      // Delayed window open to avoid browser pop blockers
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 1500);

      // Clean inputs
      setName("");
      setPhone("");
      setEmail("");
      setSubject("");
      setMsg("");

      setTimeout(() => {
        setIsSuccess(false);
      }, 6000);

    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Maps Search URLs
  const officeMapUrl = "https://www.google.com/maps/search/?api=1&query=LIC+Housing+Finance+Ltd+Mannil+Arcade+Palakkad";
  const homeMapUrl = "https://www.google.com/maps/search/?api=1&query=Vayankara+Puthanveedu+Thachampara+Kerala";

  return (
    <div id="contact-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/50 px-3.5 py-1 rounded-full">
          {lang === "en" ? "REACH OUT TODAY" : "ബന്ധപ്പെടുക"}
        </span>
        <h2 className="font-serif text-3xl sm:text-4.5xl font-bold text-stone-900 leading-tight">
          {t.contactHeading}
        </h2>
        <p className="text-stone-500 text-sm max-w-2xl mx-auto font-light">
          {t.contactSub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Panel Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Connect Plate */}
          <div className="bg-stone-900 text-amber-50 rounded-2xl p-6 shadow-md border border-amber-550/15 border-amber-500/10 space-y-5">
            <h3 className="font-serif text-lg font-bold text-amber-300 tracking-wide pb-2 border-b border-stone-800">
              {lang === "en" ? "Immediate Contact Channels" : "നേരിട്ടുള്ള ബന്ധങ്ങൾ"}
            </h3>
            
            <div className="space-y-4">
              <a href="tel:+919847914198" className="flex items-start gap-3.5 group">
                <div className="h-9 w-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-stone-950 transition duration-300">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400">{t.phoneLabel}</p>
                  <p className="text-sm sm:text-base font-semibold group-hover:text-amber-300 transition">+91 98479 14198</p>
                  <p className="text-[11px] text-stone-400 leading-none">Available via WhatsApp & Voice calls</p>
                </div>
              </a>

              <a href="mailto:licpravi@gmail.com" className="flex items-start gap-3.5 group">
                <div className="h-9 w-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-stone-950 transition duration-300">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400">{t.emailLabel}</p>
                  <p className="text-sm sm:text-base font-semibold group-hover:text-amber-300 transition">licpravi@gmail.com</p>
                  <p className="text-[11px] text-stone-400 leading-none">Fast replies for institutional approvals</p>
                </div>
              </a>

              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Consultation Timings</p>
                  <p className="text-xs font-semibold">Monday - Saturday (09:00 AM - 06:00 PM)</p>
                  <p className="text-[11px] text-stone-400 leading-none">Sundays on urgent prior reservations only</p>
                </div>
              </div>
            </div>
          </div>

          {/* Office Registry Location Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-stone-900">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-800 border border-amber-200/50">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-base font-bold">{t.officeAddress}</h3>
            </div>
            
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">
              <strong>LIC Housing Finance Ltd</strong>, BUS STAND, II FLOOR, MANNIL ARCADE, OPP. LIC OF INDIA, BRANCH I, NEAR KSRTC, Shornur Rd, Palakkad, Kerala 678014
            </p>

            <a
              href={officeMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 hover:text-amber-600 transition"
            >
              <Navigation className="h-4 w-4" />
              {t.directionLink}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Residence Private Address Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-stone-900">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-800 border border-amber-200/50">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-base font-bold">{t.homeAddress}</h3>
            </div>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">
              <strong>Vayankara Puthanveedu</strong>, XG33+3GH, Mankurussi Temple Rd, Thachampara, Kerala 678595
            </p>

            <a
              href={homeMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 hover:text-amber-600 transition"
            >
              <Navigation className="h-4 w-4" />
              {t.directionLink}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

        </div>

        {/* Real Enquiry Form Container */}
        <div className="lg:col-span-1" /> {/* Grid offset spacer */}
        
        <div className="lg:col-span-6 bg-white border border-stone-200 shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-50 rounded-bl-full -z-10" />

          <div className="space-y-1.5 border-b border-stone-100 pb-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              {lang === "en" ? "Instant Consultation Request" : "ഉപദേശത്തിനായി അപേക്ഷിക്കാം"}
            </h3>
            <p className="text-stone-500 text-xs font-light">
              {lang === "en" ? "Submit to register your inquiry on our server database." : "ദയവായി താഴെ നൽകിയിരിക്കുന്ന ഫോമിൽ വിവരങ്ങൾ പൂരിപ്പിക്കുക."}
            </p>
          </div>

          {isSuccess ? (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-xl p-6 text-center space-y-4 animate-fadeIn">
              <div className="inline-flex h-12 w-12 rounded-full bg-amber-100 text-amber-850 items-center justify-center text-2xl font-bold">
                ✓
              </div>
              <h4 className="font-serif text-lg font-bold">{t.formSuccess}</h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                We compiled your request on the database store. Launching your systems email client to transmit the mail directly to <strong>licpravi@gmail.com</strong>...
              </p>
              <div className="text-[11px] text-amber-700 font-semibold italic">Please check mail draft window if it doesn't open immediately.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">{t.formName} *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">{t.formPhone} *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.formEmail} <span className="text-stone-400 font-normal">({lang === "en" ? "Optional" : "ആവശ്യമെങ്കിൽ മാത്രം"})</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    placeholder="ramesh@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">{t.formSubject}</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    placeholder="e.g. LIC Office Extension Loan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t.formMsg} *</label>
                <textarea
                  required
                  rows={4}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="Tell us about the property location, size of mortgage required, or generic portfolio question here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-sm font-semibold text-amber-100 py-3.5 transition shadow-lg cursor-pointer disabled:opacity-50"
              >
                <Send className="h-4 w-4 text-amber-400" />
                {t.formBtn}
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
export default ContactSection;
