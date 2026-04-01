import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface PetsFormProps {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>, completed: boolean) => void;
}

interface Pet {
  name: string;
  species: string;
  breed: string;
  chipNumber: string;
  vetName: string;
  vetPhone: string;
  caretaker: string;
  medicalInfo: string;
}

export const PetsForm = ({ data, onSave }: PetsFormProps) => {
  const [pets, setPets] = useState<Pet[]>(
    (data.pets as Pet[]) || [{ name: "", species: "", breed: "", chipNumber: "", vetName: "", vetPhone: "", caretaker: "", medicalInfo: "" }]
  );

  const addPet = () => setPets([...pets, { name: "", species: "", breed: "", chipNumber: "", vetName: "", vetPhone: "", caretaker: "", medicalInfo: "" }]);
  const removePet = (i: number) => setPets(pets.filter((_, idx) => idx !== i));
  const updatePet = (i: number, field: keyof Pet, value: string) => {
    const updated = [...pets];
    updated[i] = { ...updated[i], [field]: value };
    setPets(updated);
  };

  const handleSubmit = () => {
    const hasData = pets.some(p => p.name.trim());
    onSave({ pets }, hasData);
  };

  return (
    <div className="space-y-6 py-4">
      {pets.map((pet, index) => (
        <div key={index} className="space-y-3 p-4 bg-muted/50 rounded-xl relative">
          {pets.length > 1 && (
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-destructive" onClick={() => removePet(index)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <h3 className="font-semibold text-foreground">Animal {index + 1}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Nom</Label>
              <Input value={pet.name} onChange={(e) => updatePet(index, "name", e.target.value)} placeholder="Nom de l'animal" />
            </div>
            <div>
              <Label>Espèce</Label>
              <Input value={pet.species} onChange={(e) => updatePet(index, "species", e.target.value)} placeholder="Chien, chat..." />
            </div>
          </div>
          <div>
            <Label>Race</Label>
            <Input value={pet.breed} onChange={(e) => updatePet(index, "breed", e.target.value)} placeholder="Race de l'animal" />
          </div>
          <div>
            <Label>N° de puce (identification électronique)</Label>
            <Input value={pet.chipNumber} onChange={(e) => updatePet(index, "chipNumber", e.target.value)} placeholder="Ex : 250XXXXXXXXXXXX" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Vétérinaire</Label>
              <Input value={pet.vetName} onChange={(e) => updatePet(index, "vetName", e.target.value)} placeholder="Nom du vétérinaire" />
            </div>
            <div>
              <Label>Tél. vétérinaire</Label>
              <Input value={pet.vetPhone} onChange={(e) => updatePet(index, "vetPhone", e.target.value)} placeholder="Téléphone" />
            </div>
          </div>
          <div>
            <Label>Personne désignée pour s'en occuper</Label>
            <Input value={pet.caretaker} onChange={(e) => updatePet(index, "caretaker", e.target.value)} placeholder="Nom et coordonnées" />
          </div>
          <div>
            <Label>Informations médicales</Label>
            <Textarea value={pet.medicalInfo} onChange={(e) => updatePet(index, "medicalInfo", e.target.value)} placeholder="Allergies, traitements en cours..." rows={3} />
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addPet} className="gap-2">
        <Plus className="w-4 h-4" /> Ajouter un animal
      </Button>

      <Button onClick={handleSubmit} className="w-full" variant="hero">Sauvegarder</Button>
    </div>
  );
};
