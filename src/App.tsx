import { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { HowItWorks } from './components/HowItWorks';
import { WhyNeoNest } from './components/WhyNeoNest';
import { Plans } from './components/Plans';
import { MissionVision } from './components/MissionVision';
import { TrainingPortal } from './components/TrainingPortal';
import { AIFeatures } from './components/AIFeatures';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingChatbot } from './components/FloatingChatbot';
import { CookieConsent } from './components/CookieConsent';

// New integrated components
import { Auth } from './components/Auth';
import { Blog } from './components/Blog';
import { KnowledgeHub } from './components/KnowledgeHub';
import { CaregiverWorkflow } from './components/CaregiverWorkflow';
import { BookCareWorkflow } from './components/BookCareWorkflow';
import { FAQ } from './components/FAQ';
import { LegalPolicies } from './components/LegalPolicies';

type AppView = 'home' | 'auth' | 'blog' | 'knowledge' | 'caregiver-signup' | 'book-care' | 'faq' | 'legal';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'auth':
        return <Auth />;
      case 'blog':
        return <Blog />;
      case 'knowledge':
        return <KnowledgeHub />;
      case 'caregiver-signup':
        return <CaregiverWorkflow />;
      case 'book-care':
        return <BookCareWorkflow />;
      case 'faq':
        return <FAQ />;
      case 'legal':
        return <LegalPolicies />;
      case 'home':
      default:
        return (
          <main id="main-content" className="relative">
            {/* Hero Section with scroll animation */}
            <div className="opacity-0 animate-fadeInUp">
              <Hero />
            </div>

            {/* Services Section with scroll animation */}
            <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <Services />
            </div>

            {/* How It Works Section with scroll animation */}
            <div className="opacity-0 animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
              <HowItWorks />
            </div>

            {/* Why NeoNest Section with scroll animation */}
            <div className="opacity-0 animate-slideInRight" style={{ animationDelay: '0.6s' }}>
              <WhyNeoNest />
            </div>

            {/* Plans Section with scroll animation */}
            <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
              <Plans />
            </div>


            {/* AI Features Section with scroll animation */}
            <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '1.0s' }}>
              <AIFeatures />
            </div>

            {/* Mission & Vision Section with scroll animation */}
            <div className="opacity-0 animate-slideInRight" style={{ animationDelay: '1.2s' }}>
              <MissionVision />
            </div>

            {/* Training Portal Section with scroll animation */}
            <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '1.4s' }}>
              <TrainingPortal />
            </div>

            {/* Blog Preview Section with scroll animation */}
            <div className="opacity-0 animate-slideInLeft" style={{ animationDelay: '1.6s' }}>
              <Blog showPreview={true} onNavigate={() => setCurrentView('blog')} />
            </div>

            {/* Knowledge Hub Preview Section with scroll animation */}
            <div className="opacity-0 animate-slideInRight" style={{ animationDelay: '1.8s' }}>
              <KnowledgeHub showPreview={true} onNavigate={() => setCurrentView('knowledge')} />
            </div>

            {/* FAQ Section with scroll animation */}
            <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '2.0s' }}>
              <FAQ showPreview={true} onNavigate={() => setCurrentView('faq')} />
            </div>

            {/* Contact Section with scroll animation */}
            <div className="opacity-0 animate-slideInLeft" style={{ animationDelay: '2.2s' }}>
              <Contact />
            </div>
          </main>
        );
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="neonest-ui-theme">
      <div className="min-h-screen bg-background text-foreground antialiased">
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium"
        >
          Skip to content
        </a>

        {/* Header - Pass navigation functions */}
        <Header 
          onNavigate={setCurrentView}
          currentView={currentView}
        />

        {/* Current View Content */}
        {renderCurrentView()}

        {/* Footer - only show on home view */}
        {currentView === 'home' && (
          <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '2.4s' }}>
            <Footer onNavigate={setCurrentView} />
          </div>
        )}

        {/* Floating Components */}
        <FloatingChatbot />
        <CookieConsent />
      </div>
    </ThemeProvider>
  );
}

export default App;