import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface DocumentsFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

export const DocumentsForm = ({ data, onSave }: DocumentsFormProps) => {
  const [formData, setFormData] = useState({
    idCardLocation: "",
    passportLocation: "",
    birthCertificateLocation: "",
    marriageCertificateLocation: "",
    drivingLicenseLocation: "",
    otherDocuments: "",
    safeLocation: "",
    safeCode: "",
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
    const hasAnyInfo = Object.values(formData).some((v) => v.trim() !== "");
    onSave(formData, hasAnyInfo);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Indiquez où se trouvent vos documents importants.
      </p>

      <div className="space-y-2">
        <Label htmlFor="idCardLocation">Carte d'identité</Label>
        <Input
          id="idCardLocation"
          value={formData.idCardLocation}
          onChange={(e) => handleChange("idCardLocation", e.target.value)}
          placeholder="Tiroir du bureau, dossier 'Identité'"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="passportLocation">Passeport</Label>
        <Input
          id="passportLocation"
          value={formData.passportLocation}
          onChange={(e) => handleChange("passportLocation", e.target.value)}
          placeholder="Coffre-fort"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthCertificateLocation">Acte de naissance</Label>
        <Input
          id="birthCertificateLocation"
          value={formData.birthCertificateLocation}
          onChange={(e) => handleChange("birthCertificateLocation", e.target.value)}
          placeholder="Classeur vert, étagère bureau"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="marriageCertificateLocation">Livret de famille / Acte de mariage</Label>
        <Input
          id="marriageCertificateLocation"
          value={formData.marriageCertificateLocation}
          onChange={(e) => handleChange("marriageCertificateLocation", e.target.value)}
          placeholder="Classeur vert, étagère bureau"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="drivingLicenseLocation">Permis de conduire</Label>
        <Input
          id="drivingLicenseLocation"
          value={formData.drivingLicenseLocation}
          onChange={(e) => handleChange("drivingLicenseLocation", e.target.value)}
          placeholder="Portefeuille ou tiroir entrée"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="otherDocuments">Autres documents importants</Label>
        <Textarea
          id="otherDocuments"
          value={formData.otherDocuments}
          onChange={(e) => handleChange("otherDocuments", e.target.value)}
          placeholder="Testament, contrats, diplômes..."
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
