import React, { useState } from 'react';
import { Landmark, ShieldCheck, Zap, ArrowRight, Languages, Check, Phone } from 'lucide-react';

interface WelcomeScreenProps {
  onLoginSuccess: (mobile: string) => void;
}

type Language = 'english' | 'hindi' | 'kannada' | 'tamil';

export default function WelcomeScreen({ onLoginSuccess }: WelcomeScreenProps) {
  const [mobile, setMobile] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>('english');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const languagesList = [
    { id: 'english' as Language, label: 'ENGLISH', native: 'English', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATsMbFYho099RWheyg-GqWcjpCLh3VfLqVXpti5t2WtyL4NcQP4pHibWZ2vNLVVwKMyYovyeo5p6Dz7LjewfpPXvLG1_GPwnkm5sJgiw4vrgpBpyP12AQKzRXdxOQ-VTIy4ysO5wjNhyVu5Qm0TxKe1adY_0qbzT8QMdLhIXLt5fUPUEbBSMZtedZZyR6QyEyj_PTfd5H-fQblQ3lN3LEHOI11NcVvo1R5eqOLf5hAYQYerlXFfTHDbqbSwgf7s460CAjurL2176bg' },
    { id: 'hindi' as Language, label: 'हिन्दी', native: 'Hindi', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSqFIpOpYmzzT-XsxNSVxhZ7vX2rmEevtDUFN_nUG-K1cT46p6316PsV2Ml_5CV8HY8B15z_f3y_RAcbmyWkVYBFSpMncDq9nk5pJomITqxxWrpxUl2tRk2F33OcRb2lJXLRufXEKPX3d1DlaakdI-pOLf_012L5nMLDRZZRXsfqhJV-TGHluyeGmQ_BBlwH74vrYtQXUKQd0MRQ9csJnuy6AaCj_n_aHLKckH2gZUS7Stf3IluzOWg2kx8cAga8brSHkekqwxJ1lo' },
    { id: 'kannada' as Language, label: 'ಕನ್ನಡ', native: 'Kannada', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjasSVQTNg1UCrUQ521MaMD6mY65VVcB4nNQZyTtlInzvzbdv006HbqDLeA6gMqmnMA6fMmldVmCCnhqrQ4P5enxI54PK64OTxqKForzcUZ_7YfrjriKUVDIcLVHQewc6RrBBSik_8H30y8sDbMYyFZFBEnpYroMm7pturESKPfaN_DKgs-ZyN40StqJorlOVxPtmzTgaiMJqvwlnjwBNJdHEU8fh9Nrgjq4YIkLh_6gUH3OBQeyqSfQA1LshCC94mp6ITlYeYg-Xk' },
    { id: 'tamil' as Language, label: 'தமிழ்', native: 'Tamil', flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-deeDRA8heuHxQ0tJPXluuHliPxXEO7sWCH0qcb4PGj0azh-gS2zXUszXW3Le9XtYPycAeSWneiF0MXgK7Jsmr_1flkzaDHaD-adInKHVKq9bpYV3MPOMbfuEnQYVs2VzvcLMREvAzuCigh2QBhDk2EiVDF1afJC3p9ubtH5Xo4bh-hFsYNmfXd1ib26zG2aBL4A8azEAB6VXDT6tM2zVRmnpvHby_65AL4hDIhXLg0e6sopo8jcPIb0cCP7HWucjEYFPsdVSAFzr' }
  ];

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    // Simulate API call to send OTP
    setTimeout(() => {
      setIsOtpSent(true);
      setIsLoading(false);
    }, 1200);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (otpCode.trim() === '') {
      setErrorMessage('Please enter the verification code.');
      return;
    }

    setIsLoading(true);
    // Simulate Verification
    setTimeout(() => {
      setIsLoading(false);
      // Let random or "1234" OTP slide
      onLoginSuccess(mobile);
    }, 1000);
  };

  const getLanguageLabel = () => {
    const lang = languagesList.find(l => l.id === selectedLang);
    return lang ? lang.native : 'English';
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      
      {/* Dynamic Header */}
      <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-container-margin h-touch-target-min">
        <div className="flex items-center gap-2">
          <Landmark className="text-primary w-6 h-6" />
          <h1 className="font-headline font-bold text-lg text-primary tracking-tight">YojnaConnect</h1>
        </div>
        <div id="language-selector-button" className="flex items-center gap-1.5 text-primary bg-primary-container/10 px-3 py-1 rounded-full text-xs font-semibold">
          <Languages className="w-3.5 h-3.5" />
          <span>{getLanguageLabel()}</span>
        </div>
      </header>

      {/* Main Grid: Responsive Splitting for Desktop vs Mobile as per image 1 */}
      <main className="w-full max-w-5xl flex-grow flex flex-col items-center justify-center px-container-margin py-8 lg:py-16 lg:flex-row lg:gap-14 leading-normal">
        
        {/* Left Side: Welcoming Hero Description */}
        <section className="flex-1 text-center lg:text-left mb-10 lg:mb-0">
          <div className="mb-4 inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-fixed-variant px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-secondary anim-pulse" />
            Government of India Initiative
          </div>
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-primary mb-4 leading-tight tracking-tight">
            Your gateway to all <br className="hidden md:block" />government benefits
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Access 500+ central and state welfare schemes. Simplify your application process with a secure, digital-first approach.
          </p>

          {/* Bento trust boxes */}
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex flex-col items-start gap-1.5 hover:shadow-xs transition-shadow">
              <ShieldCheck className="text-primary w-6 h-6" />
              <span className="font-bold text-xs text-primary">Secure &amp; Encrypted</span>
              <span className="text-[10px] text-on-surface-variant leading-snug">State-of-the-art cryptographic safety</span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex flex-col items-start gap-1.5 hover:shadow-xs transition-shadow">
              <Zap className="text-primary w-6 h-6" />
              <span className="font-bold text-xs text-primary">Fast Processing</span>
              <span className="text-[10px] text-on-surface-variant leading-snug">Direct cash disbursal in 45 days</span>
            </div>
          </div>
        </section>

        {/* Right Side: Login Panel */}
        <section className="w-full max-w-md h-fit">
          <div className="glass-card p-6 md:p-8 rounded-2xl shadow-xl flex flex-col gap-6 bg-white border border-outline-variant">
            
            {/* Title */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary">Login to Portal</h3>
              <p className="text-xs text-on-surface-variant mt-1.5 font-medium">
                {isOtpSent ? 'Verify code sent to your phone' : 'Enter your mobile number to receive OTP'}
              </p>
            </div>

            {/* Language Tabs matching flag selectors from Image 1 */}
            {!isOtpSent && (
              <div className="flex justify-between items-center gap-1.5 pb-4 border-b border-outline-variant">
                {languagesList.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLang(lang.id)}
                    className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                      selectedLang === lang.id 
                        ? 'bg-primary-container-variant border border-primary/20 shadow-xs' 
                        : 'hover:bg-outline-variant/15 border border-transparent'
                    }`}
                  >
                    <img 
                      className="w-8 h-5.5 rounded shadow-xs object-cover border border-outline-variant/50" 
                      alt={lang.label} 
                      src={lang.flag}
                    />
                    <span className="text-[9px] font-bold tracking-wider text-on-surface">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Error Message Box */}
            {errorMessage && (
              <div className="bg-error-container text-on-error-container p-3 rounded-lg text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Conditional Phone vs OTP Forms */}
            {!isOtpSent ? (
              <form onSubmit={handleMobileSubmit} className="flex flex-col gap-4">
                
                {/* Number Input Container */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant px-1" htmlFor="mobile">
                    Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-sm font-bold text-on-surface-variant border-r border-outline-variant pr-3 tracking-wide">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="mobile"
                      value={mobile}
                      onChange={(e) => {
                        // Allow only numbers, max 10 digits
                        const val = e.target.value.replace(/\D/g, '').substring(0, 10);
                        setMobile(val);
                      }}
                      placeholder="Enter 10 digit number"
                      className="w-full pl-16 pr-4 h-touch-target-min bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-semibold transition-all tracking-wide"
                      required
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-touch-target-min bg-primary text-white font-bold text-sm rounded-xl shadow-md hover:bg-primary-container active:scale-97 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Sending OTP...' : 'Get Started'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>

              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                
                {/* OTP Input Container */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-on-surface-variant" htmlFor="otp">
                      One-Time Password (OTP)
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setIsOtpSent(false)} 
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      Change Number
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      id="otp"
                      value={otpCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').substring(0, 4);
                        setOtpCode(val);
                      }}
                      placeholder="Enter 4-digit code (e.g. 1234)"
                      className="w-full px-4 h-touch-target-min bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-bold text-center tracking-widest"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1 text-center font-medium">Hint: Enter <strong>1234</strong> or any digits to sign-in instantly.</p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-touch-target-min bg-primary text-white font-bold text-sm rounded-xl shadow-md hover:bg-primary-container active:scale-97 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Log In'}
                  {!isLoading && <Check className="w-4 h-4 text-secondary" />}
                </button>

              </form>
            )}

            <div className="text-center">
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                By signing in, you agree to our <a className="text-primary hover:underline font-bold" href="#">Terms of Service</a> and <a class="text-primary hover:underline font-bold" href="#">Privacy Policy</a>.
              </p>
            </div>
            
          </div>

          {/* Social / Partner marks */}
          <div className="mt-8 flex justify-center items-center gap-6 opacity-80">
            <img 
              className="h-10 grayscale hover:grayscale-0 transition-all border border-outline-variant/10 rounded" 
              alt="Digital India" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8HRPnjGRghNkwQu1kpqfv-BdBJHgn53EPbUc_Uecrslz8pdb_qoyUf-SVKi11EbDI0D4_nKegTBMfzRasrzfidSgeoPq31e7tQvokwCD_iz0lJBRZysKGHxdDc_Jg1IWWfwdpz0JfiEikiB6FO1yWqTt7Es0W7WeVamt01TLOsHJXQaoDvCqOvWHouWZd9Z2vFhKCwIDuRycgnmXODquOwR3xVBE_Ls4sexkxVQIeFaKoCKWZP3W3wGX7n3ITFuUvg23PLr8V5Dcr"
            />
            <img 
              className="h-10 grayscale hover:grayscale-0 transition-all border border-outline-variant/10 rounded" 
              alt="Aadhaar" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdcsBjzzFB45HwiH3ZCHTQIKLEsJP65ORXtcZ4w_ckbSw8KNC0k56AmbTMVVTdCoGFmlQWAHrAq5FqnWuleCw0k-XNtAYNA_LzIWgO2BLXQsY4cyU9uRECw3iH97d5DR4exButiVLAzeJCmg5Pd7hvbPbf7FTBC35S2dvYD2GDBiqLsQCfQ_6rqVyADT2YBG_qBnH7j-dECIq6IMSRLWSzO12dnl3ypB0qYx8o0crtY45Bjm5FoxjR9-BjJsHawwgzeoAAOYBjEwYG"
            />
          </div>
        </section>

      </main>

      {/* Institutional Footer */}
      <footer className="w-full py-8 px-container-margin border-t border-outline-variant bg-surface-container-low/50 relative z-10 shrink-0 mt-14 leading-normal">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-xs" />
            <span className="text-xs font-bold text-on-surface-variant">NIC Maintained Portal © 2024</span>
          </div>
          <div className="flex gap-6">
            <a className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors" href="#">Helpdesk</a>
            <a className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors" href="#">Feedback</a>
            <a className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors" href="#">FAQs</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
