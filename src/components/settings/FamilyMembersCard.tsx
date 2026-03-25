import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, Plus, Trash2, Mail, UserCheck, Clock } from "lucide-react";

interface FamilyMember {
  id: string;
  member_email: string;
  member_name: string;
  status: string;
  visible_sections: string[];
}

const ALL_SECTIONS = [
  { key: "identity", label: "Identité" },
  { key: "trusted_person", label: "Personne de confiance" },
  { key: "contacts", label: "Contacts" },
  { key: "documents", label: "Documents" },
  { key: "health", label: "Fiche Santé" },
  { key: "administrative", label: "Situation financière" },
  { key: "digital", label: "Environnement numérique" },
  { key: "checklists", label: "Checklists" },
  { key: "personal_message", label: "Message personnel" },
  { key: "insurance", label: "Assurances" },
  { key: "legal_docs", label: "Documents juridiques" },
  { key: "digital_access", label: "Accès numériques" },
  { key: "personal_wishes", label: "Volontés personnelles" },
  { key: "pets", label: "Animaux" },
];

export const FamilyMembersCard = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const fetchMembers = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("family_members")
      .select("*")
      .eq("owner_user_id", user.id)
      .order("created_at");
    setMembers((data as FamilyMember[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, [user]);

  const handleInvite = async () => {
    if (!user || !newEmail.trim() || !newName.trim()) return;
    if (members.length >= 4) {
      toast({ title: "Limite atteinte", description: "Vous pouvez inviter jusqu'à 4 membres.", variant: "destructive" });
      return;
    }
    setAdding(true);
    try {
      const { error } = await supabase.from("family_members").insert({
        owner_user_id: user.id,
        member_email: newEmail.trim().toLowerCase(),
        member_name: newName.trim(),
        visible_sections: ALL_SECTIONS.map(s => s.key),
      });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Déjà invité", description: "Ce membre est déjà dans votre équipe.", variant: "destructive" });
        } else throw error;
      } else {
        await supabase.functions.invoke("emergency-access", {
          body: {
            action: "send_family_invite",
            memberEmail: newEmail.trim().toLowerCase(),
            memberName: newName.trim(),
            ownerName: user.user_metadata?.full_name || user.email,
          },
        });
        toast({ title: "Invitation envoyée", description: `${newName} a été invité(e) par email.` });
        setNewName("");
        setNewEmail("");
        await fetchMembers();
      }
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer l'invitation.", variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    await supabase.from("family_members").delete().eq("id", id);
    toast({ title: "Membre retiré" });
    await fetchMembers();
  };

  const toggleSection = async (memberId: string, sectionKey: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    const current = member.visible_sections || [];
    const updated = current.includes(sectionKey)
      ? current.filter(s => s !== sectionKey)
      : [...current, sectionKey];
    await supabase.from("family_members").update({ visible_sections: updated }).eq("id", memberId);
    await fetchMembers();
  };

  if (loading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          Mon équipe famille
        </CardTitle>
        <CardDescription>
          Invitez jusqu'à 4 membres pour partager votre passeport en lecture seule
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="border border-border rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-xs font-bold text-primary">
                  {member.member_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{member.member_name}</p>
                  <p className="text-xs text-muted-foreground">{member.member_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  member.status === "joined" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {member.status === "joined" ? (
                    <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" /> Actif</span>
                  ) : (
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Invité</span>
                  )}
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemove(member.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs w-full" onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}>
              {expandedMember === member.id ? "Masquer les sections" : "Gérer la visibilité"}
            </Button>
            {expandedMember === member.id && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {ALL_SECTIONS.map(section => (
                  <div key={section.key} className="flex items-center gap-2">
                    <Switch
                      id={`${member.id}-${section.key}`}
                      checked={(member.visible_sections || []).includes(section.key)}
                      onCheckedChange={() => toggleSection(member.id, section.key)}
                      className="scale-75"
                    />
                    <Label htmlFor={`${member.id}-${section.key}`} className="text-xs">{section.label}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {members.length < 4 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Inviter un membre</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Nom</Label>
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Prénom Nom" className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@exemple.com" className="h-9 text-sm" />
                </div>
              </div>
              <Button size="sm" className="w-full gap-2" onClick={handleInvite} disabled={adding || !newName.trim() || !newEmail.trim()}>
                <Mail className="w-4 h-4" />
                {adding ? "Envoi..." : "Envoyer l'invitation"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
