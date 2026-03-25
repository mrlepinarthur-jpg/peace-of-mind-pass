import { motion } from "framer-motion";
import {
  Shield, Heart, Clock, CheckCircle, ArrowRight, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";
import PricingCard from "@/components/PricingCard";
import Footer from "@/components/Footer";

interface HomeProps {
  onGetStarted: () => void;
}

const features = [
  { icon: Shield, title: "100% sécurisé", description: "Vos données sont chiffrées et vous restez maître de tout." },
  { icon: Heart, title: "Soulagez vos proches", description: "En cas d'urgence, ils auront tout ce dont ils ont besoin." },
  { icon: Clock, title: "15 minutes", description: "C'est le temps moyen pour compléter votre passeport." },
];

const pricingPlans = [
  {
    name: "Essentiel",
    price: "Gratuit",
    description: "L'essentiel pour commencer à organiser vos informations.",
    features: [
      "3 sections : Identité, Contacts, Documents",
      "Guide d'utilisation complet",
      "Export PDF limité",
    ],
    variant: "free" as const,
  },
  {
    name: "Sérénité",
    price: "3,99€",
    period: "mois",
    description: "La solution complète pour une tranquillité d'esprit totale.",
    features: [
      "Toutes les 14 sections du passeport",
      "Coffre-fort numérique sécurisé",
      "Accès personne de confiance",
      "Export PDF complet",
      "Accès d'urgence pour vos proches",
      "Support email prioritaire",
    ],
    variant: "serenity" as const,
    popular: true,
    trialDays: 7,
  },
  {
    name: "Famille",
    price: "7,99€",
    period: "mois",
    description: "Protégez toute votre famille avec un seul abonnement.",
    features: [
      "Jusqu'à 5 profils",
      "Synchronisation famille en temps réel",
      "Gestion des membres par email",
      "Support prioritaire 7j/7",
    ],
    variant: "family" as const,
  },
];

const Home = ({ onGetStarted }: HomeProps) => {
  return (
    <div className="pb-24">
      {/* Hero Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="w-20 h-20 gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elevated"
        >
          <Shield className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl font-bold text-foreground mb-3 leading-tight">
          Votre sérénité,<br /><span className="text-navy">organisée.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Centralisez vos informations essentielles pour soulager vos proches en cas d'imprévu.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col gap-3">
          <Button variant="hero" size="lg" onClick={onGetStarted} className="mx-auto">
            Créer mon passeport
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            Gratuit • Sans engagement • 15 minutes
          </p>
        </motion.div>
      </motion.section>

      {/* What it is */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-4">Qu'est-ce que c'est ?</h2>
        <div className="bg-card rounded-2xl p-5 shadow-soft">
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Le <strong className="text-foreground">Passeport de Vie</strong> est un dossier administratif d'urgence qui centralise toutes les informations dont vos proches auront besoin en cas :
          </p>
          <ul className="space-y-2">
            {["D'hospitalisation", "D'incapacité temporaire", "De décès"].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-sage flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Features */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-4">Pourquoi l'utiliser ?</h2>
        <div className="grid gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">Nos offres</h2>
        <p className="text-muted-foreground text-sm mb-4">Choisissez la formule adaptée à vos besoins</p>
        <div className="space-y-4">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={plan.name} {...plan} index={index} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
