import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type SubscriptionPlan = "free" | "serenity" | "family";

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  setPlan: (plan: SubscriptionPlan) => void;
  isPremium: boolean;
  canSendToTrustedPerson: boolean;
  canAccessVault: boolean;
  canAccessHistory: boolean;
  maxProfiles: number;
  planName: string;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlanState] = useState<SubscriptionPlan>("free");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setPlanState("free");
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data && data.status === "active" && data.plan) {
        setPlanState(data.plan as SubscriptionPlan);
      } else {
        setPlanState("free");
      }
      setLoading(false);
    };

    fetchSubscription();

    // Listen for realtime changes
    const channel = supabase
      .channel("subscription-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${user.id}` },
        (payload: any) => {
          const newData = payload.new;
          if (newData?.status === "active" && newData?.plan) {
            setPlanState(newData.plan as SubscriptionPlan);
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
