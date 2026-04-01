import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Heart, Phone, FolderOpen, Wallet, Laptop, ClipboardCheck,
  MessageSquare, Shield, Download, Cloud, LucideIcon, Zap,
  AlertTriangle, Lock, Crown, Cross, ShieldCheck, Scale, KeyRound,
  HeartHandshake, PawPrint,
} from "lucide-react";
import PassportSection from "@/components/PassportSection";
import { Button } from "@/components/ui/button";
import { usePassport } from "@/hooks/usePassport";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, isPremiumSection } from "@/hooks/useSubscription";
import { SectionModal } from "@/components/passport/SectionModal";
import { generatePassportPDF, generateFreePDF } from "@/utils/generatePassportPDF";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ActivatePassportDialog } from "@/components/passport/ActivatePassportDialog";
import { EmergencyActivationDialog } from "@/components/passport/EmergencyActivationDialog";
import { HealthConsentDialog } from "@/components/passport/HealthConsentDialog";

const sectionConfig = [
  { key: "identity", icon: User, title: "Mon identité", description: "Informations personnelles de base" },
  { key: "trusted_person", icon: Heart, title: "Personne de confiance", description: "Celle qui sera contactée en premier" },
  { key: "contacts", icon: Phone, title: "Contacts essentiels", description: "Famille, médecin, notaire..." },
  { key: "documents", icon: FolderOpen, title: "Documents importants", description: "Où les trouver en cas de besoin" },
  { key: "health", icon: Cross, title: "Fiche Santé", description: "Informations médicales essentielles", badge: "Urgence" },
  { key: "administrative", icon: Wallet, title: "Situation financière", description: "Banques, assurances, contrats" },
  { key: "digital", icon: Laptop, title: "Environnement numérique", description: "Comptes en ligne (sans mots de passe)" },
  { key: "checklists", icon: ClipboardCheck, title: "Checklists d'urgence", description: "Que faire en cas de..." },
  { key: "personal_message", icon: MessageSquare, title: "Message personnel", description: "Mots pour vos proches (optionnel)" },
  { key: "insurance", icon: ShieldCheck, title: "Assurances et prévoyance", description: "Contrats, mutuelles, bénéficiaires" },
  { key: "legal_docs", icon: Scale, title: "Documents juridiques", description: "Testament, donations, notaire" },
  { key: "digital_access", icon: KeyRound, title: "Accès numériques", description: "Liste des comptes (sans mots de passe)" },
  { key: "personal_wishes", icon: HeartHandshake, title: "Volontés personnelles", description: "Instructions obsèques et dernières volontés" },
  { key: "pets", icon: PawPrint, title: "Animaux", description: "Vos compagnons et leur prise en charge" },
];

