import { createContext, useContext, useState, ReactNode } from "react";

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
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlan] = useState<SubscriptionPlan>("free");

  const isPremium = plan === "serenity" || plan === "family";
  const canSendToTrustedPerson = isPremium;
  const canAccessVault = isPremium;
  const canAccessHistory = isPremium;
  const maxProfiles = plan === "family" ? 5 : 1;
  
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
        canSendToTrustedPerson,
        canAccessVault,
        canAccessHistory,
        maxProfiles,
        planName,
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
