import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";

interface HealthConsentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: () => void;
}

export const HealthConsentDialog = ({ isOpen, onClose, onConsent }: HealthConsentDialogProps) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            Données médicales sensibles
          </DialogTitle>
          <DialogDescription className="pt-4 text-sm leading-relaxed">
            La fiche santé contient des données médicales sensibles protégées par le RGPD
            (Article 9). Ces données sont chiffrées et accessibles uniquement par vous et vos
            personnes de confiance autorisées.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
          <Checkbox
            id="health-consent"
            checked={accepted}
            onCheckedChange={(v) => setAccepted(v === true)}
            className="mt-0.5"
          />
          <label htmlFor="health-consent" className="text-sm text-foreground cursor-pointer leading-snug">
            J'accepte le stockage sécurisé de mes données médicales
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Annuler
          </Button>
          <Button className="flex-1" disabled={!accepted} onClick={onConsent}>
            Continuer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
