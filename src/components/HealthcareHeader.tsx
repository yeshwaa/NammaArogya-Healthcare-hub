import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  MessageCircle, 
  Calendar, 
  Mic, 
  Search,
  Phone,
  Menu
} from "lucide-react";

const HealthcareHeader = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-trust-gradient rounded-lg shadow-medical">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">HealthCare+</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#symptoms" className="text-muted-foreground hover:text-primary transition-smooth">
              Symptoms
            </a>
            <a href="#remedies" className="text-muted-foreground hover:text-primary transition-smooth">
              Remedies
            </a>
            <a href="#consultations" className="text-muted-foreground hover:text-primary transition-smooth">
              Consultations
            </a>
            <a href="#voice-support" className="text-muted-foreground hover:text-primary transition-smooth">
              Voice Support
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Phone className="w-4 h-4 mr-2" />
              Emergency
            </Button>
            <Button variant="medical" size="sm">
              Get Started
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HealthcareHeader;