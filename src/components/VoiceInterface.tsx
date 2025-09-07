import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MessageCircle,
  Headphones
} from "lucide-react";

const VoiceInterface = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <section id="voice-support" className="py-20 bg-wellness-gradient/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Voice-Guided Health Assistant
            </h2>
            <p className="text-xl text-muted-foreground">
              Interact with our AI health assistant using natural voice commands
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Voice Input Card */}
            <Card className="shadow-wellness border-0 bg-card">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-3">
                  <Mic className="w-6 h-6 text-wellness-green" />
                  Voice Input
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="relative">
                  <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRecording 
                      ? "bg-accent shadow-glow animate-pulse-slow" 
                      : "bg-wellness-gradient hover:shadow-wellness"
                  }`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleRecording}
                      className="w-full h-full rounded-full text-white hover:bg-transparent"
                    >
                      {isRecording ? (
                        <MicOff className="w-12 h-12" />
                      ) : (
                        <Mic className="w-12 h-12" />
                      )}
                    </Button>
                  </div>
                  
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full border-4 border-accent animate-ping"></div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    {isRecording 
                      ? "Listening... Speak your health concern clearly"
                      : "Tap the microphone to start speaking"
                    }
                  </p>
                  
                  <div className="flex justify-center gap-3">
                    <Button variant="wellness" onClick={toggleRecording}>
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-left">
                  <h4 className="font-semibold text-foreground mb-2">Try saying:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>"I have a headache and fever"</li>
                    <li>"What remedies help with insomnia?"</li>
                    <li>"Schedule a consultation for tomorrow"</li>
                    <li>"Remind me to take my medication"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Voice Response Card */}
            <Card className="shadow-medical border-0 bg-card">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-3">
                  <Headphones className="w-6 h-6 text-primary" />
                  AI Response
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6 min-h-[200px] flex flex-col justify-center">
                  <div className="text-center space-y-4">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-trust-gradient flex items-center justify-center ${
                      isPlaying ? "animate-bounce-soft" : ""
                    }`}>
                      {isPlaying ? (
                        <Volume2 className="w-8 h-8 text-white" />
                      ) : (
                        <MessageCircle className="w-8 h-8 text-white" />
                      )}
                    </div>
                    
                    <div>
                      {isPlaying ? (
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">AI Assistant Speaking...</p>
                          <div className="flex justify-center space-x-1">
                            {[1,2,3,4,5].map(i => (
                              <div
                                key={i}
                                className="w-1 h-8 bg-primary rounded animate-pulse"
                                style={{ animationDelay: `${i * 0.1}s` }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          AI response will appear here after voice analysis
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button variant="medical" onClick={togglePlayback}>
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play Response
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" size="icon" onClick={toggleMute}>
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Voice Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Natural language processing</li>
                    <li>• Multi-language support</li>
                    <li>• Medical terminology recognition</li>
                    <li>• Personalized voice responses</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceInterface;