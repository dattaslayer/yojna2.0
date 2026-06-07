import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Bookmark, Info, HelpCircle, DollarSign, ListTodo,
  FileCheck, ShieldCheck, Milestone, CheckCircle2, Circle, Save,
  IdCard, FileSpreadsheet, CreditCard, MapPin, Sparkles, Send, Bot, Check, Upload, ArrowRight
} from 'lucide-react';
import { Scheme, CitizenProfile, Application } from '../types';
import { calculateSchemeMatch } from '../data';

interface SchemeDetailsProps {
  scheme: Scheme;
  profile: CitizenProfile;
  applications: Application[];
  onBack: () => void;
  onOpenAssistant: () => void;
  onAddApplication: (newApp: Application) => void;
}

export default function SchemeDetails({ 
  scheme, 
  profile, 
  applications, 
  onBack, 
  onOpenAssistant,
  onAddApplication
}: SchemeDetailsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  // Application Form values
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Calculate Matches details dynamically
  const matchDetails = useMemo(() => {
    return calculateSchemeMatch(scheme, profile);
  }, [scheme, profile]);

  // Check if already applied
  const hasAlreadyApplied = useMemo(() => {
    return applications.some(app => app.schemeId === scheme.id);
  }, [applications, scheme]);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      // Add to Applications list
      const newApp: Application = {
        id: `app-${Date.now()}`,
        schemeId: scheme.id,
        schemeTitle: scheme.title,
        schemeCategory: scheme.category,
        appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Pending',
        fullName: profile.name,
        submittedFiles: {}
      };
      
      onAddApplication(newApp);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  // Icon mapping helpers for documents
  const getDocumentIcon = (doc: string) => {
    const dLower = doc.toLowerCase();
    if (dLower.includes('aadhaar')) return <IdCard className="w-4.5 h-4.5 text-primary shrink-0" />;
    if (dLower.includes('income')) return <FileSpreadsheet className="w-4.5 h-4.5 text-primary shrink-0" />;
    if (dLower.includes('passbook') || dLower.includes('bank')) return <CreditCard className="w-4.5 h-4.5 text-primary shrink-0" />;
    return <MapPin className="w-4.5 h-4.5 text-primary shrink-0" />;
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-surface">
      
      {/* Top Banner Navigation matching Screen 4 */}
      <header className="w-full sticky top-0 z-40 bg-white border-b border-outline-variant flex justify-between items-center px-container-margin h-touch-target-min">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack} 
            className="p-1 px-2.5 hover:bg-surface-container rounded-full text-primary transition-colors flex items-center justify-center"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-headline font-bold text-sm text-primary tracking-tight">Scheme Detail</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleBookmark}
            className={`p-2 rounded-full transition-all ${
              isBookmarked ? 'bg-secondary/10 text-secondary' : 'hover:bg-surface-container text-primary'
            }`}
            aria-label="Bookmark Scheme"
          >
            <Bookmark className={`w-4.5 h-4.5 ${isBookmarked ? 'fill-secondary' : ''}`} />
          </button>
          <span className="text-primary text-xs font-bold">English</span>
        </div>
      </header>

      {/* Main details body containing PMAY hero photo flow */}
      <main className="flex-1 pb-32">
        
        {/* Dynamic Scheme Hero Banner matching Screen 4 layout */}
        <div className="relative w-full h-56 md:h-64 overflow-hidden mb-6">
          <img 
            className="w-full h-full object-cover" 
            alt={scheme.title} 
            src={scheme.imageUrl}
          />
          {/* Saffron banner overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent flex flex-col justify-end p-5">
            <span className="bg-secondary-container text-on-secondary-fixed-variant px-3 py-1 rounded-full text-[10px] font-black w-fit mb-2 uppercase tracking-wide">
              {scheme.category}
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-white leading-snug">{scheme.title}</h1>
            <p className="text-primary-fixed text-xs font-bold mt-1 opacity-90">{scheme.shortDescription}</p>
          </div>
        </div>

        {/* Content Bento structures */}
        <div className="max-w-4xl mx-auto px-container-margin space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Block 1: About the Scheme description */}
            <section className="bg-white border border-outline-variant rounded-xl p-5 shadow-xs">
              <h2 className="text-sm font-extrabold text-primary mb-3 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <Info className="w-4.5 h-4.5" /> About the Scheme
              </h2>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                {scheme.longDescription}
              </p>
            </section>

            {/* Block 2: Benefits List with monetary calculations */}
            <section className="bg-white border border-outline-variant rounded-xl p-5 shadow-xs">
              <h2 className="text-sm font-extrabold text-primary mb-3 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <DollarSign className="w-4.5 h-4.5 text-secondary" /> Benefits &amp; Sanctions
              </h2>
              <div className="space-y-3.5">
                {scheme.benefitsList.map((benefit, index) => (
                  <div key={index} className="flex gap-3 items-start p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">{benefit.title}</p>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* Block 3: Dynamic Eligibility Match block matching exact checkpoints (Income, pucca house, co-owner) */}
            <section className="bg-white border border-outline-variant rounded-xl p-5 shadow-xs md:col-span-2">
              <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-2">
                <h2 className="text-sm font-extrabold text-primary flex items-center gap-2">
                  <ListTodo className="w-4.5 h-4.5 text-primary" /> Eligibility Status
                </h2>
                
                {/* Dynamically computes active match metric */}
                <div className="bg-secondary-container text-on-secondary-fixed-variant px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 fill-on-secondary text-secondary animate-pulse" />
                  {matchDetails.percentage}% Profile Match
                </div>
              </div>

              <div className="space-y-1 divide-y divide-outline-variant/30">
                {matchDetails.updatedCriteria.map((criterion) => (
                  <div key={criterion.id} className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1">
                    <div className="flex items-center gap-3">
                      {criterion.status === 'matches' ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-secondary fill-secondary-container shrink-0" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-outline shrink-0 animate-pulse" />
                      )}
                      <span className={`text-xs font-semibold ${criterion.status === 'matches' ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        {criterion.description}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold shrink-0 ${criterion.status === 'matches' ? 'text-secondary bg-secondary/10 px-2 py-0.5 rounded' : 'text-outline bg-surface-container px-2 py-0.5 rounded'}`}>
                      {criterion.status === 'matches' ? 'Matches Profile' : 'Incomplete'}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Block 4: Required Documents list with icons */}
            <section className="bg-surface-container-low border border-outline-variant rounded-xl p-5 shadow-xs">
              <h2 className="text-sm font-extrabold text-primary mb-3 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <FileCheck className="w-4.5 h-4.5 text-primary" /> Documents
              </h2>
              <ul className="space-y-3">
                {scheme.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs font-bold text-on-surface-variant">
                    {getDocumentIcon(doc)}
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </section>

          </div>

          {/* Block 5: How to Apply visual flow */}
          <section className="bg-white border border-outline-variant rounded-xl p-5 shadow-xs">
            <h2 className="text-sm font-extrabold text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <Milestone className="w-4.5 h-4.5 text-primary animate-pulse" /> Steps to Apply
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scheme.howToApply.map((step, idx) => (
                <div key={idx} className="p-3 border border-outline-variant/50 rounded-lg bg-surface/50 shadow-xs flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="text-xs font-extrabold text-on-surface">{step}</div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </main>

      {/* Floating Bottom action bar drawer matching exact design of Screen 4 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant p-4 z-40 shadow-[0_-6px_16px_rgba(0,0,0,0.06)] max-w-md mx-auto rounded-t-xl shrink-0 flex items-center gap-3">
        
        {/* Support Chat trigger */}
        <button 
          onClick={onOpenAssistant}
          className="flex-1 py-3 text-primary text-xs font-bold border-2 border-primary rounded-xl hover:bg-primary-container/20 flex items-center justify-center gap-1.5 active:scale-97 transition-all leading-none h-11 shrink-0"
        >
          <Bot className="w-4 h-4 text-primary" /> Ask Assistant
        </button>

        {/* Dynamic Apply action */}
        {hasAlreadyApplied ? (
          <button 
            disabled
            className="flex-[2] py-3 bg-secondary/20 text-secondary border border-secondary/10 cursor-not-allowed text-xs font-black rounded-xl flex items-center justify-center gap-1 h-11 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 text-secondary fill-secondary-container" /> Applied Successfully
          </button>
        ) : (
          <button 
            onClick={() => setIsApplying(true)}
            className="flex-[2] py-3 bg-primary text-white text-xs font-black rounded-xl hover:bg-primary-container transition-all active:scale-97 flex items-center justify-center gap-1 shadow-md h-11 shrink-0"
          >
            Apply Now <ArrowRight className="w-4 h-4" />
          </button>
        )}

      </footer>

      {/* Slide-Up Application Form Overlay Drawer */}
      {isApplying && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center">
          <div className="absolute inset-0" onClick={() => { if(!isSuccess) setIsApplying(false); }} />
          
          <div className="relative w-full max-w-md bg-white rounded-t-2xl shadow-2xl p-6 z-10 max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col">
            
            {!isSuccess ? (
              <form onSubmit={handleApplySubmit} className="space-y-5 leading-normal">
                <div className="flex justify-between items-center border-b border-outline-variant/40 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-primary">Apply to Scheme</h3>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{scheme.title}</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setIsApplying(false)} 
                    className="p-1 text-on-surface hover:bg-surface-container rounded-full text-sm font-bold"
                  >
                    Cancel
                  </button>
                </div>

                {/* Pre-filled identity disclosure */}
                <div className="p-3 bg-surface border border-outline-variant/60 rounded-xl space-y-1">
                  <span className="text-[9px] font-black tracking-wide text-outline block uppercase">Applicant Identity (from Vault)</span>
                  <p className="text-xs font-extrabold text-on-surface">{profile.name}</p>
                  <p className="text-[11px] text-on-surface-variant font-medium">DoB: {profile.dob} • Residence: {profile.district}, {profile.state}</p>
                </div>

                {/* Checklist to select documents from wallet */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface block px-1">Attach Documents (Select at least Aadhaar Card)</label>
                  <div className="space-y-2">
                    {scheme.requiredDocuments.map((doc, idx) => (
                      <label 
                        key={idx}
                        className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-surface-container-low/30 transition-colors ${
                          selectedDocs[doc] ? 'bg-primary-container/10 border-primary' : 'bg-white border-outline-variant/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!selectedDocs[doc]}
                          onChange={(e) => {
                            setSelectedDocs(prev => ({
                              ...prev,
                              [doc]: e.target.checked
                            }));
                          }}
                          className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-on-surface">{doc}</p>
                          <p className="text-[10px] text-secondary font-semibold flex items-center gap-1 mt-0.5">
                            <Check className="w-3.5 h-3.5 text-secondary" /> Auto-attached from verified locker
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Terms of Agreement */}
                <label className="flex gap-3 items-start cursor-pointer p-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4.5 h-4.5 mt-0.5 text-primary border-outline-variant rounded focus:ring-primary"
                    required
                  />
                  <span className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                    I hereby authorize YojnaConnect to securely release my cryptographically signed credentials to the respective state ministry databases for processing under IT Act compliance.
                  </span>
                </label>

                {/* Final Submit action */}
                <button
                  type="submit"
                  disabled={isSubmitting || !agreeTerms || !Object.values(selectedDocs).some(v => v)}
                  className="w-full h-touch-target-min bg-primary text-white font-extrabold text-sm rounded-xl shadow-md hover:bg-primary-container active:scale-97 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Confirm Submission'}
                </button>
              </form>
            ) : (
              /* Success celebrations */
              <div className="text-center py-6 space-y-4 leading-normal">
                <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto border border-secondary/20 shadow-xs">
                  <Check className="w-8 h-8 text-secondary stroke-[3px]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-primary">Application Submitted!</h3>
                  <p className="text-[11px] text-on-surface-variant font-medium mt-1 leading-relaxed">Referral ID: <strong>YC-2026-{(Math.floor(Math.random() * 90000) + 10000)}</strong></p>
                </div>
                <div className="bg-surface p-4 rounded-xl text-left border border-outline-variant/30 text-xs">
                  <p className="font-bold text-on-surface mb-1">What happens next?</p>
                  <ol className="list-decimal pl-4 text-on-surface-variant space-y-1 mt-1 font-semibold">
                    <li>Gram Panchayat / Ward registry matches credentials.</li>
                    <li>Ministry of Welfare issues verification in <strong>5 working days</strong>.</li>
                    <li>Cash support transfers directly to Bhamashah / Aadhaar Linked bank account.</li>
                  </ol>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setIsApplying(false);
                    onBack(); // Go back to refresh list on dashboard!
                  }}
                  className="w-full h-touch-target-min bg-primary text-white font-extrabold text-sm rounded-xl inline-flex items-center justify-center shadow-xs"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
