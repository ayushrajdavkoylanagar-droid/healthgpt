import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScanModal from "@/components/ScanModal";
import DigitalTwinDashboard from "@/components/DigitalTwinDashboard";
import HowItWorks from "@/components/HowItWorks";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Impact from "@/components/Impact";
import Footer from "@/components/Footer";

const Index = () => {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleScanComplete = () => {
    setShowDashboard(true);
    // Scroll to dashboard after a brief delay
    setTimeout(() => {
      document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onScanClick={() => setIsScanModalOpen(true)} />
      
      <main>
        <Hero onScanClick={() => setIsScanModalOpen(true)} />
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
    </div>
  );
};

export default Index;
