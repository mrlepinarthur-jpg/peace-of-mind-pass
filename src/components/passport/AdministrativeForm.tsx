import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2 } from "lucide-react";

interface BankAccount {
  bank: string;
  accountType: string;
  notes: string;
}

interface AdministrativeFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

export const AdministrativeForm = ({ data, onSave }: AdministrativeFormProps) => {
  const [formData, setFormData] = useState({
    mainBank: "",
    insuranceCompany: "",
    insuranceContract: "",
    taxNumber: "",
    socialSecurityNumber: "",
    employer: "",
    pension: "",
    otherInfo: "",
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { bank: "", accountType: "", notes: "" },
  ]);

  useEffect(() => {
    if (data && typeof data === "object") {
      const typedData = data as typeof formData & { bankAccounts?: BankAccount[] };
      setFormData((prev) => ({ ...prev, ...typedData }));
      if (Array.isArray(typedData.bankAccounts)) {
        setBankAccounts(typedData.bankAccounts);
      }
    }
  }, [data]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankChange = (index: number, field: keyof BankAccount, value: string) => {
    const updated = [...bankAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setBankAccounts(updated);
  };

  const addBank = () => {
    setBankAccounts([...bankAccounts, { bank: "", accountType: "", notes: "" }]);
  };

  const removeBank = (index: number) => {
    if (bankAccounts.length > 1) {
      setBankAccounts(bankAccounts.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    const hasInfo = formData.mainBank.trim() !== "" || bankAccounts.some((b) => b.bank.trim() !== "");
    onSave({ ...formData, bankAccounts }, hasInfo);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium">Comptes bancaires</h4>
        {bankAccounts.map((account, index) => (
          <div key={index} className="p-4 bg-muted/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Compte {index + 1}</span>
              {bankAccounts.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBank(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Banque</Label>
                <Input
                  value={account.bank}
                  onChange={(e) => handleBankChange(index, "bank", e.target.value)}
                  placeholder="Crédit Agricole"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Type de compte</Label>
                <Input
                  value={account.accountType}
                  onChange={(e) => handleBankChange(index, "accountType", e.target.value)}
                  placeholder="Compte courant"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Input
                value={account.notes}
                onChange={(e) => handleBankChange(index, "notes", e.target.value)}
                placeholder="Agence, conseiller..."
              />
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addBank} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un compte
        </Button>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Assurances</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insuranceCompany">Compagnie</Label>
            <Input
              id="insuranceCompany"
              value={formData.insuranceCompany}
              onChange={(e) => handleChange("insuranceCompany", e.target.value)}
              placeholder="AXA, MAIF..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="insuranceContract">N° contrat</Label>
            <Input
              id="insuranceContract"
              value={formData.insuranceContract}
              onChange={(e) => handleChange("insuranceContract", e.target.value)}
              placeholder="123456789"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Informations administratives</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="taxNumber">N° fiscal</Label>
            <Input
              id="taxNumber"
              value={formData.taxNumber}
              onChange={(e) => handleChange("taxNumber", e.target.value)}
              placeholder="12 34 567 890 123"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="socialSecurityNumber">N° sécurité sociale</Label>
            <Input
              id="socialSecurityNumber"
              value={formData.socialSecurityNumber}
              onChange={(e) => handleChange("socialSecurityNumber", e.target.value)}
              placeholder="1 23 45 67 890 123 45"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employer">Employeur actuel</Label>
            <Input
              id="employer"
              value={formData.employer}
              onChange={(e) => handleChange("employer", e.target.value)}
              placeholder="Nom de l'entreprise"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pension">Caisse de retraite</Label>
            <Input
              id="pension"
              value={formData.pension}
              onChange={(e) => handleChange("pension", e.target.value)}
              placeholder="AGIRC-ARRCO..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otherInfo">Autres informations</Label>
        <Textarea
          id="otherInfo"
          value={formData.otherInfo}
          onChange={(e) => handleChange("otherInfo", e.target.value)}
          placeholder="Crédits en cours, investissements..."
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
