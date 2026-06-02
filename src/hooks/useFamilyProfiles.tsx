import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface FamilyProfile {
  id: string;
  owner_id: string;
  linked_user_id: string | null;
  first_name: string;
  last_name: string;
  relationship: string;
  invite_email: string | null;
  invite_status: "none" | "pending" | "accepted";
  passport_data: Record<string, any>;
  is_self: boolean;
  created_at: string;
  updated_at: string;
}

export const useFamilyProfiles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) {
      setProfiles([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("family_profiles" as any)
      .select("*")
      .eq("owner_id", user.id)
      .order("is_self", { ascending: false })
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Error fetching family profiles", error);
    } else {
      setProfiles((data as any) ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addManagedProfile = async (firstName: string, lastName: string, relationship: string) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("family_profiles" as any)
      .insert({
        owner_id: user.id,
        first_name: firstName,
        last_name: lastName,
        relationship,
        invite_status: "none",
      } as any)
      .select()
      .single();
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return null;
    }
    toast({ title: "Profil ajouté", description: `${firstName} a été ajouté.` });
    await fetch();
    return data;
  };

  const inviteProfile = async (email: string, firstName: string, relationship: string) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase.functions.invoke("send-profile-invite", {
        body: { email, firstName, relationship },
      });
      if (error) throw error;
      toast({ title: "Invitation envoyée", description: `Un email a été envoyé à ${email}.` });
      await fetch();
      return data;
    } catch (e: any) {
      toast({ title: "Erreur d'invitation", description: e.message ?? "Échec d'envoi", variant: "destructive" });
      return null;
    }
  };

  const updateProfileData = async (profileId: string, passportData: Record<string, any>) => {
    const { error } = await supabase
      .from("family_profiles" as any)
      .update({ passport_data: passportData } as any)
      .eq("id", profileId);
    if (error) {
      toast({ title: "Erreur", description: "Sauvegarde impossible", variant: "destructive" });
      return false;
    }
    await fetch();
    return true;
  };

  const deleteProfile = async (profileId: string) => {
    const { error } = await supabase.from("family_profiles" as any).delete().eq("id", profileId);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Profil supprimé" });
    await fetch();
  };

  return {
    profiles,
    loading,
    refetch: fetch,
    addManagedProfile,
    inviteProfile,
    updateProfileData,
    deleteProfile,
  };
};
