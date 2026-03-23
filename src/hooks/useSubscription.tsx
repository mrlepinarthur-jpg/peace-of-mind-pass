import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type SubscriptionPlan = "free" | "serenity" | "family";

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  setPlan: (plan: SubscriptionPlan) => void;
  isPremium: boolean;
  isTrialing: boolean;
  trialDaysLeft: number | null;
  canSendToTrustedPerson: boolean;
  canAccessVault: boolean;
  canAccessHistory: boolean;
  maxProfiles: number;
  planName: string;
  loading: boolean;
}

const FREE_SECTIONS = ["identity", "contacts", "documents"];
const PREMIUM_SECTIONS = ["trusted_person", "administrative", "digital", "checklists", "personal_message"];

export const isFreeSection = (key: string) => FREE_SECTIONS.includes(key);
export const isPremiumSection = (key: string) => PREMIUM_SECTIONS.includes(key);

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlanState] = useState<SubscriptionPlan>("free");
  const [isTrialing, setIsTrialing] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const computeTrialState = (trialEndDate: string | null) => {
    if (!trialEndDate) {
      setIsTrialing(false);
      setTrialDaysLeft(null);
      return false;
    }
    const end = new Date(trialEndDate);
    const now = new Date();
    if (end > now) {
      const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setIsTrialing(true);
      setTrialDaysLeft(days);
      return true;
    }
    setIsTrialing(false);
    setTrialDaysLeft(null);
    return false;
  };

  useEffect(() => {
    if (!user) {
      setPlanState("free");
      setIsTrialing(false);
      setTrialDaysLeft(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("plan, status, trial_end_date")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        const trialEndDate = (data as any).trial_end_date as string | null;
        const trialActive = computeTrialState(trialEndDate);

        if (data.status === "active" && data.plan) {
          setPlanState(data.plan as SubscriptionPlan);
        } else if (trialActive) {
          // Trial active but no paid subscription — give premium access
          setPlanState((data.plan as SubscriptionPlan) || "serenity");
        } else {
          setPlanState("free");
        }
      } else {
        setPlanState("free");
      }
      setLoading(false);
    };

    fetchSubscription();

    const channel = supabase
      .channel("subscription-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${user.id}` },
        (payload: any) => {
          const newData = payload.new;
          const trialActive = computeTrialState(newData?.trial_end_date);
          if (newData?.status === "active" && newData?.plan) {
            setPlanState(newData.plan as SubscriptionPlan);
          } else if (trialActive) {
            setPlanState(newData?.plan || "serenity");
          } else if (newData?.status === "canceled") {
            setPlanState("free");
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const setPlan = (newPlan: SubscriptionPlan) => {
    setPlanState(newPlan);
  };

  const isPremium = plan === "serenity" || plan === "family";

  const planName = {
    free: "Essentiel",
    serenity: "Sérénité",
    family: "Famille",
  }[plan];

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        setPlan,
        isPremium,
        isTrialing,
        trialDaysLeft,
        canSendToTrustedPerson: isPremium,
        canAccessVault: isPremium,
        canAccessHistory: isPremium,
        maxProfiles: plan === "family" ? 5 : 1,
        planName,
        loading,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
