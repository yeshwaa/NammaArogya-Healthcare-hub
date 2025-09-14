-- Create symptom_reports table for storing AI symptom analysis
CREATE TABLE public.symptom_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  symptoms TEXT[] NOT NULL,
  symptom_description TEXT,
  ai_analysis JSONB,
  severity_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.symptom_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own symptom reports" 
ON public.symptom_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own symptom reports" 
ON public.symptom_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own symptom reports" 
ON public.symptom_reports 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_symptom_reports_updated_at
BEFORE UPDATE ON public.symptom_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();