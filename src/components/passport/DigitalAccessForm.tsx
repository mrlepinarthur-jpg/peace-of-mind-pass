import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

interface DigitalAccessFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

interface DigitalAccount {
  type: string;
  service: string;
  email: string;
}

export const DigitalAccessForm = ({ data, onSave }: DigitalAccessFormProps) => {
  const [accounts, setAccounts] = useState<DigitalAccount[]>(
    (data.accounts as DigitalAccount[]) || [{ type: "", service: "", email: "" }]
  );

  const addAccount = () => setAccounts([...accounts, { type: "", service: "", email: "" }]);
  const removeAccount = (i: number) => setAccounts(accounts.filter((_, idx) => idx !== i));
  const updateAccount = (i: number, field: keyof DigitalAccount, value: string) => {
    const updated = [...accounts];
    updated[i] = { ...updated[i], [field]: value };
    setAccounts(updated);
  };

  const accountTypes = ["Email", "Réseau social", "Abonnement", "Banque en ligne", "Administration", "Autre"];

  const handleSubmit = () => {
    const hasData = accounts.some(a => a.service.trim());
    onSave({ accounts }, hasData);
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm">
        <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
        <p className="text-foreground">
          <strong>Sécurité :</strong> Ne renseignez jamais vos mots de passe ici. Indiquez uniquement le nom du service et l'email associé.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Comptes importants</h3>
        {accounts.map((account, index) => (
          <div key={index} className="space-y-2 p-4 bg-muted/50 rounded-xl relative">
            {accounts.length > 1 && (
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-destructive" onClick={() => removeAccount(index)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
            <div>
              <Label>Type</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={account.type} onChange={(e) => updateAccount(index, "type", e.target.value)}>
                <option value="">Sélectionner...</option>
                {accountTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <Label>Nom du service</Label>
              <Input value={account.service} onChange={(e) => updateAccount(index, "service", e.target.value)} placeholder="Gmail, Facebook, Netflix..." />
            </div>
            <div>
              <Label>Email associé</Label>
              <Input type="email" value={account.email} onChange={(e) => updateAccount(index, "email", e.target.value)} placeholder="email@exemple.com" />
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addAccount} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter un compte
        </Button>
      </div>

      <Button onClick={handleSubmit} className="w-full" variant="hero">Sauvegarder</Button>
    </div>
  );
};
