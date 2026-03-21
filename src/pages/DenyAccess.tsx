import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Shield, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DenyAccess = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Lien invalide.");
      return;
    }

    const deny = async () => {
      try {
        const { data } = await supabase.functions.invoke("emergency-access", {
          body: { action: "deny_access", denialToken: token },
        });
        if (data?.error) {
          setStatus("error");
          setMessage(data.error);
        } else {
          setStatus("success");
          setMessage("L'accès d'urgence a été refusé avec succès.");
        }
      } catch {
        setStatus("error");
        setMessage("Erreur lors du traitement.");
      }
    };
    deny();
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-8 shadow-card text-center max-w-md">
        <div className="w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-primary-foreground" />
        </div>

        {status === "loading" && (
          <>
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Traitement en cours...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-sage" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">Accès refusé</h1>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">Erreur</h1>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DenyAccess;