const Dashboard = () => {
  const { passport, loading, getProgress, updateSection } = usePassport();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isPremium, plan, planName, isTrialing, trialDaysLeft } = useSubscription();
  const { completed, total } = getProgress();
  const progress = (completed / total) * 100;

  const [selectedSection, setSelectedSection] = useState<{
    key: string; title: string; icon: LucideIcon;
  } | null>(null);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [showHealthConsent, setShowHealthConsent] = useState(false);
  const [pendingHealthSection, setPendingHealthSection] = useState<{ key: string; title: string; icon: LucideIcon } | null>(null);
  const [healthConsentGiven, setHealthConsentGiven] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("health_consent_given").eq("user_id", user.id).maybeSingle()
        .then(({ data }) => setHealthConsentGiven((data as any)?.health_consent_given ?? false));
    }
  }, [user]);

  const trustedPersonData = passport?.trusted_person_data as Record<string, string> | null;
  const trustedPersonEmail = trustedPersonData?.email;
  const trustedPersonName = trustedPersonData?.fullName;

  const getSectionCompleted = (key: string): boolean => {
    if (!passport) return false;
    const completedKey = `${key}_completed` as keyof typeof passport;
    return Boolean(passport[completedKey]);
  };

  const handleSectionClick = (key: string, title: string, icon: LucideIcon) => {
    if (!isPremium && isPremiumSection(key)) {
      toast({
        title: "Section Premium",
        description: "Passez à la formule Sérénité pour débloquer cette section.",
        variant: "destructive",
      });
      return;
    }
    // Health consent check
    if (key === "health" && !healthConsentGiven) {
      setPendingHealthSection({ key, title, icon });
      setShowHealthConsent(true);
      return;
    }
    setSelectedSection({ key, title, icon });
  };

  const handleHealthConsent = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ health_consent_given: true } as any).eq("user_id", user.id);
    setHealthConsentGiven(true);
    setShowHealthConsent(false);
    if (pendingHealthSection) {
      setSelectedSection(pendingHealthSection);
      setPendingHealthSection(null);
    }
  };

  const handleSaveSection = async (
    sectionKey: string, data: Record<string, unknown>, completed: boolean
  ) => {
    await updateSection(sectionKey, data, completed);
  };

  const handleDownloadPDF = () => {
    if (!passport) {
      toast({ title: "Aucune donnée", description: "Remplissez au moins une section avant de télécharger.", variant: "destructive" });
      return;
    }
    if (completed === 0) {
      toast({ title: "Passeport vide", description: "Complétez au moins une section pour générer le PDF.", variant: "destructive" });
      return;
    }

    if (isPremium) {
      generatePassportPDF(passport);
    } else {
      generateFreePDF(passport);
    }
    toast({ title: "PDF généré", description: isPremium ? "Votre passeport complet a été téléchargé." : "PDF limité aux sections gratuites. Passez à Sérénité pour l'export complet." });
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
      {/* Trial Banner */}
      {isTrialing && trialDaysLeft !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-navy/10 border border-navy/20 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm"
        >
          <Crown className="w-4 h-4 text-navy flex-shrink-0" />
          <span className="text-foreground">
            Essai gratuit — <strong>{trialDaysLeft} jour{trialDaysLeft > 1 ? "s" : ""}</strong> restant{trialDaysLeft > 1 ? "s" : ""}
          </span>
        </motion.div>
      )}

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
        {sectionConfig.map((section, index) => {
          const isLocked = !isPremium && isPremiumSection(section.key);
          return (
            <PassportSection
              key={section.key}
              icon={section.icon}
              title={section.title}
              description={section.description}
              index={index}
              completed={getSectionCompleted(section.key)}
              locked={isLocked}
              badge={(section as any).badge}
              onClick={() => handleSectionClick(section.key, section.title, section.icon)}
            />
          );
        })}
      </div>

      {/* Activate Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-4">
        <Button variant="hero" size="lg" className="w-full h-auto py-4 text-base font-semibold gap-3" onClick={() => setShowActivateDialog(true)}>
          <Zap className="w-5 h-5" />
          Activer mon Passeport de Vie
        </Button>
      </motion.div>

      {/* Emergency Activation Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mb-4">
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

      {/* Sync Button - Family plan only */}
      {plan === "family" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="mb-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-auto py-3 text-sm font-medium gap-2"
            onClick={async () => {
              try {
                await supabase.functions.invoke("emergency-access", {
                  body: { action: "sync_family_notification" },
                });
                toast({ title: "Synchronisation envoyée", description: "Tous les membres de votre famille ont été notifiés." });
              } catch {
                toast({ title: "Erreur", description: "Impossible d'envoyer la notification.", variant: "destructive" });
              }
            }}
          >
            <Cloud className="w-4 h-4" />
            Synchroniser avec ma famille
            {passport?.updated_at && (
              <span className="text-[10px] text-muted-foreground ml-1">
                Dernière MAJ : {new Date(passport.updated_at).toLocaleDateString("fr-FR")}
              </span>
            )}
          </Button>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-auto py-4 flex-col gap-2 relative" onClick={handleDownloadPDF}>
          <Download className="w-5 h-5" />
          <span className="text-xs">Télécharger PDF</span>
          {!isPremium && (
            <span className="absolute top-1 right-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-navy/10 text-navy text-[9px] font-semibold">
              <Crown className="w-2.5 h-2.5" />
              Limité
            </span>
          )}
        </Button>
        <Button variant="sage" className="h-auto py-4 flex-col gap-2" onClick={() => handleSectionClick("trusted_person", "Personne de confiance", Heart)}>
          <Heart className="w-5 h-5" />
          <span className="text-xs">Partager mon passeport</span>
        </Button>
      </motion.div>

      <ActivatePassportDialog
        isOpen={showActivateDialog}
        onClose={() => setShowActivateDialog(false)}
        passport={passport}
        trustedPersonEmail={trustedPersonEmail}
        trustedPersonName={trustedPersonName}
        hasPremiumPlan={isPremium}
      />

      <EmergencyActivationDialog
        isOpen={showEmergencyDialog}
        onClose={() => setShowEmergencyDialog(false)}
      />

      <HealthConsentDialog
        isOpen={showHealthConsent}
        onClose={() => { setShowHealthConsent(false); setPendingHealthSection(null); }}
        onConsent={handleHealthConsent}
      />

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
