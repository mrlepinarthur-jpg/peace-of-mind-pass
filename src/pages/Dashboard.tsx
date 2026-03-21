import { useState } from "react";
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
  LucideIcon,
  Zap,
  AlertTriangle,
  Lock,
} from "lucide-react";
import PassportSection from "@/components/PassportSection";
import { Button } from "@/components/ui/button";
import { usePassport } from "@/hooks/usePassport";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { SectionModal } from "@/components/passport/SectionModal";
import { generatePassportPDF } from "@/utils/generatePassportPDF";
import { useToast } from "@/hooks/use-toast";
import { ActivatePassportDialog } from "@/components/passport/ActivatePassportDialog";
import { EmergencyActivationDialog } from "@/components/passport/EmergencyActivationDialog";
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
  const { passport, loading, getProgress, updateSection } = usePassport();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isPremium, planName } = useSubscription();
  const { completed, total } = getProgress();
  const progress = (completed / total) * 100;

  const [selectedSection, setSelectedSection] = useState<{
    key: string;
    title: string;
    icon: LucideIcon;
  } | null>(null);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  // Get trusted person info from passport data
  const trustedPersonData = passport?.trusted_person_data as Record<string, string> | null;
  const trustedPersonEmail = trustedPersonData?.email;
  const trustedPersonName = trustedPersonData?.fullName;

  const getSectionCompleted = (key: string): boolean => {
    if (!passport) return false;
    const completedKey = `${key}_completed` as keyof typeof passport;
    return Boolean(passport[completedKey]);
  };

  const handleSectionClick = (key: string, title: string, icon: LucideIcon) => {
    setSelectedSection({ key, title, icon });
  };

  const handleSaveSection = async (
    sectionKey: string,
    data: Record<string, unknown>,
    completed: boolean
  ) => {
    await updateSection(sectionKey, data, completed);
  };

  const handleDownloadPDF = () => {
    if (!passport) {
      toast({
        title: "Aucune donnée",
        description: "Remplissez au moins une section avant de télécharger.",
        variant: "destructive",
      });
      return;
    }

    if (completed === 0) {
      toast({
        title: "Passeport vide",
        description: "Complétez au moins une section pour générer le PDF.",
        variant: "destructive",
      });
      return;
    }

    generatePassportPDF(passport);
    toast({
      title: "PDF généré",
      description: "Votre passeport a été téléchargé.",
    });
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
            onClick={() => handleSectionClick(section.key, section.title, section.icon)}
          />
        ))}
      </div>

      {/* Activate Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-4"
      >
        <Button
          variant="hero"
          size="lg"
          className="w-full h-auto py-4 text-base font-semibold gap-3"
          onClick={() => setShowActivateDialog(true)}
        >
          <Zap className="w-5 h-5" />
          Activer mon Passeport de Vie
        </Button>
      </motion.div>

      {/* Emergency Activation Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-4"
      >
        <Button
          variant="destructive"
          size="lg"
          className="w-full h-auto py-4 text-base font-semibold gap-3 relative"
          onClick={() => isPremium ? setShowEmergencyDialog(true) : null}
          disabled={!isPremium}
        >
          {!isPremium && <Lock className="w-5 h-5 absolute left-4" />}
          <AlertTriangle className="w-5 h-5" />
          {isPremium ? "Activer mon Passeport d'Urgence" : "Passeport d'Urgence (Premium)"}
        </Button>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button
          variant="outline"
          className="h-auto py-4 flex-col gap-2"
          onClick={handleDownloadPDF}
        >
          <Download className="w-5 h-5" />
          <span className="text-xs">Télécharger PDF</span>
        </Button>
        <Button variant="sage" className="h-auto py-4 flex-col gap-2">
          <Shield className="w-5 h-5" />
          <span className="text-xs">Sécuriser</span>
        </Button>
      </motion.div>

      {/* Activate Passport Dialog */}
      <ActivatePassportDialog
        isOpen={showActivateDialog}
        onClose={() => setShowActivateDialog(false)}
        passport={passport}
        trustedPersonEmail={trustedPersonEmail}
        trustedPersonName={trustedPersonName}
        hasPremiumPlan={isPremium}
      />

      {/* Emergency Activation Dialog */}
      <EmergencyActivationDialog
        isOpen={showEmergencyDialog}
        onClose={() => setShowEmergencyDialog(false)}
      />

      {/* Section Modal */}
      {selectedSection && (
        <SectionModal
          isOpen={!!selectedSection}
          onClose={() => setSelectedSection(null)}
          sectionKey={selectedSection.key}
          title={selectedSection.title}
          icon={selectedSection.icon}
          passport={passport}
          onSave={handleSaveSection}
        />
      )}
    </div>
  );
};

export default Dashboard;
