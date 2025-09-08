import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { 
  Stethoscope, 
  Menu, 
  X, 
  Phone, 
  MessageCircle, 
  Calendar,
  User,
  LogOut
} from "lucide-react";

const HealthcareHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

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
            <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">
              Services
            </a>
            <a href="#symptoms" className="text-muted-foreground hover:text-primary transition-smooth">
              Symptom Checker
            </a>
            <a href="#voice" className="text-muted-foreground hover:text-primary transition-smooth">
              Voice Assistant
            </a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Button variant="medical" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Consultation
                </Button>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback>
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground text-sm">
                    {profile?.full_name || user.email}
                  </span>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                variant="medical" 
                size="sm"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </nav>

          <div className="flex items-center space-x-3 md:hidden">
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Emergency
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col space-y-3">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">
                Services
              </a>
              <a href="#symptoms" className="text-muted-foreground hover:text-primary transition-smooth">
                Symptom Checker
              </a>
              <a href="#voice" className="text-muted-foreground hover:text-primary transition-smooth">
                Voice Assistant
              </a>
              {user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {profile?.full_name || user.email}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="w-fit">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Consultation
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="w-fit text-muted-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  variant="medical" 
                  size="sm"
                  className="w-fit"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
};

export default HealthcareHeader;