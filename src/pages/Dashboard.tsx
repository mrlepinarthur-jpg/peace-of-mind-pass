import { motion } from "framer-motion";
import {
  User,
  Heart,
  Phone,
  FolderOpen,
  Wallet,
  Laptop,
  ClipboardCheck,
  MessageSquare,
  Shield,
  Download,
  Cloud,
} from "lucide-react";
import PassportSection from "@/components/PassportSection";
import { Button } from "@/components/ui/button";
import { usePassport } from "@/hooks/usePassport";
import { useAuth } from "@/hooks/useAuth";

const sectionConfig = [
  {
    key: "identity",
    icon: User,
    title: "Mon identité",
    description: "Informations personnelles de base",
  },
  {
    key: "trusted_person",
    icon: Heart,
    title: "Personne de confiance",
    description: "Celle qui sera contactée en premier",
  },
  {
    key: "contacts",
    icon: Phone,
    title: "Contacts essentiels",
    description: "Famille, médecin, notaire...",
  },
  {
    key: "documents",
    icon: FolderOpen,
    title: "Documents importants",
    description: "Où les trouver en cas de besoin",
  },
  {
    key: "administrative",
    icon: Wallet,
    title: "Situation financière",
    description: "Banques, assurances, contrats",
  },
  {
    key: "digital",
    icon: Laptop,
    title: "Environnement numérique",
    description: "Comptes en ligne (sans mots de passe)",
  },
  {
    key: "checklists",
    icon: ClipboardCheck,
    title: "Checklists d'urgence",
    description: "Que faire en cas de...",
  },
  {
    key: "personal_message",
    icon: MessageSquare,
    title: "Message personnel",
    description: "Mots pour vos proches (optionnel)",
  },
];

const Dashboard = () => {
  const { passport, loading, getProgress } = usePassport();
  const { user } = useAuth();
  const { completed, total } = getProgress();
  const progress = (completed / total) * 100;

  const getSectionCompleted = (key: string): boolean => {
    if (!passport) return false;
    const completedKey = `${key}_completed` as keyof typeof passport;
    return Boolean(passport[completedKey]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Progress Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-5 shadow-card mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 gradient-hero rounded-xl flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg text-foreground">Mon Passeport</h2>
            <p className="text-sm text-muted-foreground">
              {completed}/{total} sections complétées
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-1 text-xs text-sage">
              <Cloud className="w-4 h-4" />
              <span>Synchro</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="h-full gradient-sage rounded-full"
          />
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-3 mb-6">
        {sectionConfig.map((section, index) => (
          <PassportSection
            key={section.key}
            icon={section.icon}
            title={section.title}
            description={section.description}
            index={index}
            completed={getSectionCompleted(section.key)}
          />
        ))}
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <Download className="w-5 h-5" />
          <span className="text-xs">Télécharger PDF</span>
        </Button>
        <Button variant="sage" className="h-auto py-4 flex-col gap-2">
          <Shield className="w-5 h-5" />
          <span className="text-xs">Sécuriser</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default Dashboard;
