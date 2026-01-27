import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScanModal from "@/components/ScanModal";
import DigitalTwinDashboard from "@/components/DigitalTwinDashboard";
import HowItWorks from "@/components/HowItWorks";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Impact from "@/components/Impact";
import Footer from "@/components/Footer";
import HealthChatBot from "@/components/HealthChatBot";
import RegistrationModal from "@/components/RegistrationModal";
import RegistrationRequiredModal from "@/components/RegistrationRequiredModal";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const IndexContent = () => {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isRegistrationRequiredModalOpen, setIsRegistrationRequiredModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Listen for registration events
    const handleOpenRegistration = () => setIsRegistrationModalOpen(true);
    window.addEventListener('openRegistration', handleOpenRegistration);
    
    return () => {
      window.removeEventListener('openRegistration', handleOpenRegistration);
    };
  }, []);

  const handleScanClick = () => {
    if (!isAuthenticated) {
      setIsRegistrationRequiredModalOpen(true);
    } else {
      setIsScanModalOpen(true);
    }
  };

  const handleScanComplete = () => {
    setShowDashboard(true);
    // Scroll to dashboard after a brief delay
    setTimeout(() => {
      document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onScanClick={handleScanClick} />
      
      <main>
        <Hero onScanClick={handleScanClick} />
        <DigitalTwinDashboard isVisible={showDashboard} />
        <HowItWorks />
        <About />
        <Testimonials />
        <Impact />
      </main>

      <Footer />

      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onComplete={handleScanComplete}
      />
      
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
      
      <RegistrationRequiredModal
        isOpen={isRegistrationRequiredModalOpen}
        onClose={() => setIsRegistrationRequiredModalOpen(false)}
        onRegister={() => {
          setIsRegistrationRequiredModalOpen(false);
          setIsRegistrationModalOpen(true);
        }}
      />
      
      <HealthChatBot />
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <IndexContent />
    </AuthProvider>
  );
};

export default Index;
