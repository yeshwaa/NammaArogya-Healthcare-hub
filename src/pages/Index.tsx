import HealthcareHeader from "@/components/HealthcareHeader";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import SymptomChecker from "@/components/SymptomChecker";
import VoiceInterface from "@/components/VoiceInterface";
import { ConsultationBooking } from "@/components/consultation/ConsultationBooking";
import { HomeRemedies } from "@/components/remedies/HomeRemedies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <HealthcareHeader />
      <main>
        <HeroSection />
        <FeaturesGrid />
        
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Healthcare Services
              </h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive AI-powered healthcare solutions at your fingertips
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="symptoms">Symptom Checker</TabsTrigger>
                <TabsTrigger value="voice">Voice Assistant</TabsTrigger>
                <TabsTrigger value="consultation">Consultations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <HomeRemedies />
              </TabsContent>

              <TabsContent value="symptoms">
                <SymptomChecker />
              </TabsContent>

              <TabsContent value="voice">
                <VoiceInterface />
              </TabsContent>

              <TabsContent value="consultation">
                <ConsultationBooking />
              </TabsContent>
            </Tabs>
          </div>
        </section>
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