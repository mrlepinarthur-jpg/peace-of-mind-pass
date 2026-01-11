import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2 } from "lucide-react";

interface DigitalAccount {
  platform: string;
  username: string;
  notes: string;
}

interface DigitalFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

export const DigitalForm = ({ data, onSave }: DigitalFormProps) => {
  const [accounts, setAccounts] = useState<DigitalAccount[]>([
    { platform: "", username: "", notes: "" },
  ]);

  const [formData, setFormData] = useState({
    emailProvider: "",
    emailAddress: "",
    phoneProvider: "",
    passwordManager: "",
    otherInfo: "",
  });

  useEffect(() => {
    if (data && typeof data === "object") {
      const typedData = data as typeof formData & { accounts?: DigitalAccount[] };
      setFormData((prev) => ({ ...prev, ...typedData }));
      if (Array.isArray(typedData.accounts)) {
        setAccounts(typedData.accounts);
      }
    }
  }, [data]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAccountChange = (index: number, field: keyof DigitalAccount, value: string) => {
    const updated = [...accounts];
    updated[index] = { ...updated[index], [field]: value };
    setAccounts(updated);
  };

  const addAccount = () => {
    setAccounts([...accounts, { platform: "", username: "", notes: "" }]);
  };

  const removeAccount = (index: number) => {
    if (accounts.length > 1) {
      setAccounts(accounts.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    const hasInfo = formData.emailAddress.trim() !== "" || accounts.some((a) => a.platform.trim() !== "");
    onSave({ ...formData, accounts }, hasInfo);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-accent/10 rounded-xl">
        <p className="text-sm text-muted-foreground">
          ⚠️ Ne stockez jamais vos mots de passe ici. Indiquez seulement les plateformes et identifiants.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Email principal</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emailProvider">Fournisseur</Label>
            <Input
              id="emailProvider"
              value={formData.emailProvider}
              onChange={(e) => handleChange("emailProvider", e.target.value)}
              placeholder="Gmail, Outlook..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailAddress">Adresse</Label>
            <Input
              id="emailAddress"
              type="email"
              value={formData.emailAddress}
              onChange={(e) => handleChange("emailAddress", e.target.value)}
              placeholder="exemple@gmail.com"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneProvider">Opérateur téléphone</Label>
          <Input
            id="phoneProvider"
            value={formData.phoneProvider}
            onChange={(e) => handleChange("phoneProvider", e.target.value)}
            placeholder="Orange, Free..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passwordManager">Gestionnaire de mots de passe</Label>
          <Input
            id="passwordManager"
            value={formData.passwordManager}
            onChange={(e) => handleChange("passwordManager", e.target.value)}
            placeholder="1Password, Bitwarden..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Comptes en ligne importants</h4>
        {accounts.map((account, index) => (
          <div key={index} className="p-4 bg-muted/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Compte {index + 1}</span>
              {accounts.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAccount(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Plateforme</Label>
                <Input
                  value={account.platform}
                  onChange={(e) => handleAccountChange(index, "platform", e.target.value)}
                  placeholder="Facebook, Amazon..."
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Identifiant</Label>
                <Input
                  value={account.username}
                  onChange={(e) => handleAccountChange(index, "username", e.target.value)}
                  placeholder="Email ou pseudo"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Input
                value={account.notes}
                onChange={(e) => handleAccountChange(index, "notes", e.target.value)}
                placeholder="Informations utiles..."
              />
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addAccount} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un compte
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otherInfo">Autres informations numériques</Label>
        <Textarea
          id="otherInfo"
          value={formData.otherInfo}
          onChange={(e) => handleChange("otherInfo", e.target.value)}
          placeholder="Abonnements, services en ligne..."
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
