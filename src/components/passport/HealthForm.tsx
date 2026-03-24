import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Plus, Trash2 } from "lucide-react";

interface Specialist {
  specialty: string;
  name: string;
  phone: string;
}

interface Treatment {
  medication: string;
  dosage: string;
  frequency: string;
}

interface HealthFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

export const HealthForm = ({ data, onSave }: HealthFormProps) => {
  const [formData, setFormData] = useState({
    bloodType: "",
    allergies: "",
    doctorName: "",
    doctorPhone: "",
    doctorAddress: "",
    socialSecurityNumber: "",
    medicalHistory: "",
    hasAdvanceDirectives: "no",
    advanceDirectivesLocation: "",
  });

  const [specialists, setSpecialists] = useState<Specialist[]>([{ specialty: "", name: "", phone: "" }]);
  const [treatments, setTreatments] = useState<Treatment[]>([{ medication: "", dosage: "", frequency: "" }]);

  useEffect(() => {
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      setFormData((prev) => ({
        ...prev,
        bloodType: (d.bloodType as string) || "",
        allergies: (d.allergies as string) || "",
        doctorName: (d.doctorName as string) || "",
        doctorPhone: (d.doctorPhone as string) || "",
        doctorAddress: (d.doctorAddress as string) || "",
        socialSecurityNumber: (d.socialSecurityNumber as string) || "",
        medicalHistory: (d.medicalHistory as string) || "",
        hasAdvanceDirectives: (d.hasAdvanceDirectives as string) || "no",
        advanceDirectivesLocation: (d.advanceDirectivesLocation as string) || "",
      }));
      if (d.specialists && Array.isArray(d.specialists) && d.specialists.length > 0) {
        setSpecialists(d.specialists as Specialist[]);
      }
      if (d.treatments && Array.isArray(d.treatments) && d.treatments.length > 0) {
        setTreatments(d.treatments as Treatment[]);
      }
    }
  }, [data]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSpecialist = () => setSpecialists([...specialists, { specialty: "", name: "", phone: "" }]);
  const removeSpecialist = (i: number) => setSpecialists(specialists.filter((_, idx) => idx !== i));
  const updateSpecialist = (i: number, field: keyof Specialist, value: string) => {
    const updated = [...specialists];
    updated[i] = { ...updated[i], [field]: value };
    setSpecialists(updated);
  };

  const addTreatment = () => setTreatments([...treatments, { medication: "", dosage: "", frequency: "" }]);
  const removeTreatment = (i: number) => setTreatments(treatments.filter((_, idx) => idx !== i));
  const updateTreatment = (i: number, field: keyof Treatment, value: string) => {
    const updated = [...treatments];
    updated[i] = { ...updated[i], [field]: value };
    setTreatments(updated);
  };

  const handleSubmit = () => {
    const isComplete = formData.bloodType.trim() !== "";
    onSave({ ...formData, specialists, treatments }, isComplete);
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="space-y-6">
      {/* Groupe sanguin */}
      <div className="space-y-2">
        <Label>Groupe sanguin + rhésus *</Label>
        <Select value={formData.bloodType} onValueChange={(v) => handleChange("bloodType", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez votre groupe sanguin" />
          </SelectTrigger>
          <SelectContent>
            {bloodTypes.map((bt) => (
              <SelectItem key={bt} value={bt}>{bt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Allergies */}
      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies médicamenteuses</Label>
        <Textarea
          id="allergies"
          value={formData.allergies}
          onChange={(e) => handleChange("allergies", e.target.value)}
          placeholder="Pénicilline, aspirine..."
          rows={3}
        />
      </div>

      {/* Médecin traitant */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Médecin traitant</Label>
        <div className="space-y-2">
          <Input
            value={formData.doctorName}
            onChange={(e) => handleChange("doctorName", e.target.value)}
            placeholder="Nom du médecin"
          />
          <Input
            value={formData.doctorPhone}
            onChange={(e) => handleChange("doctorPhone", e.target.value)}
            placeholder="Téléphone"
            type="tel"
          />
          <Input
            value={formData.doctorAddress}
            onChange={(e) => handleChange("doctorAddress", e.target.value)}
            placeholder="Adresse du cabinet"
          />
        </div>
      </div>

      {/* Spécialistes */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Spécialistes suivis</Label>
        {specialists.map((spec, i) => (
          <div key={i} className="border border-border rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Spécialiste {i + 1}</span>
              {specialists.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecialist(i)} className="h-7 w-7">
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              )}
            </div>
            <Input value={spec.specialty} onChange={(e) => updateSpecialist(i, "specialty", e.target.value)} placeholder="Spécialité (cardiologue, dermatologue...)" />
            <Input value={spec.name} onChange={(e) => updateSpecialist(i, "name", e.target.value)} placeholder="Nom" />
            <Input value={spec.phone} onChange={(e) => updateSpecialist(i, "phone", e.target.value)} placeholder="Téléphone" type="tel" />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addSpecialist} className="w-full gap-1">
          <Plus className="w-4 h-4" /> Ajouter un spécialiste
        </Button>
      </div>

      {/* Traitements */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Traitements en cours</Label>
        {treatments.map((tr, i) => (
          <div key={i} className="border border-border rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Traitement {i + 1}</span>
              {treatments.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeTreatment(i)} className="h-7 w-7">
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              )}
            </div>
            <Input value={tr.medication} onChange={(e) => updateTreatment(i, "medication", e.target.value)} placeholder="Médicament" />
            <div className="grid grid-cols-2 gap-2">
              <Input value={tr.dosage} onChange={(e) => updateTreatment(i, "dosage", e.target.value)} placeholder="Dosage" />
              <Input value={tr.frequency} onChange={(e) => updateTreatment(i, "frequency", e.target.value)} placeholder="Fréquence" />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addTreatment} className="w-full gap-1">
          <Plus className="w-4 h-4" /> Ajouter un traitement
        </Button>
      </div>

      {/* N° sécu */}
      <div className="space-y-2">
        <Label htmlFor="socialSecurityNumber">Numéro de sécurité sociale</Label>
        <Input
          id="socialSecurityNumber"
          value={formData.socialSecurityNumber}
          onChange={(e) => handleChange("socialSecurityNumber", e.target.value)}
          placeholder="1 XX XX XX XXX XXX XX"
        />
      </div>

      {/* Antécédents */}
      <div className="space-y-2">
        <Label htmlFor="medicalHistory">Antécédents médicaux importants</Label>
        <Textarea
          id="medicalHistory"
          value={formData.medicalHistory}
          onChange={(e) => handleChange("medicalHistory", e.target.value)}
          placeholder="Opérations, maladies chroniques..."
          rows={3}
        />
      </div>

      {/* Directives anticipées */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Directives anticipées</Label>
        <RadioGroup value={formData.hasAdvanceDirectives} onValueChange={(v) => handleChange("hasAdvanceDirectives", v)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="directives-yes" />
            <Label htmlFor="directives-yes">Oui, j'ai rédigé des directives anticipées</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="directives-no" />
            <Label htmlFor="directives-no">Non</Label>
          </div>
        </RadioGroup>
        {formData.hasAdvanceDirectives === "yes" && (
          <Input
            value={formData.advanceDirectivesLocation}
            onChange={(e) => handleChange("advanceDirectivesLocation", e.target.value)}
            placeholder="Où se trouve le document ?"
          />
        )}
      </div>

      <Button onClick={handleSubmit} className="w-full gap-2" size="lg">
        <Save className="w-4 h-4" />
        Enregistrer
      </Button>
    </div>
  );
};
