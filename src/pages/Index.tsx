import HealthcareHeader from "@/components/HealthcareHeader";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import SymptomChecker from "@/components/SymptomChecker";
import VoiceInterface from "@/components/VoiceInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HealthcareHeader />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <SymptomChecker />
        <VoiceInterface />
      </main>
      
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-medium mb-2">HealthCare+ Platform</p>
          <p className="text-background/80">
            Comprehensive healthcare solutions powered by AI technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;