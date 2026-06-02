import { motion } from "framer-motion";
import { ChevronRight, Clock, Trash2 } from "lucide-react";
import { FamilyProfile } from "@/hooks/useFamilyProfiles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const COLORS = [
  "bg-primary text-primary-foreground",
  "bg-sage text-secondary-foreground",
  "bg-gold text-accent-foreground",
  "bg-destructive text-destructive-foreground",
  "bg-navy text-primary-foreground",
];

const initials = (fn: string, ln: string) =>
  `${fn?.[0] ?? ""}${ln?.[0] ?? ""}`.toUpperCase() || "?";

const relLabel: Record<string, string> = {
  titulaire: "Moi",
  conjoint: "Conjoint(e)",
  enfant: "Enfant",
  parent: "Parent",
  autre: "Autre",
};

interface ProfileCardProps {
  profile: FamilyProfile;
  index: number;
  onOpen: () => void;
  onDelete?: () => void;
}

export const ProfileCard = ({ profile, index, onOpen, onDelete }: ProfileCardProps) => {
  const color = COLORS[index % COLORS.length];
  const displayName = profile.is_self
    ? "Mon passeport"
    : profile.invite_status === "pending" && !profile.first_name
      ? profile.invite_email
      : `${profile.first_name} ${profile.last_name}`.trim() || profile.invite_email || "Profil";

  const sections = profile.passport_data ? Object.keys(profile.passport_data).filter(k => k.endsWith("_completed") && profile.passport_data[k]).length : 0;
  const isComplete = sections >= 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-2xl p-4 shadow-card border border-border flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${color}`}>
        {initials(profile.first_name, profile.last_name)}
      </div>
      <button onClick={onOpen} className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-foreground truncate">{displayName}</span>
          {profile.invite_status === "pending" && (
            <Badge variant="secondary" className="gap-1 text-[10px]">
              <Clock className="w-3 h-3" />Invitation en attente
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {relLabel[profile.relationship] ?? profile.relationship}
          {profile.invite_status !== "pending" && (
            <> · {isComplete ? "Complet" : `${sections} section${sections > 1 ? "s" : ""}`}</>
          )}
        </div>
      </button>
      {onDelete && !profile.is_self && (
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Supprimer">
          <Trash2 className="w-4 h-4 text-muted-foreground" />
        </Button>
      )}
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </motion.div>
  );
};
