import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useSubscription, SubscriptionPlan } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  variant: "free" | "serenity" | "family";
  popular?: boolean;
  index: number;
}

const PricingCard = ({
  name,
  price,
  period,
  description,
  features,
  variant,
  popular,
  index,
}: PricingCardProps) => {
  const { plan, setPlan } = useSubscription();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const isCurrentPlan = plan === variant;

  const variantStyles = {
    free: {
      badge: "bg-sage-light text-sage",
      button: "outline" as const,
      border: "border-border",
    },
    serenity: {
      badge: "bg-navy text-primary-foreground",
      button: "hero" as const,
      border: "border-navy/20",
    },
    family: {
      badge: "bg-gold-light text-accent-foreground",
      button: "gold" as const,
      border: "border-gold/20",
    },
  };

  const styles = variantStyles[variant];

  const handleSelectPlan = async () => {
    if (variant === "free") {
      setPlan("free");
      toast({
        title: "Formule Essentiel activée",
        description: "Vous utilisez maintenant la formule gratuite.",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour souscrire à un abonnement.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          priceId: variant,
          userEmail: user.email,
          returnUrl: window.location.origin,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast({
        title: "Erreur",
        description: "Impossible de lancer le paiement. Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
      className={`relative bg-card rounded-2xl p-6 shadow-card border-2 ${styles.border} ${
        popular ? "ring-2 ring-navy" : ""
      } ${isCurrentPlan ? "ring-2 ring-sage" : ""}`}
    >
      {popular && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-navy text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Populaire
          </span>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-sage text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Formule actuelle
          </span>
        </div>
      )}

      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles.badge}`}>
          {name}
        </span>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-foreground">{price}</span>
        {period && <span className="text-muted-foreground text-sm">/{period}</span>}
      </div>

      <p className="text-muted-foreground text-sm mb-6">{description}</p>

      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={isCurrentPlan ? "sage" : styles.button}
        className="w-full"
        onClick={handleSelectPlan}
        disabled={isCurrentPlan || loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Redirection...
          </>
        ) : isCurrentPlan ? (
          "Formule active"
        ) : (
          "Choisir"
        )}
      </Button>
    </motion.div>
  );
};

export default PricingCard;
