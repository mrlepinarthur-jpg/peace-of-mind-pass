import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface ChecklistsFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

export const ChecklistsForm = ({ data, onSave }: ChecklistsFormProps) => {
  const [formData, setFormData] = useState({
    hospitalization: "",
    death: "",
    incapacity: "",
    emergencyContacts: "",
    pets: "",
    other: "",
  });

  useEffect(() => {
    if (data && typeof data === "object") {
      setFormData((prev) => ({ ...prev, ...(data as typeof formData) }));
    }
  }, [data]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const hasInfo = Object.values(formData).some((v) => v.trim() !== "");
    onSave(formData, hasInfo);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Que doivent faire vos proches en cas d'urgence ? Notez les instructions importantes.
      </p>

      <div className="space-y-2">
        <Label htmlFor="hospitalization">En cas d'hospitalisation</Label>
        <Textarea
          id="hospitalization"
          value={formData.hospitalization}
          onChange={(e) => handleChange("hospitalization", e.target.value)}
          placeholder="Prévenir X, récupérer les médicaments à Y, nourrir le chat..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="incapacity">En cas d'incapacité prolongée</Label>
        <Textarea
          id="incapacity"
          value={formData.incapacity}
          onChange={(e) => handleChange("incapacity", e.target.value)}
          placeholder="Contacter le notaire, procuration bancaire, assurance dépendance..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="death">En cas de décès</Label>
        <Textarea
          id="death"
          value={formData.death}
          onChange={(e) => handleChange("death", e.target.value)}
          placeholder="Pompes funèbres préférées, souhaits particuliers, contacts à prévenir..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pets">Animaux de compagnie</Label>
        <Textarea
          id="pets"
          value={formData.pets}
          onChange={(e) => handleChange("pets", e.target.value)}
          placeholder="Nom, vétérinaire, personne qui peut les garder..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergencyContacts">Numéros d'urgence à appeler</Label>
        <Textarea
          id="emergencyContacts"
          value={formData.emergencyContacts}
          onChange={(e) => handleChange("emergencyContacts", e.target.value)}
          placeholder="15 SAMU, 18 Pompiers, médecin traitant..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="other">Autres instructions</Label>
        <Textarea
          id="other"
          value={formData.other}
          onChange={(e) => handleChange("other", e.target.value)}
          placeholder="Tout ce qui vous semble important..."
          rows={3}
        />
      </div>

      <Button onClick={handleSubmit} className="w-full" variant="sage">
        <Save className="w-4 h-4 mr-2" />
        Sauvegarder
      </Button>
    </div>
  );
};
