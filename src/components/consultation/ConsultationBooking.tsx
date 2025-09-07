import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Clock, Video, MessageCircle, Phone } from 'lucide-react';
import { format } from 'date-fns';

export const ConsultationBooking = () => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [consultationType, setConsultationType] = useState<'chat' | 'video' | 'phone'>('chat');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, supabase } = useAuth();
  const { toast } = useToast();

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const consultationTypes = [
    { value: 'chat', label: 'Text Chat', icon: MessageCircle, description: 'Real-time text messaging' },
    { value: 'video', label: 'Video Call', icon: Video, description: 'Face-to-face consultation' },
    { value: 'phone', label: 'Phone Call', icon: Phone, description: 'Voice-only consultation' },
  ];

  const handleBookConsultation = async () => {
    if (!user || !date || !time || !title) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const scheduledDateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

      const { data, error } = await supabase
        .from('consultations')
        .insert({
          patient_id: user.id,
          title,
          description,
          consultation_type: consultationType,
          scheduled_at: scheduledDateTime.toISOString(),
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Consultation booked!',
        description: `Your ${consultationType} consultation has been scheduled for ${format(scheduledDateTime, 'PPP')} at ${time}`,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setDate(undefined);
      setTime('');
      setConsultationType('chat');

    } catch (error) {
      console.error('Error booking consultation:', error);
      toast({
        title: 'Booking failed',
        description: 'Could not book your consultation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-primary" />
          Book a Consultation
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Consultation Title *</Label>
          <Input
            id="title"
            placeholder="Brief description of your concern"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Provide more details about your symptoms or concerns..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-3">
          <Label>Consultation Type *</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {consultationTypes.map((type) => (
              <div
                key={type.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                  consultationType === type.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
                onClick={() => setConsultationType(type.value as any)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <type.icon className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{type.label}</p>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Select Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Select Time *</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Choose time" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-accent-foreground">i</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Consultation Guidelines
              </p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Consultations are typically 30-45 minutes long</li>
                <li>• A doctor will be assigned based on your concern</li>
                <li>• You'll receive a confirmation email with details</li>
                <li>• Emergency cases should call emergency services immediately</li>
              </ul>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleBookConsultation}
          className="w-full"
          size="lg"
          disabled={loading || !user}
        >
          {loading ? 'Booking...' : 'Book Consultation'}
        </Button>

        {!user && (
          <p className="text-sm text-muted-foreground text-center">
            Please sign in to book a consultation
          </p>
        )}
      </CardContent>
    </Card>
  );
};