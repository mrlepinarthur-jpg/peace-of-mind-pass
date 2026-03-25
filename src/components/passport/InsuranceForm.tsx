import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface InsuranceFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

interface InsuranceContract {
  type: string;
  company: string;
  contractNumber: string;
  beneficiaries: string;
  expiry: string;
}

export const InsuranceForm = ({ data, onSave }: InsuranceFormProps) => {
  const [contracts, setContracts] = useState<InsuranceContract[]>(
    (data.contracts as InsuranceContract[]) || [
      { type: "Assurance-vie", company: "", contractNumber: "", beneficiaries: "", expiry: "" },
    ]
  );
  const [mutuelle, setMutuelle] = useState({
    company: (data.mutuelleCompany as string) || "",
    number: (data.mutuelleNumber as string) || "",
    cardLocation: (data.mutuelleCardLocation as string) || "",
  });

  const addContract = () => {
    setContracts([...contracts, { type: "", company: "", contractNumber: "", beneficiaries: "", expiry: "" }]);
  };

  const removeContract = (index: number) => {
    setContracts(contracts.filter((_, i) => i !== index));
  };

  const updateContract = (index: number, field: keyof InsuranceContract, value: string) => {
    const updated = [...contracts];
    updated[index] = { ...updated[index], [field]: value };
    setContracts(updated);
  };

  const handleSubmit = () => {
    const formData = { contracts, ...mutuelle, mutuelleCompany: mutuelle.company, mutuelleNumber: mutuelle.number, mutuelleCardLocation: mutuelle.cardLocation };
    const hasData = contracts.some(c => c.company.trim()) || mutuelle.company.trim();
    onSave(formData, hasData);
  };

  const contractTypes = ["Assurance-vie", "Assurance décès/obsèques", "Assurance habitation", "Assurance auto", "Autre"];

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Contrats d'assurance</h3>
        {contracts.map((contract, index) => (
          <div key={index} className="space-y-3 p-4 bg-muted/50 rounded-xl relative">
            {contracts.length > 1 && (
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-destructive" onClick={() => removeContract(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <div>
              <Label>Type de contrat</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={contract.type} onChange={(e) => updateContract(index, "type", e.target.value)}>
                <option value="">Sélectionner...</option>
                {contractTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <Label>Compagnie</Label>
              <Input value={contract.company} onChange={(e) => updateContract(index, "company", e.target.value)} placeholder="Nom de la compagnie" />
            </div>
            <div>
              <Label>N° de contrat</Label>
              <Input value={contract.contractNumber} onChange={(e) => updateContract(index, "contractNumber", e.target.value)} placeholder="Numéro du contrat" />
            </div>
            <div>
              <Label>Bénéficiaires</Label>
              <Input value={contract.beneficiaries} onChange={(e) => updateContract(index, "beneficiaries", e.target.value)} placeholder="Noms des bénéficiaires" />
            </div>
            <div>
              <Label>Date d'échéance</Label>
              <Input type="date" value={contract.expiry} onChange={(e) => updateContract(index, "expiry", e.target.value)} />
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addContract} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter un contrat
        </Button>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Mutuelle santé</h3>
        <div>
          <Label>Compagnie</Label>
          <Input value={mutuelle.company} onChange={(e) => setMutuelle({ ...mutuelle, company: e.target.value })} placeholder="Nom de la mutuelle" />
        </div>
        <div>
          <Label>Numéro adhérent</Label>
          <Input value={mutuelle.number} onChange={(e) => setMutuelle({ ...mutuelle, number: e.target.value })} placeholder="Numéro d'adhérent" />
        </div>
        <div>
          <Label>Où est la carte mutuelle ?</Label>
          <Input value={mutuelle.cardLocation} onChange={(e) => setMutuelle({ ...mutuelle, cardLocation: e.target.value })} placeholder="Emplacement de la carte" />
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full" variant="hero">Sauvegarder</Button>
    </div>
  );
};
