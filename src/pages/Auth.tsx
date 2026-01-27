import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "signup" | "forgot-password";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message === "Invalid login credentials") {
            toast({
              title: "Erreur de connexion",
              description: "Email ou mot de passe incorrect.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erreur",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        toast({
          title: "Bienvenue !",
          description: "Connexion réussie.",
        });
        navigate("/");
      } else if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/`;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Compte existant",
              description: "Un compte existe déjà avec cet email. Connectez-vous.",
              variant: "destructive",
            });
            setMode("login");
          } else {
            toast({
              title: "Erreur",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        toast({
          title: "Compte créé !",
          description: "Bienvenue sur Passeport de Vie.",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setResetEmailSent(true);
      toast({
        title: "Email envoyé !",
        description: "Vérifiez votre boîte de réception.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset email sent confirmation screen
  if (resetEmailSent) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setResetEmailSent(false);
              setMode("login");
            }}
            className="text-muted-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-foreground mb-2 text-center"
          >
            Email envoyé !
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-center mb-8 max-w-xs"
          >
            Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>. 
            Vérifiez votre boîte de réception et vos spams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              onClick={() => {
                setResetEmailSent(false);
                setMode("login");
              }}
            >
              Retour à la connexion
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Forgot password form
  if (mode === "forgot-password") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMode("login")}
            className="text-muted-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center mb-6 shadow-elevated"
          >
            <Shield className="w-8 h-8 text-primary-foreground" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-foreground mb-2 text-center"
          >
            Mot de passe oublié ?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-center mb-8 max-w-xs"
          >
            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleForgotPassword}
            className="w-full max-w-sm space-y-4"
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Envoi en cours..." : "Envoyer le lien"}
            </Button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            Vous vous souvenez ?{" "}
            <button
              onClick={() => setMode("login")}
              className="text-primary font-semibold hover:underline"
            >
              Se connecter
            </button>
          </motion.p>
        </div>
      </div>
    );
  }

  // Login / Signup form
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-muted-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center mb-6 shadow-elevated"
        >
          <Shield className="w-8 h-8 text-primary-foreground" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-foreground mb-2 text-center"
        >
          {mode === "login" ? "Bon retour !" : "Créer un compte"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-center mb-8 max-w-xs"
        >
          {mode === "login"
            ? "Connectez-vous pour retrouver votre passeport"
            : "Sécurisez vos informations et synchronisez vos appareils"}
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4"
        >
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Votre nom complet"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10 h-12 rounded-xl"
                required={mode === "signup"}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 rounded-xl"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-12 rounded-xl"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Chargement..."
              : mode === "login"
              ? "Se connecter"
              : "Créer mon compte"}
          </Button>

          {mode === "login" && (
            <button
              type="button"
              onClick={() => setMode("forgot-password")}
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Mot de passe oublié ?
            </button>
          )}
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-sm text-muted-foreground"
        >
          {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-primary font-semibold hover:underline"
          >
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </button>
        </motion.p>
      </div>
    </div>
  );
};

export default Auth;
