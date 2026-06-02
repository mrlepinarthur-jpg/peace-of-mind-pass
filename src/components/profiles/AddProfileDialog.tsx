import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles";
import { Loader2, Mail, PencilLine } from "lucide-react";

interface AddProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProfileDialog = ({ isOpen, onClose }: AddProfileDialogProps) => {
  const { addManagedProfile, inviteProfile } = useFamilyProfiles();
  const [mode, setMode] = useState<"managed" | "invite">("managed");

  // managed form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [relationship, setRelationship] = useState("conjoint");

  // invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRel, setInviteRel] = useState("conjoint");

  const [loading, setLoading] = useState(false);

  const reset = () => {
    setFirstName(""); setLastName(""); setRelationship("conjoint");
    setInviteEmail(""); setInviteName(""); setInviteRel("conjoint");
  };

  const handleClose = () => { reset(); onClose(); };

  const submitManaged = async () => {
    if (!firstName.trim()) return;
    setLoading(true);
    const ok = await addManagedProfile(firstName.trim(), lastName.trim(), relationship);
    setLoading(false);
    if (ok) handleClose();
  };

  const submitInvite = async () => {
    if (!inviteEmail.trim() || !inviteName.trim()) return;
    setLoading(true);
    const ok = await inviteProfile(inviteEmail.trim(), inviteName.trim(), inviteRel);
    setLoading(false);
    if (ok) handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un profil</DialogTitle>
        </DialogHeader>
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="managed" className="gap-2">
              <PencilLine className="w-4 h-4" />Je gère
            </TabsTrigger>
            <TabsTrigger value="invite" className="gap-2">
              <Mail className="w-4 h-4" />Inviter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="managed" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="fn">Prénom</Label>
              <Input id="fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ln">Nom</Label>
              <Input id="ln" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Relation</Label>
              <Select value={relationship} onValueChange={setRelationship}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="conjoint">Conjoint(e)</SelectItem>
                  <SelectItem value="enfant">Enfant</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="hero" className="w-full" onClick={submitManaged} disabled={loading || !firstName.trim()}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Créer le profil
            </Button>
          </TabsContent>

          <TabsContent value="invite" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="in">Prénom de la personne</Label>
              <Input id="in" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ie">Email</Label>
              <Input id="ie" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Relation</Label>
              <Select value={inviteRel} onValueChange={setInviteRel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="conjoint">Conjoint(e)</SelectItem>
                  <SelectItem value="enfant">Enfant</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Un email d'invitation sera envoyé. La personne pourra créer son compte et son profil apparaîtra automatiquement ici.
            </p>
            <Button variant="hero" className="w-full" onClick={submitInvite} disabled={loading || !inviteEmail.trim() || !inviteName.trim()}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Envoyer l'invitation
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
