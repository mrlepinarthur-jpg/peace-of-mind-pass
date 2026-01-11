import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface PersonalMessageFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

export const PersonalMessageForm = ({ data, onSave }: PersonalMessageFormProps) => {
  const [formData, setFormData] = useState({
    message: "",
    wishes: "",
    advice: "",
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
      <div className="p-4 bg-sage-light/50 rounded-xl">
        <p className="text-sm text-muted-foreground">
          💝 Cette section est optionnelle. Elle vous permet de laisser un message personnel à vos proches.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message pour mes proches</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Ce que vous aimeriez leur dire..."
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="wishes">Mes dernières volontés</Label>
        <Textarea
          id="wishes"
          value={formData.wishes}
          onChange={(e) => handleChange("wishes", e.target.value)}
          placeholder="Souhaits pour les obsèques, don d'organes, etc."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="advice">Conseils pour la suite</Label>
        <Textarea
          id="advice"
          value={formData.advice}
          onChange={(e) => handleChange("advice", e.target.value)}
          placeholder="Ce que vous aimeriez transmettre..."
          rows={4}
        />
      </div>

      <Button onClick={handleSubmit} className="w-full" variant="sage">
        <Save className="w-4 h-4 mr-2" />
        Sauvegarder
      </Button>
    </div>
  );
};
