import React, { useState, useEffect } from 'react';
import { Landmark, Languages, ArrowRight, ArrowLeft, User, Calendar, MapPin, Sprout, GraduationCap, HardHat, Check } from 'lucide-react';
import { CitizenProfile } from '../types';
import { INCOME_RANGES, STATES_AND_DISTRICTS } from '../data';

interface ProfileBuilderProps {
  onProfileComplete: (profile: CitizenProfile) => void;
}

export default function ProfileBuilder({ onProfileComplete }: ProfileBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('Rajesh Kumar'); // Default value as premium placeholder
  const [dob, setDob] = useState('1988-08-15'); // 30+ year old default to show valid flow
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('male');
  const [selectedState, setSelectedState] = useState('Maharashtra'); // Default as shown in spec
  const [selectedDistrict, setSelectedDistrict] = useState('Pune'); // Default as shown in spec
  const [occupation, setOccupation] = useState<'farmer' | 'student' | 'worker' | 'unemployed' | 'other' | ''>('farmer');
  const [incomeRangeIndex, setIncomeRangeIndex] = useState(1); // ₹5k-15k matches standard citizen tier
  const [validationError, setValidationError] = useState('');

  // Auto-adjust district if state changes
  useEffect(() => {
    if (STATES_AND_DISTRICTS[selectedState]) {
      const districts = STATES_AND_DISTRICTS[selectedState];
      if (!districts.includes(selectedDistrict)) {
        setSelectedDistrict(districts[0]);
      }
    }
  }, [selectedState]);

  const handleNextStep = () => {
    setValidationError('');
    
    if (currentStep === 1) {
      if (!name.trim()) {
        setValidationError('Please enter your full name.');
        return;
      }
      if (!dob) {
        setValidationError('Please select your date of birth.');
        return;
      }
      if (!gender) {
        setValidationError('Please select your gender.');
        return;
      }
      if (selectedState === 'Select State' || !selectedState) {
        setValidationError('Please select your State.');
        return;
      }
      if (selectedDistrict === 'Select District' || !selectedDistrict) {
        setValidationError('Please select your District.');
        return;
      }
      
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!occupation) {
        setValidationError('Please select your primary occupation.');
        return;
      }

      // Profile Complete, bundle and pass back
      const consolidatedProfile: CitizenProfile = {
        name,
        dob,
        gender,
        state: selectedState,
        district: selectedDistrict,
        occupation,
        incomeRangeIndex
      };
      onProfileComplete(consolidatedProfile);
    }
  };

  const handleBackStep = () => {
    setValidationError('');
    if (currentStep > 1) {
      setCurrentStep(1);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-surface">
      
      {/* Top Banner Navigation */}
      <header className="w-full sticky top-0 z-50 bg-white border-b border-outline-variant flex justify-between items-center px-container-margin h-touch-target-min">
        <div className="flex items-center gap-2">
          <Landmark className="text-primary w-5 h-5" />
          <h1 className="font-headline font-bold text-base text-primary tracking-tight">YojnaConnect</h1>
        </div>
        <button className="text-primary font-bold text-xs flex items-center gap-1 hover:bg-surface-container-low transition-colors px-3 py-1 rounded-full border border-primary/10">
          <Languages className="w-3.5 h-3.5" />
          English
        </button>
      </header>

      {/* Progress Stepper matching exactly Screen 2 design */}
      <nav className="bg-white px-container-margin pt-6 pb-4 border-b border-outline-variant">
        <div className="max-w-md mx-auto flex items-center justify-between relative">
          
          {/* Connector Line Base */}
          <div className="absolute top-[15px] left-0 w-full h-[3px] bg-outline-variant/30 z-0 rounded-full" />
          
          {/* Dynamic filled logic */}
          <div 
            className="absolute top-[15px] left-0 h-[3px] bg-primary z-0 transition-all duration-500 rounded-full" 
            style={{ width: currentStep === 1 ? '16%' : '50%' }}
          />

          {/* Step 1 Indicator */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all duration-300 ${
              currentStep > 1 ? 'bg-secondary text-white' : 'bg-primary text-white scale-105'
            }`}>
              {currentStep > 1 ? <Check className="w-4 h-4 text-white" /> : '1'}
            </div>
            <span className={`text-[10px] font-bold ${currentStep === 1 ? 'text-primary' : 'text-on-surface-variant'}`}>Personal</span>
          </div>

          {/* Step 2 Indicator */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
              currentStep === 2 
                ? 'bg-primary text-white border-primary scale-105 shadow-sm' 
                : 'bg-surface-container-highest text-on-surface-variant border-transparent'
            }`}>
              2
            </div>
            <span className={`text-[10px] font-bold ${currentStep === 2 ? 'text-primary' : 'text-on-surface-variant'}`}>Occupation</span>
          </div>

          {/* Step 3 (Confirmation Placeholder) */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-bold text-xs border border-transparent">
              3
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant">Finish</span>
          </div>

        </div>
      </nav>

      {/* Main Form Fields Container */}
      <main className="flex-1 px-container-margin py-6 max-w-md mx-auto w-full pb-28">
        
        {validationError && (
          <div className="bg-error-container text-on-error-container p-3 rounded-xl text-xs font-semibold mb-4 border border-error/15">
            {validationError}
          </div>
        )}

        {currentStep === 1 ? (
          
          /* STEP 1: Personal View */
          <section className="space-y-6 fade-in animate-slide-up">
            
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-primary">Let's get to know you</h2>
              <p className="text-xs text-on-surface-variant font-medium">Tell us a bit about yourself to find matching government schemes.</p>
            </div>

            <div className="space-y-5">
              
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant block px-1" htmlFor="user-name">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4.5 h-4.5" />
                  <input
                    type="text"
                    id="user-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-touch-target-min pl-11 pr-4 bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              {/* DOB Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant block px-1" htmlFor="user-dob">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4.5 h-4.5" />
                  <input
                    type="date"
                    id="user-dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full h-touch-target-min pl-11 pr-4 bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Gender Grid matching exact design block of Image 2 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant block px-1">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all active:scale-95 ${
                      gender === 'male' 
                        ? 'border-primary bg-primary-container/20 text-primary font-bold' 
                        : 'border-outline-variant bg-white hover:border-primary-container text-on-surface'
                    }`}
                  >
                    <span className="text-xl font-bold mb-1">♂</span>
                    <span className="text-xs font-semibold">Male</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all active:scale-95 ${
                      gender === 'female' 
                        ? 'border-primary bg-primary-container/20 text-primary font-bold' 
                        : 'border-outline-variant bg-white hover:border-primary-container text-on-surface'
                    }`}
                  >
                    <span className="text-xl font-bold mb-1">♀</span>
                    <span className="text-xs font-semibold">Female</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('other')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all active:scale-95 ${
                      gender === 'other' 
                        ? 'border-primary bg-primary-container/20 text-primary font-bold' 
                        : 'border-outline-variant bg-white hover:border-primary-container text-on-surface'
                    }`}
                  >
                    <span className="text-xl font-bold mb-1">⚦</span>
                    <span className="text-xs font-semibold">Other</span>
                  </button>
                </div>
              </div>

              {/* Location Grid with Cascade State/District Selector */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant block px-1">
                    State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full h-touch-target-min px-3 bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary font-bold outline-none text-xs transition-all"
                  >
                    {Object.keys(STATES_AND_DISTRICTS).map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant block px-1">
                    District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full h-touch-target-min px-3 bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary font-bold outline-none text-xs transition-all"
                  >
                    {(STATES_AND_DISTRICTS[selectedState] || []).map((ds) => (
                      <option key={ds} value={ds}>{ds}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

          </section>

        ) : (
          
          /* STEP 2: Occupation View */
          <section className="space-y-6 fade-in animate-slide-up">
            
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-primary">What do you do?</h2>
              <p className="text-xs text-on-surface-variant font-medium">Your occupation helps us find specific grants and benefits.</p>
            </div>

            <div className="space-y-6">
              
              {/* Occupation items stacked list as shown in Screen 2 */}
              <div className="grid grid-cols-1 gap-3">
                
                {/* Farmer Option */}
                <button
                  type="button"
                  onClick={() => setOccupation('farmer')}
                  className={`flex items-center p-4 gap-4 rounded-xl border-2 hover:border-primary transition-all active:scale-98 text-left ${
                    occupation === 'farmer' ? 'border-primary bg-primary-container/10' : 'border-outline-variant bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center transition-colors ${
                    occupation === 'farmer' ? 'bg-secondary text-white' : 'bg-secondary-container text-on-secondary-fixed-variant'
                  }`}>
                    <Sprout className="w-5.5 h-5.5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-xs text-on-surface">Farmer / Agriculture</p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Benefits for land, irrigation and seeds</p>
                  </div>
                  {occupation === 'farmer' && <Check className="w-5 h-5 text-primary shrink-0 ml-auto" />}
                </button>

                {/* Student Option */}
                <button
                  type="button"
                  onClick={() => setOccupation('student')}
                  className={`flex items-center p-4 gap-4 rounded-xl border-2 hover:border-primary transition-all active:scale-98 text-left ${
                    occupation === 'student' ? 'border-primary bg-primary-container/10' : 'border-outline-variant bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center transition-colors ${
                    occupation === 'student' ? 'bg-primary text-white' : 'bg-primary-fixed text-on-primary-fixed-variant'
                  }`}>
                    <GraduationCap className="w-5.5 h-5.5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-xs text-on-surface">Student</p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Scholarships, laptops and skill training</p>
                  </div>
                  {occupation === 'student' && <Check className="w-5 h-5 text-primary shrink-0 ml-auto" />}
                </button>

                {/* Worker Option */}
                <button
                  type="button"
                  onClick={() => setOccupation('worker')}
                  className={`flex items-center p-4 gap-4 rounded-xl border-2 hover:border-primary transition-all active:scale-98 text-left ${
                    occupation === 'worker' ? 'border-primary bg-primary-container/10' : 'border-outline-variant bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center transition-colors ${
                    occupation === 'worker' ? 'bg-tertiary text-white' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                  }`}>
                    <HardHat className="w-5.5 h-5.5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-xs text-on-surface">Worker / Labor</p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Social security, wages and health support</p>
                  </div>
                  {occupation === 'worker' && <Check className="w-5 h-5 text-primary shrink-0 ml-auto" />}
                </button>

              </div>

              {/* Monthly Income Slider section */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/50">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-on-surface-variant">Estimated Monthly Income</label>
                  <span className="px-3 py-1 bg-primary-container text-on-primary-container text-xs font-extrabold rounded-full shadow-xs">
                    {INCOME_RANGES[incomeRangeIndex]}
                  </span>
                </div>
                
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max={INCOME_RANGES.length - 1}
                    value={incomeRangeIndex}
                    onChange={(e) => setIncomeRangeIndex(parseInt(e.target.value))}
                    className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-3 text-[9px] text-outline font-extrabold uppercase tracking-wider">
                    <span>Lower</span>
                    <span>Middle</span>
                    <span>Higher</span>
                  </div>
                </div>
              </div>

            </div>

          </section>

        )}

      </main>

      {/* Fixed bottom action area layout */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant p-container-margin z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex gap-4">
          
          <button
            type="button"
            onClick={handleBackStep}
            className={`h-touch-target-min px-6 rounded-xl border border-outline text-primary font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-1 hover:bg-surface-container-low ${
              currentStep === 1 ? 'invisible w-0 p-0 overflow-hidden' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className="flex-1 h-touch-target-min bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            <span>{currentStep === 1 ? 'Next Step' : 'Find Schemes'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </footer>

    </div>
  );
}
