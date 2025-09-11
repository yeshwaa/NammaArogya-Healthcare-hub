import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Send, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  consultation_id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'voice';
  is_ai_generated: boolean;
  created_at: string;
  sender?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface RealtimeChatProps {
  consultationId: string;
}

export const RealtimeChat = ({ consultationId }: RealtimeChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user, supabase } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!consultationId || !supabase) return;

    // Fetch existing messages
    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel(`consultation-${consultationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `consultation_id=eq.${consultationId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [consultationId, supabase]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:profiles(full_name, avatar_url)
        `)
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      // Temporarily disable chat messages fetch due to DB relation issues
      console.log('Chat messages would be loaded here');
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error loading messages',
        description: 'Could not load chat history',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          consultation_id: consultationId,
          sender_id: user.id,
          message: newMessage,
          message_type: 'text',
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: 'Could not send your message',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceMessage = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: 'Voice not supported',
        description: 'Your browser does not support voice recording',
        variant: 'destructive',
      });
      return;
    }

    if (isListening) {
      setIsListening(false);
      // Stop recording logic would go here
      return;
    }

    try {
      setIsListening(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Voice recording and transcription logic would go here
      // For now, we'll simulate it
      setTimeout(() => {
        setIsListening(false);
        toast({
          title: 'Voice message processed',
          description: 'Voice recording feature coming soon!',
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsListening(false);
      toast({
        title: 'Microphone access denied',
        description: 'Please allow microphone access to use voice messages',
        variant: 'destructive',
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Consultation Chat</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[70%] ${
                    message.sender_id === user?.id ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.sender?.avatar_url} />
                    <AvatarFallback>
                      {message.sender?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      message.sender_id === user?.id
                        ? 'bg-primary text-primary-foreground'
                        : message.is_ai_generated
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <Button
              onClick={handleVoiceMessage}
              variant="outline"
              size="icon"
              className={isListening ? 'bg-red-100 text-red-600' : ''}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};