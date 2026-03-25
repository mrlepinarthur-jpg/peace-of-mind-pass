import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface LegalDocsFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

interface Donation {
  description: string;
  date: string;
  beneficiary: string;
}

export const LegalDocsForm = ({ data, onSave }: LegalDocsFormProps) => {
  const [hasTestament, setHasTestament] = useState((data.hasTestament as string) || "no");
  const [testamentLocation, setTestamentLocation] = useState((data.testamentLocation as string) || "");
  const [hasMarriageContract, setHasMarriageContract] = useState((data.hasMarriageContract as string) || "no");
  const [marriageContractType, setMarriageContractType] = useState((data.marriageContractType as string) || "");
  const [notaryName, setNotaryName] = useState((data.notaryName as string) || "");
  const [notaryAddress, setNotaryAddress] = useState((data.notaryAddress as string) || "");
  const [notaryPhone, setNotaryPhone] = useState((data.notaryPhone as string) || "");
  const [donations, setDonations] = useState<Donation[]>(
    (data.donations as Donation[]) || []
  );

  const addDonation = () => setDonations([...donations, { description: "", date: "", beneficiary: "" }]);
  const removeDonation = (i: number) => setDonations(donations.filter((_, idx) => idx !== i));
  const updateDonation = (i: number, field: keyof Donation, value: string) => {
    const updated = [...donations];
    updated[i] = { ...updated[i], [field]: value };
    setDonations(updated);
  };

  const handleSubmit = () => {
    const formData = {
      hasTestament, testamentLocation, hasMarriageContract, marriageContractType,
      notaryName, notaryAddress, notaryPhone, donations,
    };
    const hasData = hasTestament === "yes" || hasMarriageContract === "yes" || notaryName.trim() !== "";
    onSave(formData, hasData);
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Testament</h3>
        <div>
          <Label>Avez-vous rédigé un testament ?</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={hasTestament} onChange={(e) => setHasTestament(e.target.value)}>
            <option value="no">Non</option>
            <option value="yes">Oui</option>
          </select>
        </div>
        {hasTestament === "yes" && (
          <div>
            <Label>Lieu de conservation</Label>
            <Input value={testamentLocation} onChange={(e) => setTestamentLocation(e.target.value)} placeholder="Chez le notaire, coffre-fort..." />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Donations effectuées</h3>
        {donations.map((d, i) => (
          <div key={i} className="space-y-2 p-3 bg-muted/50 rounded-xl relative">
            {donations.length > 0 && (
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-destructive" onClick={() => removeDonation(i)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
            <Input value={d.description} onChange={(e) => updateDonation(i, "description", e.target.value)} placeholder="Description" />
            <Input type="date" value={d.date} onChange={(e) => updateDonation(i, "date", e.target.value)} />
            <Input value={d.beneficiary} onChange={(e) => updateDonation(i, "beneficiary", e.target.value)} placeholder="Bénéficiaire" />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addDonation} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter une donation
        </Button>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Contrat de mariage</h3>
        <div>
          <Label>Avez-vous un contrat de mariage ?</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={hasMarriageContract} onChange={(e) => setHasMarriageContract(e.target.value)}>
            <option value="no">Non</option>
            <option value="yes">Oui</option>
          </select>
        </div>
        {hasMarriageContract === "yes" && (
          <div>
            <Label>Type de régime</Label>
            <Input value={marriageContractType} onChange={(e) => setMarriageContractType(e.target.value)} placeholder="Communauté réduite, séparation de biens..." />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Coordonnées du notaire</h3>
        <div>
          <Label>Nom</Label>
          <Input value={notaryName} onChange={(e) => setNotaryName(e.target.value)} placeholder="Maître..." />
        </div>
        <div>
          <Label>Adresse</Label>
          <Input value={notaryAddress} onChange={(e) => setNotaryAddress(e.target.value)} placeholder="Adresse du cabinet" />
        </div>
        <div>
          <Label>Téléphone</Label>
          <Input value={notaryPhone} onChange={(e) => setNotaryPhone(e.target.value)} placeholder="Numéro de téléphone" />
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full" variant="hero">Sauvegarder</Button>
    </div>
  );
};
