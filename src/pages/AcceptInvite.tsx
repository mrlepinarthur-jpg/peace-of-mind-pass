import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AcceptInvite = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<"idle" | "accepting" | "done" | "error">("idle");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Lien d'invitation invalide.");
    }
  }, [token]);

  const accept = async () => {
    if (!token) return;
    setStatus("accepting");
    const { error } = await supabase.rpc("accept_profile_invite" as any, { _token: token } as any);
    if (error) {
      setStatus("error");
      setError(error.message);
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    setStatus("done");
    toast({ title: "Invitation acceptée" });
    setTimeout(() => navigate("/"), 1500);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-card rounded-2xl p-8 shadow-card text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl gradient-hero flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold mb-2">Vous êtes invité</h1>
          <p className="text-sm text-muted-foreground mb-5">
            Créez votre compte ou connectez-vous pour rejoindre ce passeport partagé.
          </p>
          <Button variant="hero" className="w-full" onClick={() => navigate(`/auth?redirect=/accept-invite?token=${token}`)}>
            Se connecter / S'inscrire
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-card rounded-2xl p-8 shadow-card text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl gradient-hero flex items-center justify-center">
          {status === "done" ? <CheckCircle2 className="w-7 h-7 text-primary-foreground" /> : <Shield className="w-7 h-7 text-primary-foreground" />}
        </div>
        <h1 className="text-xl font-bold mb-2">
          {status === "done" ? "Invitation acceptée !" : "Accepter l'invitation"}
        </h1>
        <p className="text-sm text-muted-foreground mb-5">
          {status === "done"
            ? "Redirection en cours…"
            : "En acceptant, vous serez lié au profil partagé."}
        </p>
        {status !== "done" && (
          <Button variant="hero" className="w-full" onClick={accept} disabled={status === "accepting" || !token}>
            {status === "accepting" && <Loader2 className="w-4 h-4 animate-spin" />}
            Accepter l'invitation
          </Button>
        )}
        {error && <p className="text-xs text-destructive mt-3">{error}</p>}
      </motion.div>
    </div>
  );
};

export default AcceptInvite;
