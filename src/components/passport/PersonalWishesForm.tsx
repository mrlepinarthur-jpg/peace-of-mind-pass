import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface PersonalWishesFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

export const PersonalWishesForm = ({ data, onSave }: PersonalWishesFormProps) => {
  const [funeralType, setFuneralType] = useState((data.funeralType as string) || "");
  const [ceremonyType, setCeremonyType] = useState((data.ceremonyType as string) || "");
  const [music, setMusic] = useState((data.music as string) || "");
  const [location, setLocation] = useState((data.location as string) || "");
  const [specialWishes, setSpecialWishes] = useState((data.specialWishes as string) || "");
  const [priorityContacts, setPriorityContacts] = useState<string[]>(
    (data.priorityContacts as string[]) || [""]
  );

  const addContact = () => setPriorityContacts([...priorityContacts, ""]);
  const removeContact = (i: number) => setPriorityContacts(priorityContacts.filter((_, idx) => idx !== i));
  const updateContact = (i: number, value: string) => {
    const updated = [...priorityContacts];
    updated[i] = value;
    setPriorityContacts(updated);
  };

  const handleSubmit = () => {
    const formData = { funeralType, ceremonyType, music, location, specialWishes, priorityContacts };
    const hasData = funeralType !== "" || ceremonyType !== "" || music.trim() !== "";
    onSave(formData, hasData);
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Instructions obsèques</h3>
        <div>
          <Label>Type d'obsèques souhaité</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={funeralType} onChange={(e) => setFuneralType(e.target.value)}>
            <option value="">Sélectionner...</option>
            <option value="inhumation">Inhumation</option>
            <option value="cremation">Crémation</option>
            <option value="no_preference">Sans préférence</option>
          </select>
        </div>
        <div>
          <Label>Type de cérémonie</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={ceremonyType} onChange={(e) => setCeremonyType(e.target.value)}>
            <option value="">Sélectionner...</option>
            <option value="religious">Religieuse</option>
            <option value="civil">Civile</option>
            <option value="none">Aucune cérémonie</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Musique souhaitée</Label>
          <Textarea value={music} onChange={(e) => setMusic(e.target.value)} placeholder="Morceaux ou style musical souhaité..." rows={3} />
        </div>
        <div>
          <Label>Lieu souhaité</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Cimetière, lieu de dispersion..." />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Personnes à prévenir en priorité</h3>
        {priorityContacts.map((contact, index) => (
          <div key={index} className="flex gap-2">
            <Input value={contact} onChange={(e) => updateContact(index, e.target.value)} placeholder="Nom et coordonnées" className="flex-1" />
            {priorityContacts.length > 1 && (
              <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive flex-shrink-0" onClick={() => removeContact(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addContact} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter une personne
        </Button>
      </div>

      <div>
        <Label>Choix particuliers</Label>
        <Textarea value={specialWishes} onChange={(e) => setSpecialWishes(e.target.value)} placeholder="Autres volontés ou souhaits..." rows={4} />
      </div>

      <Button onClick={handleSubmit} className="w-full" variant="hero">Sauvegarder</Button>
    </div>
  );
};
