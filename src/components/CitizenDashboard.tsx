import React, { useState, useMemo } from 'react';
import { 
  Landmark, Languages, Home, BookOpen, FolderOpen, User, 
  Sprout, GraduationCap, Building2, HeartPulse, Sparkles, 
  CheckCircle, ChevronRight, AlertCircle, 
  Search, Upload, FileText, Trash2, Eye, ShieldAlert, BadgeCheck
} from 'lucide-react';
import { CitizenProfile, Scheme, Application } from '../types';
import { SCHEMES_DATABASE, calculateSchemeMatch, INCOME_RANGES, STATES_AND_DISTRICTS } from '../data';

interface CitizenDashboardProps {
  profile: CitizenProfile;
  setProfile: React.Dispatch<React.SetStateAction<CitizenProfile>>;
  applications: Application[];
  onSelectScheme: (scheme: Scheme) => void;
  onOpenAssistant: () => void;
}

type ActiveTab = 'home' | 'schemes' | 'documents' | 'profile';

export default function CitizenDashboard({ 
  profile, 
  setProfile, 
  applications, 
  onSelectScheme,
  onOpenAssistant 
}: CitizenDashboardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [schemeSearchQuery, setSchemeSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Document Vault State
  const [uploadedDocuments, setUploadedDocuments] = useState<{ id: string; name: string; size: string; status: string }[]>([
    { id: '1', name: 'Aadhaar_Card_Verified.pdf', size: '1.2 MB', status: 'Verified' },
    { id: '2', name: 'Income_Certificate_2025.pdf', size: '850 KB', status: 'Verified' },
    { id: '3', name: 'Bank_Passbook_Front.jpg', size: '2.1 MB', status: 'Verified' }
  ]);
  const [isDragging, setIsDragging] = useState(false);

  // Dynamic calculations based on current Profile
  const schemeMatchResults = useMemo(() => {
    return SCHEMES_DATABASE.map(scheme => {
      const match = calculateSchemeMatch(scheme, profile);
      return {
        scheme,
        percentage: match.percentage,
        matchedCount: match.matchedCount,
        totalCount: match.totalCount
      };
    });
  }, [profile]);

  const totalSchemesCount = SCHEMES_DATABASE.length;
  
  // Calculate aggregate estimates
  const matchedSchemesSummary = useMemo(() => {
    const matched = schemeMatchResults.filter(match => match.percentage >= 50);
    const totalBenefit = matched.reduce((sum, match) => sum + match.scheme.estimatedBenefitVal, 0);
    return {
      count: matched.length,
      estimatedBenefit: totalBenefit
    };
  }, [schemeMatchResults]);

  // Handle Document Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc = {
        id: Date.now().toString(),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'Pending Verification'
      };
      setUploadedDocuments(prev => [...prev, newDoc]);
    }
  };

  const deleteDocument = (id: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Categories list
  const categories = ['All', 'Housing', 'Agriculture', 'Health', 'Education', 'Welfare'];

  // Match icon helper
  const getCategoryIcon = (slug: string, className = "w-5 h-5") => {
    switch (slug) {
      case 'housing': return <Building2 className={`${className} text-primary`} />;
      case 'agriculture': return <Sprout className={`${className} text-secondary`} />;
      case 'health': return <HeartPulse className={`${className} text-error`} />;
      case 'education': return <GraduationCap className={`${className} text-tertiary`} />;
      default: return <FileText className={`${className} text-blue-500`} />;
    }
  };

  // Tab 1: Home View
  const renderHomeTab = () => (
    <div className="space-y-6 fade-in animate-slide-up leading-normal">
      
      {/* Welcome Section */}
      <section className="flex flex-col gap-1 px-1">
        <h2 className="text-xl md:text-2xl font-extrabold text-on-surface">Namaste, {profile.name}</h2>
        <p className="text-xs text-on-surface-variant font-medium">Here is your scheme dashboard for today.</p>
      </section>

      {/* Bento Match Summary Card matching exact Screen 3 Design */}
      <section className="relative overflow-hidden bg-primary p-card-padding rounded-xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-primary-container">
        
        {/* Count Block */}
        <div className="flex flex-col gap-1 z-10 w-full md:w-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-fixed opacity-90">Match Summary</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold">{matchedSchemesSummary.count}</span>
            <span className="text-sm font-semibold text-primary-fixed-dim">Schemes Found</span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block h-12 w-px bg-white/20" />
        <div className="block md:hidden h-px w-full bg-white/10" />

        {/* Benefit Block */}
        <div className="flex flex-col gap-1 z-10 w-full md:w-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-fixed opacity-90">Estimated Monthly Savings</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold">₹{(matchedSchemesSummary.estimatedBenefit / 12).toLocaleString([], {maximumFractionDigits:0})}</span>
            <span className="text-xs font-semibold text-primary-fixed-dim">/month avg</span>
          </div>
        </div>

        {/* Star Sparkle Overlay */}
        <div className="absolute right-4 -bottom-4 opacity-15 pointer-events-none">
          <Sparkles className="w-28 h-28" />
        </div>
      </section>

      {/* Profile Completion Nudge matching exact Screen 3 structure */}
      <section className="bg-surface-container rounded-xl p-5 border border-outline-variant shadow-xs">
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping shrink-0" />
            <span className="text-xs font-extrabold text-on-surface flex items-center gap-1.5">
              Profile Completeness
            </span>
          </div>
          <span className="text-xs font-black text-primary">85%</span>
        </div>
        <div className="w-full bg-outline-variant/30 h-2.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: '85%' }} />
        </div>
        <div className="mt-4 flex justify-between items-end gap-2">
          <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed max-w-[70%]">
            Add female head co-owner status or cast documents to unlock <strong>2 additional schemes</strong> list instantly.
          </p>
          <button 
            onClick={() => setActiveTab('profile')} 
            className="text-xs text-primary font-black hover:underline shrink-0 pb-0.5"
          >
            Complete Now
          </button>
        </div>
      </section>

      {/* Recommended Schemes - Horizontal scrolling list */}
      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-base font-extrabold text-on-surface flex items-center gap-2">
            Recommended for You <span className="bg-secondary-container text-on-secondary-fixed-variant px-2 py-0.5 rounded-full text-[10px] font-black">{matchedSchemesSummary.count} Perfect Matches</span>
          </h3>
          <button 
            onClick={() => { setActiveTab('schemes'); setSelectedCategory('All'); }} 
            className="text-xs font-bold text-primary hover:underline"
          >
            View All
          </button>
        </div>

        {/* Scroll Row */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 hide-scrollbar -mx-4 px-4">
          {schemeMatchResults.map(({ scheme, percentage }) => (
            <div 
              key={scheme.id}
              onClick={() => onSelectScheme(scheme)}
              className="min-w-[290px] max-w-[290px] bg-white border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-97 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center border border-outline-variant/30">
                    {getCategoryIcon(scheme.categorySlug)}
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    percentage >= 80 
                      ? 'bg-secondary-container text-on-secondary-fixed-variant' 
                      : 'bg-primary-container text-primary'
                  }`}>
                    {percentage}% Match
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface mb-1 truncate">{scheme.title}</h4>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">{scheme.shortDescription}</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectScheme(scheme);
                }}
                className="mt-5 w-full py-2.5 bg-primary text-white rounded-lg text-xs font-extrabold shadow-sm hover:bg-primary-container transition-colors active:scale-95 duration-150"
              >
                Check Eligibility
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Applications matching exact design block of Screen 3 */}
      <section className="flex flex-col gap-3">
        <h3 className="text-base font-extrabold text-on-surface px-1">Recent Applications</h3>
        
        <div className="bg-white border border-outline-variant rounded-xl divide-y divide-outline-variant/40 shadow-sm overflow-hidden">
          {applications.map((app) => (
            <div 
              key={app.id} 
              className="p-4 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant border border-outline-variant/10">
                  {getCategoryIcon(app.schemeCategory, "w-4.5 h-4.5")}
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">{app.schemeTitle}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Applied on {app.appliedDate}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                app.status === 'Approved' 
                  ? 'bg-secondary/15 text-secondary border-secondary/20' 
                  : app.status === 'Pending'
                  ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary/20'
                  : 'bg-error/10 text-error border-error/20'
              }`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>

        <button 
          onClick={onOpenAssistant}
          className="w-full py-3.5 border-2 border-dashed border-outline-variant text-primary font-bold text-xs rounded-xl hover:bg-surface-container-low/40 active:scale-98 transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-4.5 h-4.5 text-secondary fill-secondary animate-pulse" /> Ask AI to Assist in Applications
        </button>
      </section>

    </div>
  );

  // Tab 2: Schemes Directory View (Expanded Filter and Search)
  const renderSchemesTab = () => {
    const filteredSchemes = schemeMatchResults.filter(({ scheme }) => {
      const matchesSearch = scheme.title.toLowerCase().includes(schemeSearchQuery.toLowerCase()) || 
                            scheme.shortDescription.toLowerCase().includes(schemeSearchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return (
      <div className="space-y-6 fade-in animate-slide-up leading-normal">
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-primary">Schemes Directory</h2>
          <p className="text-xs text-on-surface-variant font-medium">Browse, search, and compare hundreds of welfare schemes.</p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input
            type="text"
            value={schemeSearchQuery}
            onChange={(e) => setSchemeSearchQuery(e.target.value)}
            placeholder="Search schemes e.g. housing, seeds, health..."
            className="w-full pl-10 pr-4 h-11 bg-white border border-outline-variant rounded-xl focus:border-primary outline-none text-xs font-semibold"
          />
        </div>

        {/* Category filters row */}
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold shrink-0 border transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-white text-on-surface border-outline-variant/60 hover:bg-surface-container'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Schemes list */}
        <div className="space-y-4">
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map(({ scheme, percentage }) => (
              <div 
                key={scheme.id}
                onClick={() => onSelectScheme(scheme)}
                className="bg-white border border-outline-variant rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col md:flex-row gap-4 items-stretch justify-between"
              >
                <div className="flex gap-3 md:flex-1">
                  <div className="w-12 h-12 rounded-xl bg-surface-container shrink-0 flex items-center justify-center border border-outline-variant/20 self-start">
                    {getCategoryIcon(scheme.categorySlug, "w-6 h-6")}
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-primary px-2 py-0.5 bg-primary-container/20 rounded-full">{scheme.category}</span>
                    <h4 className="font-extrabold text-sm text-on-surface mt-1">{scheme.title}</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed mt-1 line-clamp-2">{scheme.shortDescription}</p>
                    <p className="text-[11px] text-secondary font-extrabold mt-2 flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5" /> Estimated Benefit: {scheme.estimatedBenefitText}
                    </p>
                  </div>
                </div>

                <div className="flex md:flex-col justify-between items-center md:items-end border-t md:border-t-0 border-outline-variant/40 pt-3 md:pt-0 shrink-0">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                    percentage >= 80 
                      ? 'bg-secondary-container text-on-secondary-fixed-variant' 
                      : 'bg-primary-container text-primary'
                  }`}>
                    {percentage}% Match
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelectScheme(scheme); }}
                    className="py-1.5 px-4 bg-primary text-white text-xs font-extrabold rounded-lg hover:bg-primary-container active:scale-95 transition-all mt-3"
                  >
                    Check
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 bg-surface-container rounded-xl border border-dashed border-outline-variant">
              <AlertCircle className="w-8 h-8 text-outline mx-auto mb-2" />
              <p className="text-sm font-bold text-on-surface">No schemes found</p>
              <p className="text-xs text-on-surface-variant mt-1">Please try modifying your search, filter or update profile parameters.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tab 3: Documents Vault View
  const renderDocumentsTab = () => (
    <div className="space-y-6 fade-in animate-slide-up leading-normal">
      <div className="space-y-2">
        <h2 className="text-xl font-extrabold text-primary">Your Document Vault</h2>
        <p className="text-xs text-on-surface-variant font-medium">Verified credentials used to instantly auto-fill government schemes applications.</p>
      </div>

      {/* Safety Alert */}
      <div className="bg-[#fff9e6] border border-[#ffe0b3] p-4 rounded-xl flex gap-3 items-start">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-900">DigiLocker Synced Wallet</p>
          <p className="text-[10px] text-amber-800 leading-relaxed mt-0.5">Documents here are cryptographically signed by issuing authorities and accepted at equal status to paper records under IT Act Section 4.</p>
        </div>
      </div>

      {/* File Vault Lists */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-on-surface px-1 uppercase tracking-wider text-outline">Verified Credentials</h3>
        
        {uploadedDocuments.map((doc) => (
          <div 
            key={doc.id}
            className="p-4 bg-white border border-outline-variant rounded-xl flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-container/10 text-primary rounded-lg flex items-center justify-center border border-primary/15">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">{doc.name}</p>
                <p className="text-[10px] text-on-surface-variant flex items-center gap-1.5 font-semibold mt-0.5">
                  <span>{doc.size}</span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant" />
                  <span className="text-secondary flex items-center gap-0.5"><BadgeCheck className="w-3.5 h-3.5 fill-secondary text-white" /> Verified</span>
                </p>
              </div>
            </div>

            <div className="flex gap-1.5">
              <button 
                onClick={() => alert(`Viewing document: ${doc.name}`)}
                className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant"
                aria-label="View Document"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button 
                onClick={() => deleteDocument(doc.id)}
                className="p-2 hover:bg-error/10 rounded-full text-error"
                aria-label="Delete Document"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Drag & Drop Vault Area */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const newDoc = {
              id: Date.now().toString(),
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              status: 'Uploaded'
            };
            setUploadedDocuments(prev => [...prev, newDoc]);
          }
        }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging ? 'bg-primary-container/10 border-primary' : 'bg-white border-outline-variant hover:bg-surface-container-low/20'
        }`}
      >
        <Upload className="w-8 h-8 text-outline mx-auto mb-3" />
        <p className="text-xs font-bold text-on-surface">Upload new document</p>
        <p className="text-[10px] text-on-surface-variant mt-1">Supports PDF, JPEG, PNG down to 10 MB. Accept drag-and-drop.</p>
        
        <label className="mt-4 inline-block px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-primary-container active:scale-95 transition-all shadow-xs">
          Browse Files
          <input 
            type="file" 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".pdf,.png,.jpg,.jpeg" 
          />
        </label>
      </div>
    </div>
  );

  // Tab 4: Profile & Recalculate Matching Screen
  const renderProfileTab = () => (
    <div className="space-y-6 fade-in animate-slide-up leading-normal">
      <div className="space-y-2">
        <h2 className="text-xl font-extrabold text-primary">Your Citizen Profile</h2>
        <p className="text-xs text-on-surface-variant font-medium">Keep your registration details accurate to ensure precise scheme criteria routing.</p>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm space-y-5">
        
        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant">Your Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs font-bold focus:border-primary outline-none"
          />
        </div>

        {/* Occupation Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant">Occupation Sector</label>
          <select
            value={profile.occupation}
            onChange={(e: any) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
            className="w-full px-3 h-10 border border-outline-variant rounded-lg text-xs font-bold focus:border-primary outline-none"
          >
            <option value="farmer">Farmer / Agriculturalist</option>
            <option value="student">Student / Aspirant</option>
            <option value="worker">Manual Laborer / Worker</option>
            <option value="unemployed">Unemployed</option>
            <option value="other">Other Professionals</option>
          </select>
        </div>

        {/* State / District Select selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant">Home State</label>
            <select
              value={profile.state}
              onChange={(e) => setProfile(prev => ({ ...prev, state: e.target.value }))}
              className="w-full px-3 h-10 border border-outline-variant rounded-lg text-xs font-bold focus:border-primary outline-none"
            >
              {Object.keys(STATES_AND_DISTRICTS).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant">District</label>
            <select
              value={profile.district}
              onChange={(e) => setProfile(prev => ({ ...prev, district: e.target.value }))}
              className="w-full px-3 h-10 border border-outline-variant rounded-lg text-xs font-bold focus:border-primary outline-none"
            >
              {(STATES_AND_DISTRICTS[profile.state] || []).map((ds) => (
                <option key={ds} value={ds}>{ds}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Income index selector */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-on-surface-variant">
            <span>Estimated Monthly Income</span>
            <span className="text-primary">{INCOME_RANGES[profile.incomeRangeIndex]}</span>
          </div>
          <input
            type="range"
            min="0"
            max={INCOME_RANGES.length - 1}
            value={profile.incomeRangeIndex}
            onChange={(e) => setProfile(prev => ({ ...prev, incomeRangeIndex: parseInt(e.target.value) }))}
            className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

      </div>

      <div className="text-center p-4 bg-secondary-container/10 border border-secondary/10 rounded-xl text-xs font-semibold text-secondary flex items-center gap-2 justify-center">
        <CheckCircle className="w-5 h-5 text-secondary" /> Matching metrics were recalculated dynamically.
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col min-h-screen bg-surface">
      
      {/* Dynamic Header */}
      <header className="w-full sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-container-margin h-touch-target-min">
        <div className="flex items-center gap-2">
          <Landmark className="text-primary w-5 h-5" />
          <h1 className="font-headline font-bold text-base text-primary tracking-tight">YojnaConnect</h1>
        </div>
        <button className="font-bold text-[11px] text-primary bg-primary-container/15 px-3 py-1 rounded-full hover:bg-surface-container-low transition-colors duration-100">
          English
        </button>
      </header>

      {/* Primary Sub-panel content depending on chosen Tab */}
      <main className="flex-1 max-w-5xl mx-auto px-container-margin py-6 w-full pb-24">
        {activeTab === 'home' && renderHomeTab()}
        {activeTab === 'schemes' && renderSchemesTab()}
        {activeTab === 'documents' && renderDocumentsTab()}
        {activeTab === 'profile' && renderProfileTab()}
      </main>

      {/* Sticky Institutional Bottom Bar matching exact Navigation specs */}
      <nav className="fixed bottom-0 left-0 right-0 w-full z-40 bg-white border-t border-outline-variant shadow-lg flex justify-around items-center h-16 px-1 rounded-t-xl max-w-md mx-auto">
        
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 active:scale-90 transition-transform ${
            activeTab === 'home' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <Home className={`w-5.5 h-5.5 ${activeTab === 'home' ? 'text-primary fill-primary/10' : ''}`} />
          <span className="text-[10px] font-black mt-1">Home</span>
        </button>

        {/* Schemes */}
        <button
          onClick={() => setActiveTab('schemes')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 active:scale-90 transition-transform ${
            activeTab === 'schemes' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <BookOpen className={`w-5.5 h-5.5 ${activeTab === 'schemes' ? 'text-primary fill-primary/10' : ''}`} />
          <span className="text-[10px] font-black mt-1">Schemes</span>
        </button>

        {/* Documents */}
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 active:scale-90 transition-transform ${
            activeTab === 'documents' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <FolderOpen className={`w-5.5 h-5.5 ${activeTab === 'documents' ? 'text-primary fill-primary/10' : ''}`} />
          <span className="text-[10px] font-black mt-1">Documents</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 active:scale-90 transition-transform ${
            activeTab === 'profile' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <User className={`w-5.5 h-5.5 ${activeTab === 'profile' ? 'text-primary fill-primary/10' : ''}`} />
          <span className="text-[10px] font-black mt-1">Profile</span>
        </button>

      </nav>

    </div>
  );
}
