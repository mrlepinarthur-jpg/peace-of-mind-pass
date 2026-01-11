import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface TrustedPersonFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

export const TrustedPersonForm = ({ data, onSave }: TrustedPersonFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    relationship: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
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
    const isComplete =
      formData.fullName.trim() !== "" && formData.phone.trim() !== "";
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
          <Label htmlFor="email">Email</Label>
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

      <Button onClick={handleSubmit} className="w-full" variant="sage">
        <Save className="w-4 h-4 mr-2" />
        Sauvegarder
      </Button>
    </div>
  );
};
