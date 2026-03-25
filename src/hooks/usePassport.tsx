import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface PassportData {
  id: string;
  identity_data: unknown;
  identity_completed: boolean;
  trusted_person_data: unknown;
  trusted_person_completed: boolean;
  contacts_data: unknown;
  contacts_completed: boolean;
  documents_data: unknown;
  documents_completed: boolean;
  health_data: unknown;
  health_completed: boolean;
  administrative_data: unknown;
  administrative_completed: boolean;
  digital_data: unknown;
  digital_completed: boolean;
  checklists_data: unknown;
  checklists_completed: boolean;
  personal_message_data: unknown;
  personal_message_completed: boolean;
  insurance_data: unknown;
  insurance_completed: boolean;
  legal_docs_data: unknown;
  legal_docs_completed: boolean;
  digital_access_data: unknown;
  digital_access_completed: boolean;
  personal_wishes_data: unknown;
  personal_wishes_completed: boolean;
  pets_data: unknown;
  pets_completed: boolean;
  updated_at: string;
}

export const usePassport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [passport, setPassport] = useState<PassportData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPassport = async () => {
    if (!user) {
      setPassport(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("passports")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setPassport(data);
    } catch (error) {
      console.error("Error fetching passport:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassport();
  }, [user]);

  const updateSection = async (
    sectionKey: string,
    data: Record<string, unknown>,
    completed: boolean
  ) => {
    if (!user || !passport) return;

    try {
      const { error } = await supabase
        .from("passports")
        .update({
          [`${sectionKey}_data`]: data,
          [`${sectionKey}_completed`]: completed,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Sauvegardé",
        description: "Vos modifications ont été enregistrées.",
      });

      await fetchPassport();
    } catch (error) {
      console.error("Error updating section:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    }
  };

  const getProgress = () => {
    if (!passport) return { completed: 0, total: 14 };

    const sections = [
      passport.identity_completed,
      passport.trusted_person_completed,
      passport.contacts_completed,
      passport.documents_completed,
      passport.health_completed,
      passport.administrative_completed,
      passport.digital_completed,
      passport.checklists_completed,
      passport.personal_message_completed,
      passport.insurance_completed,
      passport.legal_docs_completed,
      passport.digital_access_completed,
      passport.personal_wishes_completed,
      passport.pets_completed,
    ];

    return {
      completed: sections.filter(Boolean).length,
      total: 14,
    };
  };

  return {
    passport,
    loading,
    updateSection,
    getProgress,
    refetch: fetchPassport,
  };
};
