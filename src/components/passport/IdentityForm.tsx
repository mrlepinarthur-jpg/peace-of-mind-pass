import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface IdentityFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

export const IdentityForm = ({ data, onSave }: IdentityFormProps) => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    birthDate: "",
    birthPlace: "",
    nationality: "",
    address: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
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
      formData.lastName.trim() !== "" &&
      formData.firstName.trim() !== "" &&
      formData.birthDate.trim() !== "";
    onSave(formData, isComplete);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Dupont"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="Jean"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de naissance *</Label>
          <Input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthPlace">Lieu de naissance</Label>
          <Input
            id="birthPlace"
            value={formData.birthPlace}
            onChange={(e) => handleChange("birthPlace", e.target.value)}
            placeholder="Paris"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nationality">Nationalité</Label>
        <Input
          id="nationality"
          value={formData.nationality}
          onChange={(e) => handleChange("nationality", e.target.value)}
          placeholder="Française"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="123 rue de la Paix"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Code postal</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
            placeholder="75001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="Paris"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
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
            placeholder="jean.dupont@email.com"
          />
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full" variant="sage">
        <Save className="w-4 h-4 mr-2" />
        Sauvegarder
      </Button>
    </div>
  );
};
