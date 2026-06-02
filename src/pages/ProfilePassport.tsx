import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Heart, Phone, FolderOpen, Wallet, Laptop, ClipboardCheck,
  MessageSquare, Shield, ArrowLeft, LucideIcon, Cross, ShieldCheck,
  Scale, KeyRound, HeartHandshake, PawPrint, Lock,
} from "lucide-react";
import PassportSection from "@/components/PassportSection";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, isPremiumSection } from "@/hooks/useSubscription";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles";
import { SectionModal } from "@/components/passport/SectionModal";
import { useToast } from "@/hooks/use-toast";
import { PassportData } from "@/hooks/usePassport";

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
  { key: "personal_wishes", icon: HeartHandshake, title: "Volontés personnelles", description: "Instructions obsèques" },
  { key: "pets", icon: PawPrint, title: "Animaux", description: "Vos compagnons" },
];

const ProfilePassport = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { profiles, loading, updateProfileData } = useFamilyProfiles();
  const { isPremium, planName } = useSubscription();

  const profile = useMemo(
    () => profiles.find((p) => p.id === profileId),
    [profiles, profileId]
  );

  const [ownerName, setOwnerName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    // owner is current user (only owners reach this view)
    setOwnerName(user.user_metadata?.full_name || user.email?.split("@")[0] || "vous");
  }, [user]);

  const [selectedSection, setSelectedSection] = useState<{
    key: string; title: string; icon: LucideIcon;
  } | null>(null);

  // Build a PassportData-shaped object from family_profiles.passport_data
  const passportShim = useMemo(() => {
    if (!profile) return null;
    const data = profile.passport_data || {};
    const shim: any = { id: profile.id, updated_at: profile.updated_at };
    sectionConfig.forEach(({ key }) => {
      shim[`${key}_data`] = data[`${key}_data`] || {};
      shim[`${key}_completed`] = data[`${key}_completed`] || false;
    });
    return shim as PassportData;
  }, [profile]);

  const handleSectionClick = (key: string, title: string, icon: LucideIcon) => {
    if (!isPremium && isPremiumSection(key)) {
      toast({
        title: "Section Premium",
        description: "Passez à un plan supérieur pour débloquer cette section.",
        variant: "destructive",
      });
      return;
    }
    setSelectedSection({ key, title, icon });
  };

  const handleSave = async (sectionKey: string, data: Record<string, unknown>, completed: boolean) => {
    if (!profile) return;
    const next = {
      ...(profile.passport_data || {}),
      [`${sectionKey}_data`]: data,
      [`${sectionKey}_completed`]: completed,
    };
    await updateProfileData(profile.id, next);
    toast({ title: "Sauvegardé" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Profil introuvable.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Retour</Button>
      </div>
    );
  }

  const displayName = `${profile.first_name} ${profile.last_name}`.trim() || profile.invite_email || "Profil";
  const sectionsCompleted = sectionConfig.filter((s) => passportShim && (passportShim as any)[`${s.key}_completed`]).length;

  return (
    <div className="pb-24">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-3 gap-2">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Button>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary/5 border border-primary/15 rounded-xl p-3 mb-4 text-sm text-foreground flex items-center gap-2"
      >
        <Shield className="w-4 h-4 text-primary" />
        Passeport de <strong>{displayName}</strong> — géré par <strong>{ownerName}</strong>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-5 shadow-card mb-6 flex items-center gap-4"
      >
        <div className="w-14 h-14 gradient-hero rounded-xl flex items-center justify-center">
          <User className="w-7 h-7 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg text-foreground">{displayName}</h2>
          <p className="text-sm text-muted-foreground">
            {sectionsCompleted}/{sectionConfig.length} sections complétées · Plan {planName}
          </p>
        </div>
      </motion.div>

      <div className="space-y-3">
        {sectionConfig.map((section, index) => {
          const isLocked = !isPremium && isPremiumSection(section.key);
          return (
            <PassportSection
              key={section.key}
              icon={section.icon}
              title={section.title}
              description={section.description}
              index={index}
              completed={Boolean(passportShim && (passportShim as any)[`${section.key}_completed`])}
              locked={isLocked}
              badge={(section as any).badge}
              onClick={() => handleSectionClick(section.key, section.title, section.icon)}
            />
          );
        })}
      </div>

      {selectedSection && passportShim && (
        <SectionModal
          isOpen={!!selectedSection}
          onClose={() => setSelectedSection(null)}
          sectionKey={selectedSection.key}
          title={selectedSection.title}
          icon={selectedSection.icon}
          passport={passportShim}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProfilePassport;
