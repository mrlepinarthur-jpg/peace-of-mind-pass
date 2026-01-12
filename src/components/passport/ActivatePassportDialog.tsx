import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PassportData } from "@/hooks/usePassport";
import { generatePassportPDF } from "@/utils/generatePassportPDF";
import { useToast } from "@/hooks/use-toast";
import { Send, FileDown, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ActivatePassportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  passport: PassportData | null;
  trustedPersonEmail?: string;
  trustedPersonName?: string;
  hasPremiumPlan?: boolean;
}

export const ActivatePassportDialog = ({
  isOpen,
  onClose,
  passport,
  trustedPersonEmail,
  trustedPersonName,
  hasPremiumPlan = false,
}: ActivatePassportDialogProps) => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const hasTrustedPerson = Boolean(trustedPersonEmail && trustedPersonName);
  const isPassportComplete = passport && (
    passport.identity_completed ||
    passport.trusted_person_completed ||
    passport.contacts_completed ||
    passport.documents_completed ||
    passport.administrative_completed ||
    passport.digital_completed ||
    passport.checklists_completed ||
    passport.personal_message_completed
  );

  const handleDownloadPDF = () => {
    if (!passport) {
      toast({
        title: "Aucune donnée",
        description: "Remplissez au moins une section avant de télécharger.",
        variant: "destructive",
      });
      return;
    }

    generatePassportPDF(passport);
    toast({
      title: "PDF généré",
      description: "Votre passeport a été téléchargé. Vous pouvez l'envoyer à votre personne de confiance.",
    });
    onClose();
  };

  const handleSendToTrustedPerson = async () => {
    if (!hasPremiumPlan) {
      toast({
        title: "Offre Premium requise",
        description: "L'envoi automatique est disponible avec l'offre Sérénité ou Famille.",
        variant: "destructive",
      });
      return;
    }

    if (!trustedPersonEmail || !passport) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez d'abord renseigner les informations de votre personne de confiance.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    // Simulate sending - in production, this would call an edge function
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSending(false);
    setSuccess(true);
    
    toast({
      title: "Envoyé avec succès",
      description: `Le passeport a été envoyé à ${trustedPersonName}.`,
    });

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-14 h-14 gradient-hero rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <DialogTitle className="text-center text-xl">
            Activer mon Passeport de Vie
          </DialogTitle>
          <DialogDescription className="text-center">
            Transmettez votre passeport à votre personne de confiance pour qu'elle puisse y accéder en cas de besoin.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-8"
            >
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-sage" />
              </div>
              <p className="text-foreground font-medium">Envoyé avec succès !</p>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 pt-4"
            >
              {!isPassportComplete && (
                <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">
                    Votre passeport est vide. Complétez au moins une section avant de l'activer.
                  </p>
                </div>
              )}

              {/* Option 1: Send to trusted person (Premium) */}
              <div className={`p-4 rounded-xl border-2 transition-all ${
                hasPremiumPlan && hasTrustedPerson
                  ? "border-sage bg-sage/5 hover:bg-sage/10"
                  : "border-muted bg-muted/30 opacity-60"
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    hasPremiumPlan ? "bg-sage/20" : "bg-muted"
                  }`}>
                    <Send className={`w-5 h-5 ${hasPremiumPlan ? "text-sage" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">Envoyer à ma personne de confiance</h3>
                    {hasTrustedPerson ? (
                      <p className="text-sm text-muted-foreground truncate">
                        {trustedPersonName} ({trustedPersonEmail})
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucune personne de confiance configurée
                      </p>
                    )}
                    {!hasPremiumPlan && (
                      <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Offre Sérénité ou Famille
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="sage"
                  className="w-full mt-3"
                  onClick={handleSendToTrustedPerson}
                  disabled={!hasPremiumPlan || !hasTrustedPerson || !isPassportComplete || isSending}
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer maintenant
                    </>
                  )}
                </Button>
              </div>

              {/* Option 2: Download PDF */}
              <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <FileDown className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Télécharger le PDF</h3>
                    <p className="text-sm text-muted-foreground">
                      Téléchargez votre passeport pour l'envoyer vous-même
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={handleDownloadPDF}
                  disabled={!isPassportComplete}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Télécharger le PDF
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
