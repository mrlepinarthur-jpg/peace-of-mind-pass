import { Lock } from "lucide-react";

const bannerMessages: Record<string, string> = {
  health: "Données médicales chiffrées — accessibles uniquement par vous et vos personnes de confiance autorisées",
  legal_docs: "Documents juridiques sécurisés — visibles uniquement par vous",
  digital_access: "Aucun mot de passe stocké — uniquement les informations de connexion non sensibles",
  administrative: "Informations financières chiffrées — accessibles uniquement par vous",
  insurance: "Données d'assurance sécurisées — visibles uniquement par vous",
};

interface SecurityBannerProps {
  sectionKey: string;
  isCompleted: boolean;
}

export const SecurityBanner = ({ sectionKey, isCompleted }: SecurityBannerProps) => {
  const message = bannerMessages[sectionKey];
  if (!message || isCompleted) return null;

  return (
    <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-primary/5 border border-primary/10">
      <Lock className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
      <span className="text-xs text-muted-foreground leading-snug">{message}</span>
    </div>
  );
};
