import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Send, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EmergencyActivationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyActivationDialog = ({ isOpen, onClose }: EmergencyActivationDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<{ trustedName?: string; trustedEmail?: string } | null>(null);

  const handleActivate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("emergency-access", {
        body: { action: "activate_direct" },
      });
      if (error) throw error;
      if (data?.error) {
        toast({ title: "Erreur", description: data.error, variant: "destructive" });
        return;
      }
      setResult({ trustedName: data.trustedName, trustedEmail: data.trustedEmail });
      setSuccess(true);
      toast({
        title: "Passeport activé",
        description: `Le lien d'accès a été envoyé à ${data.trustedName}.`,
      });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'activer le passeport.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-14 h-14 bg-destructive/20 rounded-xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          <DialogTitle className="text-center text-xl">
            Activer le Passeport d'Urgence
          </DialogTitle>
          <DialogDescription className="text-center">
            Cette action enverra immédiatement un lien d'accès à votre personne de confiance.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8"
            >
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-sage" />
              </div>
              <p className="text-foreground font-medium">Lien envoyé à {result?.trustedName} !</p>
              <p className="text-sm text-muted-foreground mt-1">{result?.trustedEmail}</p>
            </motion.div>
          ) : (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-4">
              <div className="p-4 bg-destructive/10 rounded-xl">
                <p className="text-sm text-destructive font-medium mb-2">⚠️ Attention</p>
                <p className="text-sm text-muted-foreground">
                  Votre personne de confiance recevra un accès en lecture seule à votre passeport, valable 24 heures.
                </p>
              </div>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleActivate}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Confirmer l'activation
              </Button>
              <Button variant="outline" className="w-full" onClick={handleClose}>
                Annuler
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
