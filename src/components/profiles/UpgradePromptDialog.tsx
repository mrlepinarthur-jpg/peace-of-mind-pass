import { Crown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSubscription, SubscriptionPlan } from "@/hooks/useSubscription";

interface UpgradePromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const NEXT_PLAN: Record<SubscriptionPlan, { name: string; limit: number } | null> = {
  free: { name: "Solo", limit: 2 },
  solo: { name: "Sérénité", limit: 3 },
  serenity: { name: "Famille", limit: 5 },
  family: null,
};

const LIMIT_BY_PLAN: Record<SubscriptionPlan, number> = {
  free: 1,
  solo: 2,
  serenity: 3,
  family: 5,
};

export const UpgradePromptDialog = ({ isOpen, onClose, onUpgrade }: UpgradePromptDialogProps) => {
  const { plan, planName } = useSubscription();
  const next = NEXT_PLAN[plan];
  const currentLimit = LIMIT_BY_PLAN[plan];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center mb-3">
            <Crown className="w-6 h-6 text-gold" />
          </div>
          <DialogTitle>Limite de profils atteinte</DialogTitle>
          <DialogDescription className="pt-2">
            Vous avez atteint la limite de <strong>{currentLimit} profil{currentLimit > 1 ? "s" : ""}</strong> pour le plan <strong>{planName}</strong>.
            {next && (
              <>
                <br />
                Passez au plan <strong>{next.name}</strong> pour ajouter jusqu'à {next.limit} profils.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={onClose}>Plus tard</Button>
          {next && (
            <Button variant="hero" onClick={onUpgrade}>
              Voir les offres
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
