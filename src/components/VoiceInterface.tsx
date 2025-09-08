import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageSquare,
  Headphones,
  Accessibility,
  Loader2,
  Send
} from "lucide-react";

const VoiceInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [transcribedText, setTranscribedText] = useState('');
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { user, supabase } = useAuth();
  const { toast } = useToast();

  const startListening = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: 'Microphone not supported',
        description: 'Your browser does not support voice recording',
        variant: 'destructive',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      
      toast({
        title: 'Recording started',
        description: 'Speak clearly into your microphone',
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: 'Microphone access denied',
        description: 'Please allow microphone access to use voice features',
        variant: 'destructive',
      });
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to use voice features',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: formData,
      });

      if (error) throw error;
      
      setTranscribedText(data.text);
      toast({
        title: 'Speech transcribed',
        description: 'Your voice has been converted to text',
      });
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        title: 'Transcription failed',
        description: 'Could not convert speech to text',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const speakText = async (text: string) => {
    if (!text.trim()) return;

    setIsSpeaking(true);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'alloy' },
      });

      if (error) throw error;

      // Convert response to audio and play
      const audioBlob = new Blob([data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      
      toast({
        title: 'Text spoken',
        description: 'AI is speaking your text',
      });
    } catch (error) {
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
      toast({
        title: 'Speech failed',
        description: 'Could not convert text to speech',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAccessibility = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <section id="voice" className="py-20 bg-background">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={`transition-all hover:scale-105 ${isListening ? 'ring-2 ring-primary shadow-wellness' : 'hover:shadow-wellness'}`}>
              <CardContent className="p-6 text-center">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  size="lg"
                  variant={isListening ? "default" : "outline"}
                  className="w-16 h-16 rounded-full mb-4"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : isListening ? (
                    <MicOff className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </Button>
                <h3 className="text-lg font-semibold mb-2">
                  {isListening ? "Stop Listening" : "Start Voice Input"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isListening 
                    ? "Click to stop recording your voice" 
                    : "Click to begin voice-to-text conversion"
                  }
                </p>
              </CardContent>
            </Card>

            <Card className={`transition-all hover:scale-105 ${isSpeaking ? 'ring-2 ring-primary shadow-wellness' : 'hover:shadow-wellness'}`}>
              <CardContent className="p-6 text-center">
                <Button
                  onClick={() => speakText(transcribedText || 'Hello! This is a test of the text-to-speech feature.')}
                  size="lg"
                  variant={isSpeaking ? "default" : "outline"}
                  className="w-16 h-16 rounded-full mb-4"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : isSpeaking ? (
                    <VolumeX className="w-8 h-8" />
                  ) : (
                    <Volume2 className="w-8 h-8" />
                  )}
                </Button>
                <h3 className="text-lg font-semibold mb-2">
                  {isSpeaking ? "Stop Speaking" : "Text-to-Speech"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isSpeaking 
                    ? "AI is currently speaking" 
                    : "Convert text responses to speech"
                  }
                </p>
              </CardContent>
            </Card>

            <Card className={`transition-all hover:scale-105 ${!isEnabled ? 'ring-2 ring-accent' : 'hover:shadow-wellness'}`}>
              <CardContent className="p-6 text-center">
                <Button
                  onClick={toggleAccessibility}
                  size="lg"
                  variant={!isEnabled ? "default" : "outline"}
                  className="w-16 h-16 rounded-full mb-4"
                >
                  <Accessibility className="w-8 h-8" />
                </Button>
                <h3 className="text-lg font-semibold mb-2">
                  {isEnabled ? "Accessibility Mode" : "Standard Mode"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isEnabled 
                    ? "Enable enhanced accessibility features" 
                    : "Return to standard interface"
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {transcribedText && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Transcribed Text
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={transcribedText}
                  onChange={(e) => setTranscribedText(e.target.value)}
                  placeholder="Your transcribed speech will appear here..."
                  rows={4}
                />
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => speakText(transcribedText)}
                    variant="outline"
                    disabled={loading || !transcribedText.trim()}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Speak Text
                  </Button>
                  <Button
                    onClick={() => setTranscribedText('')}
                    variant="outline"
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-8 bg-gradient-to-r from-accent/10 to-primary/10">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <MessageSquare className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Voice-Guided Health Assistant</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our AI-powered voice interface helps you navigate health information hands-free. 
                  Simply speak your questions and receive audio responses for a more accessible healthcare experience.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <div className="bg-background rounded-full px-4 py-2 text-sm border">
                    Voice Commands
                  </div>
                  <div className="bg-background rounded-full px-4 py-2 text-sm border">
                    Audio Responses
                  </div>
                  <div className="bg-background rounded-full px-4 py-2 text-sm border">
                    Hands-Free Navigation
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

export default VoiceInterface;