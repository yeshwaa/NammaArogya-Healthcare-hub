import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain,
  Leaf,
  Video,
  Mic,
  MessageCircle,
  Search,
  Activity,
  Shield
} from "lucide-react";

const FeaturesGrid = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Symptom Checker",
      description: "Advanced AI analyzes your symptoms and provides preliminary assessments with high accuracy.",
      buttonText: "Check Symptoms",
      variant: "medical" as const,
      bgColor: "bg-medical-blue/5 hover:bg-medical-blue/10",
    },
    {
      icon: Leaf,
      title: "Natural Remedies",
      description: "Discover evidence-based home remedies and natural treatments for common health conditions.",
      buttonText: "Browse Remedies",
      variant: "wellness" as const,
      bgColor: "bg-wellness-green-light/30 hover:bg-wellness-green-light/50",
    },
    {
      icon: Video,
      title: "Live Consultations",
      description: "Connect with certified healthcare professionals through secure video consultations.",
      buttonText: "Book Now",
      variant: "medical" as const,
      bgColor: "bg-primary/5 hover:bg-primary/10",
    },
    {
      icon: Mic,
      title: "Voice Assistant",
      description: "Interactive voice-guided support for health queries and medication reminders.",
      buttonText: "Try Voice",
      variant: "wellness" as const,
      bgColor: "bg-accent/10 hover:bg-accent/20",
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "24/7 chat support with healthcare experts and AI-powered health assistants.",
      buttonText: "Start Chat",
      variant: "medical" as const,
      bgColor: "bg-medical-blue/5 hover:bg-medical-blue/10",
    },
    {
      icon: Activity,
      title: "Health Tracking",
      description: "Monitor your health metrics, symptoms, and treatment progress over time.",
      buttonText: "Track Health",
      variant: "wellness" as const,
      bgColor: "bg-wellness-green-light/30 hover:bg-wellness-green-light/50",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Complete Healthcare Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive healthcare services powered by AI technology and expert medical professionals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`${feature.bgColor} border-0 shadow-medical hover:shadow-wellness transition-smooth hover:scale-105 group`}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-trust-gradient rounded-2xl shadow-glow">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-smooth">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <Button variant={feature.variant} className="w-full">
                  {feature.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;