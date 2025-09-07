import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  MessageCircle, 
  Brain, 
  Mic,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import heroImage from "@/assets/healthcare-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative bg-hero-gradient py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your Health,
                <span className="block text-accent">Our Priority</span>
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Comprehensive healthcare platform offering AI-powered symptom analysis, 
                expert consultations, natural remedies, and voice-guided support - 
                all from the comfort of your home.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="shadow-glow">
                <Brain className="w-5 h-5 mr-2" />
                Check Symptoms
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="wellness" size="lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Book Consultation
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-accent" />
                <span className="text-white/90">24/7 AI Support</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-accent" />
                <span className="text-white/90">Expert Doctors</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-accent" />
                <span className="text-white/90">Voice Interaction</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-accent" />
                <span className="text-white/90">Natural Remedies</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-white/20 rounded-2xl blur-2xl"></div>
            <img 
              src={heroImage} 
              alt="Healthcare professionals providing medical care"
              className="relative rounded-2xl shadow-glow w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;