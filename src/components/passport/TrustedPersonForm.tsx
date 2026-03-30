import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Shield, KeyRound, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface TrustedPersonFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

export const TrustedPersonForm = ({ data, onSave }: TrustedPersonFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    firstName: "",
    dateOfBirth: "",
    relationship: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const [securityMethod, setSecurityMethod] = useState<"none" | "code" | "question">("none");
  const [securityCode, setSecurityCode] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  useEffect(() => {
    if (data && typeof data === "object") {
      setFormData((prev) => ({ ...prev, ...(data as typeof formData) }));
    }
  }, [data]);

  // Load existing trusted_access config
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: ta } = await supabase
        .from("trusted_access")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (ta) {
        setSecurityMethod(ta.security_method as "none" | "code" | "question");
        setSecurityCode(ta.security_code || "");
        setSecurityQuestion(ta.security_question || "");
        setSecurityAnswer(ta.security_answer || "");
      }
    };
    load();
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const isComplete =
      formData.fullName.trim() !== "" && formData.phone.trim() !== "";

    // Save trusted_access config
    if (user && formData.fullName.trim() && formData.email.trim()) {
      const accessData = {
        user_id: user.id,
        trusted_name: formData.fullName.trim(),
        trusted_email: formData.email.toLowerCase().trim(),
        security_method: securityMethod,
        security_code: securityMethod === "code" ? securityCode : null,
        security_question: securityMethod === "question" ? securityQuestion : null,
        security_answer: securityMethod === "question" ? securityAnswer : null,
      };

      const { data: existing } = await supabase
        .from("trusted_access")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("trusted_access").update(accessData).eq("user_id", user.id);
      } else {
        await supabase.from("trusted_access").insert(accessData);
      }

      toast({
        title: "Configuration d'accès sauvegardée",
        description: "Les paramètres de sécurité ont été mis à jour.",
      });
    }

    onSave(formData, isComplete);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nom complet *</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder="Marie Dupont"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          placeholder="Marie"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date de naissance</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="relationship">Lien (famille, ami...)</Label>
        <Input
          id="relationship"
          value={formData.relationship}
          onChange={(e) => handleChange("relationship", e.target.value)}
          placeholder="Épouse, frère, ami proche..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="06 12 34 56 78"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="marie@email.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="456 avenue des Champs"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes complémentaires</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Informations utiles à connaître..."
          rows={3}
        />
      </div>

      {/* Security method section */}
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Méthode de sécurité pour l'accès d'urgence</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Choisissez comment la personne de confiance pourra vérifier son identité pour accéder à votre passeport en cas d'urgence.
        </p>

        <RadioGroup
          value={securityMethod}
          onValueChange={(v) => setSecurityMethod(v as "none" | "code" | "question")}
          className="space-y-3"
        >
          <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="none" id="sec-none" className="mt-0.5" />
            <div>
              <Label htmlFor="sec-none" className="font-medium cursor-pointer">Aucune vérification supplémentaire</Label>
              <p className="text-xs text-muted-foreground">OTP par email uniquement. Le titulaire sera notifié avec un délai d'1h avant l'accès.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="code" id="sec-code" className="mt-0.5" />
            <div className="flex-1">
              <Label htmlFor="sec-code" className="font-medium cursor-pointer flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Code à 6 chiffres
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Accès instantané avec le bon code</p>
              {securityMethod === "code" && (
                <Input
                  type="text"
                  maxLength={6}
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  className="max-w-[150px]"
                />
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="question" id="sec-question" className="mt-0.5" />
            <div className="flex-1">
              <Label htmlFor="sec-question" className="font-medium cursor-pointer flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Question secrète
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Accès instantané avec la bonne réponse</p>
              {securityMethod === "question" && (
                <div className="space-y-2">
                  <Input
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    placeholder="Ex: Nom de notre animal de compagnie ?"
                  />
                  <Input
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="Réponse..."
                  />
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
      </div>

      <Button onClick={handleSubmit} className="w-full" variant="sage">
        <Save className="w-4 h-4 mr-2" />
        Sauvegarder
      </Button>
    </div>
  );
};
