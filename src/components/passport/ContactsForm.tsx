import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, Plus, Trash2 } from "lucide-react";

interface Contact {
  name: string;
  role: string;
  phone: string;
  email: string;
}

interface ContactsFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

export const ContactsForm = ({ data, onSave }: ContactsFormProps) => {
  const [contacts, setContacts] = useState<Contact[]>([
    { name: "", role: "", phone: "", email: "" },
  ]);

  useEffect(() => {
    if (data && typeof data === "object" && Array.isArray((data as { contacts?: Contact[] }).contacts)) {
      setContacts((data as { contacts: Contact[] }).contacts);
    }
  }, [data]);

  const handleContactChange = (index: number, field: keyof Contact, value: string) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  };

  const addContact = () => {
    setContacts([...contacts, { name: "", role: "", phone: "", email: "" }]);
  };

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    const filledContacts = contacts.filter((c) => c.name.trim() !== "");
    const isComplete = filledContacts.length > 0;
    onSave({ contacts }, isComplete);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Ajoutez vos contacts essentiels : médecin, notaire, avocat, famille...
      </p>

      {contacts.map((contact, index) => (
        <div key={index} className="p-4 bg-muted/30 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Contact {index + 1}</span>
            {contacts.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeContact(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Nom</Label>
              <Input
                value={contact.name}
                onChange={(e) => handleContactChange(index, "name", e.target.value)}
                placeholder="Dr. Martin"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Rôle</Label>
              <Input
                value={contact.role}
                onChange={(e) => handleContactChange(index, "role", e.target.value)}
                placeholder="Médecin traitant"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Téléphone</Label>
              <Input
                type="tel"
                value={contact.phone}
                onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                placeholder="01 23 45 67 89"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                value={contact.email}
                onChange={(e) => handleContactChange(index, "email", e.target.value)}
                placeholder="dr.martin@email.com"
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addContact} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Ajouter un contact
      </Button>

      <Button onClick={handleSubmit} className="w-full" variant="sage">
        <Save className="w-4 h-4 mr-2" />
        Sauvegarder
      </Button>
    </div>
  );
};
