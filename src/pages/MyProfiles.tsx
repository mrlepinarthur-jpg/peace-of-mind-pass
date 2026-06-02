import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles";
import { useSubscription } from "@/hooks/useSubscription";
import { ProfileCard } from "@/components/profiles/ProfileCard";
import { AddProfileDialog } from "@/components/profiles/AddProfileDialog";
import { UpgradePromptDialog } from "@/components/profiles/UpgradePromptDialog";

const MyProfiles = ({ onOpenProfile, onGoHome }: { onOpenProfile: (id: string) => void; onGoHome: () => void }) => {
  const { profiles, loading, deleteProfile } = useFamilyProfiles();
  const { maxProfiles, planName } = useSubscription();
  const [showAdd, setShowAdd] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const navigate = useNavigate();

  const limitReached = profiles.length >= maxProfiles;

  const handleAddClick = () => {
    if (limitReached) setShowUpgrade(true);
    else setShowAdd(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-5 shadow-card mb-6 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
          <Users className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg text-foreground">Mes profils</h2>
          <p className="text-sm text-muted-foreground">
            {profiles.length} / {maxProfiles} profils — Plan {planName}
          </p>
        </div>
      </motion.div>

      <div className="space-y-3 mb-6">
        {profiles.map((p, i) => (
          <ProfileCard
            key={p.id}
            profile={p}
            index={i}
            onOpen={() => (p.is_self ? onGoHome() : onOpenProfile(p.id))}
            onDelete={() => {
              if (confirm(`Supprimer ce profil ?`)) deleteProfile(p.id);
            }}
          />
        ))}
      </div>

      <Button
        variant={limitReached ? "outline" : "hero"}
        size="lg"
        className="w-full gap-2"
        onClick={handleAddClick}
      >
        {limitReached ? <Lock className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
        {limitReached
          ? `Limite atteinte — Passer au plan supérieur`
          : "Ajouter un profil"}
      </Button>

      <AddProfileDialog isOpen={showAdd} onClose={() => setShowAdd(false)} />
      <UpgradePromptDialog
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={() => { setShowUpgrade(false); onGoHome(); }}
      />
    </div>
  );
};

export default MyProfiles;
