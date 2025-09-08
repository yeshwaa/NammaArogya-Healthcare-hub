import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SupabaseSetupAlert = () => {
  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-800 mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>Supabase Configuration Required</strong>
          <p className="mt-1 text-sm">
            To use authentication and backend features, please configure your Supabase environment variables.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="ml-4 border-amber-300 text-amber-800 hover:bg-amber-100"
          onClick={() => window.open('https://docs.lovable.dev/integrations/supabase/', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Setup Guide
        </Button>
      </AlertDescription>
    </Alert>
  );
};