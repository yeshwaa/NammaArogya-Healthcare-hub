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
    const { symptoms, description, patientHistory } = await req.json()
    
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
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable medical AI that provides helpful symptom analysis while emphasizing the importance of professional medical care.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API error: ${errText}`);
    }

    const aiResponse = await response.json()

    let content = aiResponse?.choices?.[0]?.message?.content || ''
    let analysis: any
    try {
      // Try to extract pure JSON (handles code fences)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : content)
    } catch (_) {
      throw new Error('AI returned an unexpected format. Please try again.')
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
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})