import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ProfileBuilder from './components/ProfileBuilder';
import CitizenDashboard from './components/CitizenDashboard';
import SchemeDetails from './components/SchemeDetails';
import AiAssistant from './components/AiAssistant';
import { CitizenProfile, Scheme, Application } from './types';

type ScreenState = 'welcome' | 'profile' | 'dashboard' | 'details';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('welcome');
  const [profile, setProfile] = useState<CitizenProfile>({
    name: 'Rajesh Kumar',
    dob: '1988-08-15',
    gender: 'male',
    state: 'Maharashtra',
    district: 'Pune',
    occupation: 'farmer',
    incomeRangeIndex: 1
  });

  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Initial applications as shown exactly in Screen 3 Recent Applications
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'app-initial-1',
      schemeId: 'ration',
      schemeTitle: 'Ration Card Renewal',
      schemeCategory: 'welfare',
      appliedDate: '12 Oct 2023',
      status: 'Approved',
      fullName: 'Rajesh Kumar',
      submittedFiles: {}
    },
    {
      id: 'app-initial-2',
      schemeId: 'solar',
      schemeTitle: 'Solar Pump Subsidy',
      schemeCategory: 'agriculture',
      appliedDate: '05 Oct 2023',
      status: 'Pending',
      fullName: 'Rajesh Kumar',
      submittedFiles: {}
    },
    {
      id: 'app-initial-3',
      schemeId: 'jaljeevan',
      schemeTitle: 'Jal Jeevan Mission',
      schemeCategory: 'welfare',
      appliedDate: '28 Sep 2023',
      status: 'Approved',
      fullName: 'Rajesh Kumar',
      submittedFiles: {}
    }
  ]);

  const handleLoginSuccess = (mobile: string) => {
    setCurrentScreen('profile');
  };

  const handleProfileComplete = (completedProfile: CitizenProfile) => {
    setProfile(completedProfile);
    setCurrentScreen('dashboard');
  };

  const handleSelectScheme = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setCurrentScreen('details');
  };

  const handleBackToDashboard = () => {
    setSelectedScheme(null);
    setCurrentScreen('dashboard');
  };

  const handleAddApplication = (newApp: Application) => {
    setApplications(prev => [newApp, ...prev]);
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased select-none selection:bg-primary-container selection:text-on-primary-container">
      
      {/* Route Router Switches */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen onLoginSuccess={handleLoginSuccess} />
      )}

      {currentScreen === 'profile' && (
        <ProfileBuilder onProfileComplete={handleProfileComplete} />
      )}

      {currentScreen === 'dashboard' && (
        <CitizenDashboard 
          profile={profile} 
          setProfile={setProfile}
          applications={applications} 
          onSelectScheme={handleSelectScheme}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      )}

      {currentScreen === 'details' && selectedScheme && (
        <SchemeDetails 
          scheme={selectedScheme}
          profile={profile}
          applications={applications}
          onBack={handleBackToDashboard}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onAddApplication={handleAddApplication}
        />
      )}

      {/* Floating AI Support Drawer ("Yojna Saathi") */}
      <AiAssistant 
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        userProfile={profile}
        currentScheme={selectedScheme}
      />

    </div>
  );
}
