import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, PenLine, Heart, ChevronRight, Lock, User, Cross, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const steps = [
  {
    id: 1,
    content: (onNext: () => void, onSkip: () => void) => (
      <div className="flex flex-col items-center text-center gap-6 px-6 py-10">
        <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center">
          <Shield className="w-10 h-10 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Bienvenue sur Passeport de Vie</h2>
          <p className="text-muted-foreground leading-relaxed">
            En 15 minutes, protégez votre famille en centralisant vos informations essentielles.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button variant="hero" size="lg" onClick={onNext} className="w-full">
            Commencer
          </Button>
          <button onClick={onSkip} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Passer
          </button>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    content: (onNext: () => void, onSkip: () => void) => (
      <div className="flex flex-col items-center text-center gap-6 px-6 py-10">
        <h2 className="text-xl font-bold text-foreground">Comment ça marche</h2>
        <div className="space-y-5 w-full max-w-sm">
          {[
            { icon: PenLine, text: "Remplissez votre passeport", color: "bg-primary/10 text-primary" },
            { icon: Heart, text: "Désignez une personne de confiance", color: "bg-destructive/10 text-destructive" },
            { icon: Shield, text: "En cas d'urgence, ils ont accès", color: "bg-sage/20 text-sage" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 text-left">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-foreground font-medium">{i + 1}. {item.text}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs pt-2">
          <Button variant="hero" size="lg" onClick={onNext} className="w-full gap-2">
            Suivant <ChevronRight className="w-4 h-4" />
          </Button>
          <button onClick={onSkip} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Passer
          </button>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    content: (onNext: () => void, onSkip: () => void) => (
      <div className="flex flex-col items-center text-center gap-6 px-6 py-10">
        <div className="w-16 h-16 rounded-2xl bg-sage/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-sage" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-3">Vos données, votre contrôle</h2>
          <div className="space-y-3 text-left max-w-sm">
            {[
              "Chiffrement de bout en bout",
              "Accessible uniquement par vous",
              "Supprimez tout à tout moment",
              "Hébergé en Europe",
            ].map((point, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-3 h-3 text-sage" />
                </div>
                <span className="text-sm text-foreground">{point}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs pt-2">
          <Button variant="hero" size="lg" onClick={onNext} className="w-full gap-2">
            Suivant <ChevronRight className="w-4 h-4" />
          </Button>
          <button onClick={onSkip} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Passer
          </button>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    content: (onNext: () => void) => (
      <div className="flex flex-col items-center text-center gap-6 px-6 py-10">
        <h2 className="text-xl font-bold text-foreground">Commençons par l'essentiel</h2>
        <div className="space-y-4 w-full max-w-sm">
          {[
            { icon: User, label: "Mon identité", time: "5 min" },
            { icon: Cross, label: "Fiche Santé", time: "5 min" },
            { icon: Phone, label: "Contacts essentiels", time: "3 min" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 border border-border">
              <div className="w-10 h-10 rounded-lg gradient-sage flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-foreground font-medium flex-1 text-left">{i + 1}. {item.label}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{item.time}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Vous pouvez compléter les autres sections à votre rythme
        </p>
        <Button variant="hero" size="lg" onClick={onNext} className="w-full max-w-xs">
          Accéder à mon passeport
        </Button>
      </div>
    ),
  },
];

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      {/* Progress indicator */}
      <div className="flex gap-2 mb-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= currentStep ? "w-8 bg-primary" : "w-4 bg-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground mb-4">{currentStep + 1}/{steps.length}</span>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {steps[currentStep].content(handleNext, onComplete)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingFlow;
