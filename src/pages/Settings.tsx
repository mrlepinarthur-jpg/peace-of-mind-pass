import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Sun, Moon, Bell, BellOff, Shield, FileText, Trash2, Download,
  Info, ExternalLink, CreditCard, Crown,
} from "lucide-react";
import { FamilyMembersCard } from "@/components/settings/FamilyMembersCard";
import { ReminderPreferencesCard } from "@/components/settings/ReminderPreferencesCard";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { plan, planName, isPremium, isTrialing, trialDaysLeft } = useSubscription();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState(true);
  const [emailReminders, setEmailReminders] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

  const handleManageSubscription = async () => {
    setIsLoadingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-portal", {
        body: { return_url: window.location.origin },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le portail de gestion.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // Delete user data from passports and profiles
      await supabase.from("passports").delete().eq("user_id", user.id);
      await supabase.from("profiles").delete().eq("user_id", user.id);
      
      // Sign out the user
      await signOut();
      
      toast({
        title: "Compte supprimé",
        description: "Votre compte et vos données ont été supprimés.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    
    try {
      const { data: passport } = await supabase
        .from("passports")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      const exportData = {
        profile,
        passport,
        exportedAt: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `passeport-fin-de-vie-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: "Vos données ont été téléchargées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Réglages</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Personnalisez votre expérience
        </p>
      </div>

      {/* Mon abonnement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Mon abonnement
          </CardTitle>
          <CardDescription>
            Gérez votre plan et votre facturation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Plan actuel</Label>
              <p className="text-sm font-semibold text-foreground">{planName}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              isPremium ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}>
              {isPremium ? (isTrialing ? `Essai — ${trialDaysLeft}j restants` : "Actif") : "Gratuit"}
            </span>
          </div>
          {isPremium && !isTrialing && (
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleManageSubscription}
              disabled={isLoadingPortal}
            >
              <CreditCard className="w-4 h-4" />
              {isLoadingPortal ? "Chargement..." : "Gérer mon abonnement"}
            </Button>
          )}
          {!isPremium && (
            <Button
              variant="hero"
              className="w-full"
              onClick={() => navigate("/")}
            >
              <Crown className="w-4 h-4" />
              Passer à Sérénité
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Family members - Family plan only */}
      {plan === "family" && <FamilyMembersCard />}

      {/* Reminder Preferences */}
      <ReminderPreferencesCard />

      {/* Apparence */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Apparence
          </CardTitle>
          <CardDescription>
            Choisissez le thème de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Mode sombre</Label>
              <p className="text-sm text-muted-foreground">
                Activer le thème sombre
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {notifications ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            Notifications
          </CardTitle>
          <CardDescription>
            Gérez vos préférences de notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications push</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des rappels dans l'application
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-reminders">Rappels par email</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des rappels pour compléter votre passeport
              </p>
            </div>
            <Switch
              id="email-reminders"
              checked={emailReminders}
              onCheckedChange={setEmailReminders}
            />
          </div>
        </CardContent>
      </Card>

      {/* Confidentialité et données */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Confidentialité et données
          </CardTitle>
          <CardDescription>
            Gérez vos données personnelles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4" />
            Exporter mes données
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer mon compte
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Toutes vos données, y compris votre passeport de fin de vie, seront définitivement supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* À propos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            À propos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => window.open("#", "_blank")}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Conditions d'utilisation
            </span>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => window.open("#", "_blank")}
          >
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Politique de confidentialité
            </span>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </Button>
          
          <Separator />
          
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              Passeport Fin de Vie
            </p>
            <p className="text-xs text-muted-foreground">
              Version 1.0.0
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
