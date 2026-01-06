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
} from "lucide-react";
import PassportSection from "@/components/PassportSection";
import { Button } from "@/components/ui/button";

const sections = [
  {
    icon: User,
    title: "Mon identité",
    description: "Informations personnelles de base",
    completed: true,
  },
  {
    icon: Heart,
    title: "Personne de confiance",
    description: "Celle qui sera contactée en premier",
    completed: true,
  },
  {
    icon: Phone,
    title: "Contacts essentiels",
    description: "Famille, médecin, notaire...",
    completed: false,
  },
  {
    icon: FolderOpen,
    title: "Documents importants",
    description: "Où les trouver en cas de besoin",
    completed: false,
  },
  {
    icon: Wallet,
    title: "Situation financière",
    description: "Banques, assurances, contrats",
    completed: false,
  },
  {
    icon: Laptop,
    title: "Environnement numérique",
    description: "Comptes en ligne (sans mots de passe)",
    completed: false,
  },
  {
    icon: ClipboardCheck,
    title: "Checklists d'urgence",
    description: "Que faire en cas de...",
    completed: false,
  },
  {
    icon: MessageSquare,
    title: "Message personnel",
    description: "Mots pour vos proches (optionnel)",
    completed: false,
  },
];

const Dashboard = () => {
  const completedCount = sections.filter((s) => s.completed).length;
  const progress = (completedCount / sections.length) * 100;

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
          <div>
            <h2 className="font-bold text-lg text-foreground">Mon Passeport</h2>
            <p className="text-sm text-muted-foreground">
              {completedCount}/{sections.length} sections complétées
            </p>
          </div>
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
        {sections.map((section, index) => (
          <PassportSection
            key={section.title}
            icon={section.icon}
            title={section.title}
            description={section.description}
            index={index}
            completed={section.completed}
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
