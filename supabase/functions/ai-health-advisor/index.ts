import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthAdvisorRequest {
  symptoms: string;
  userHistory?: any;
  userId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, userHistory, userId }: HealthAdvisorRequest = await req.json();

    // Create Supabase client for server-side operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user profile if userId is provided
    let userProfile = null;
    if (userId) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      userProfile = data;
    }

    // Prepare context for AI
    const context = `
You are a healthcare AI assistant. Provide helpful health advice based on the following information:
Symptoms: ${symptoms}
${userProfile ? `User Type: ${userProfile.user_type}` : ''}
${userProfile?.medical_history ? `Medical History: ${JSON.stringify(userProfile.medical_history)}` : ''}
${userHistory ? `Additional Context: ${JSON.stringify(userHistory)}` : ''}

IMPORTANT: 
- Always recommend consulting a healthcare professional for serious concerns
- Provide general advice only, not specific medical diagnoses
- Include potential home remedies or general wellness tips when appropriate
- Be supportive and empathetic in your response
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful healthcare AI assistant that provides general health advice and recommendations. Always emphasize the importance of consulting healthcare professionals for medical concerns.' 
          },
          { role: 'user', content: context }
        ],
        max_completion_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const advice = data.choices[0].message.content;

    // Log the consultation if user is authenticated
    if (userId) {
      await supabase
        .from('consultations')
        .insert({
          patient_id: userId,
          title: 'AI Health Consultation',
          description: `Symptoms: ${symptoms}`,
          consultation_type: 'chat',
          status: 'completed',
          scheduled_at: new Date().toISOString(),
        });
    }

    return new Response(JSON.stringify({ advice }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in ai-health-advisor function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);