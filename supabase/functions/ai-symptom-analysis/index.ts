import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}));
    const symptomsInput = Array.isArray(body.symptoms) ? body.symptoms : [];
    const symptoms = symptomsInput.map((s: any) => String(s).trim()).filter(Boolean);
    const description = typeof body.description === 'string' ? body.description : '';
    const patientHistory = body.patientHistory ?? {};

    if (symptoms.length === 0 && !description) {
      return new Response(
        JSON.stringify({ error: 'Please provide at least one symptom or a description.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Create AI prompt for symptom analysis
    const prompt = `You are a medical AI assistant. Analyze the following symptoms and provide a structured response.

Symptoms: ${symptoms.join(', ')}
Description: ${description}
Patient History: ${JSON.stringify(patientHistory)}

Provide analysis in this JSON format:
{
  "possibleConditions": [
    {
      "condition": "condition name",
      "probability": "percentage",
      "description": "brief description"
    }
  ],
  "severityLevel": "low|moderate|high|emergency",
  "recommendedActions": [
    "action 1",
    "action 2"
  ],
  "redFlags": [
    "warning signs to watch for"
  ],
  "homeRemedies": [
    {
      "remedy": "remedy name",
      "instructions": "how to use"
    }
  ],
  "whenToSeekHelp": "when to consult a doctor",
  "disclaimer": "medical disclaimer"
}

IMPORTANT: Always include a disclaimer that this is not a substitute for professional medical advice.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable medical AI that provides helpful symptom analysis while emphasizing the importance of professional medical care. Return ONLY valid JSON with no extra commentary.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1200
      })
    })

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API error: ${errText}`);
    }

    const aiResponse = await response.json()

    let content = aiResponse?.choices?.[0]?.message?.content || '';
    let analysis: any;
    try {
      // Preferred: direct JSON when response_format is enforced
      analysis = JSON.parse(content);
    } catch {
      try {
        // Fallbacks: code-fenced JSON or first JSON object
        const fence = content.match(/```json([\s\S]*?)```/i) || content.match(/```([\s\S]*?)```/);
        const candidate = fence ? fence[1] : (content.match(/\{[\s\S]*\}/)?.[0] || '');
        analysis = JSON.parse(candidate);
      } catch (err) {
        console.error('Failed to parse AI response into JSON:', { contentPreview: content.slice(0, 400) });
        throw new Error('The AI response could not be parsed. Please try again.');
      }
    }

    // Store the analysis in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: user } = await supabaseClient.auth.getUser()
    
    if (user.user) {
      await supabaseClient
        .from('symptom_reports')
        .insert({
          user_id: user.user.id,
          symptoms: symptoms,
          symptom_description: description,
          ai_analysis: analysis,
          severity_score: analysis.severityLevel === 'emergency' ? 10 : 
                        analysis.severityLevel === 'high' ? 8 :
                        analysis.severityLevel === 'moderate' ? 5 : 3
        })
    }

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    console.error('ai-symptom-analysis error:', error?.message || error, error);
    const status = error?.message?.includes('OpenAI API error') ? 502 : 400;
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status,
      },
    )
  }
})