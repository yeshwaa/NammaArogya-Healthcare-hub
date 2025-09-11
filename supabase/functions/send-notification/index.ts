import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'reminder' | 'alert' | 'general';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, title, message, type }: NotificationRequest = await req.json();

    // Create Supabase client for server-side operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user profile to determine notification preferences
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!profile) {
      throw new Error('User profile not found');
    }

    // Here you could integrate with email services, push notifications, etc.
    // For now, we'll just log the notification
    console.log(`Notification for ${profile.full_name}:`, {
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
    });

    // In a real implementation, you might:
    // 1. Send email notifications using Resend
    // 2. Send push notifications
    // 3. Store notifications in a database table
    // 4. Send SMS notifications

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully',
        recipient: profile.full_name,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-notification function:', error);
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