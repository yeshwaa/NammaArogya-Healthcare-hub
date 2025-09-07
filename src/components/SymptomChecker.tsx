import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Brain,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Thermometer,
  Heart,
  Zap
} from "lucide-react";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const commonSymptoms = [
    { name: "Headache", severity: "mild", icon: Brain },
    { name: "Fever", severity: "moderate", icon: Thermometer },
    { name: "Fatigue", severity: "mild", icon: Zap },
    { name: "Chest Pain", severity: "severe", icon: Heart },
    { name: "Cough", severity: "mild", icon: AlertCircle },
    { name: "Nausea", severity: "moderate", icon: AlertCircle },
  ];

  const severityColors = {
    mild: "bg-wellness-green-light text-wellness-green border-wellness-green/30",
    moderate: "bg-accent/10 text-accent border-accent/30", 
    severe: "bg-destructive/10 text-destructive border-destructive/30"
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <section id="symptoms" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              AI-Powered Symptom Checker
            </h2>
            <p className="text-xl text-muted-foreground">
              Describe your symptoms and get instant AI-powered health insights
            </p>
          </div>

          <Card className="shadow-medical border-0 bg-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <Brain className="w-8 h-8 text-primary" />
                Symptom Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Describe your symptoms in detail..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="pl-10 py-4 text-lg"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Common Symptoms:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonSymptoms.map((symptom, index) => (
                    <button
                      key={index}
                      onClick={() => toggleSymptom(symptom.name)}
                      className={`p-4 rounded-lg border-2 transition-smooth hover:scale-105 ${
                        selectedSymptoms.includes(symptom.name)
                          ? severityColors[symptom.severity] + " shadow-wellness"
                          : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <symptom.icon className="w-5 h-5" />
                        <span className="font-medium">{symptom.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedSymptoms.length > 0 && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Selected Symptoms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="medical" 
                  size="lg" 
                  className="flex-1"
                  disabled={!symptoms && selectedSymptoms.length === 0}
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Analyze Symptoms
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Emergency Help
                </Button>
              </div>

              <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      Medical Disclaimer
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This tool provides general information only and should not replace professional medical advice. 
                      For emergencies, call your local emergency services immediately.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SymptomChecker;