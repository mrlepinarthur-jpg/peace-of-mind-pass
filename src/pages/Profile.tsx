import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Calendar, 
  LogOut, 
  Save, 
  KeyRound,
  Crown,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { planName, isPremium } = useSubscription();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    const fetchProfile = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (data) {
        setFullName(data.full_name || "");
      }
      setIsLoading(false);
    };
    
    fetchProfile();
  }, [user, navigate]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("user_id", user.id);
    
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées.",
      });
    }
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email envoyé",
        description: "Un lien de réinitialisation a été envoyé à votre adresse email.",
      });
    }
  };

  const getInitials = () => {
    if (fullName) {
      return fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getPlanBadgeVariant = () => {
    if (isPremium) return "default";
    return "secondary";
  };

  if (!user) return null;

  return (
    <div className="space-y-6 pb-24">
      {/* Header avec Avatar */}
      <div className="flex flex-col items-center text-center">
        <Avatar className="w-24 h-24 mb-4 bg-primary/10 border-2 border-primary/20">
          <AvatarFallback className="text-2xl font-semibold text-primary bg-primary/10">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold text-foreground">Mon Profil</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Carte Abonnement */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {isPremium ? <Crown className="w-5 h-5 text-primary" /> : <Sparkles className="w-5 h-5 text-muted-foreground" />}
              Abonnement
            </CardTitle>
            <Badge variant={getPlanBadgeVariant()} className="font-medium">
              {planName}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {isPremium 
              ? "Vous bénéficiez de toutes les fonctionnalités premium."
              : "Passez à un abonnement premium pour débloquer toutes les fonctionnalités."
            }
          </p>
        </CardContent>
      </Card>

      {/* Informations personnelles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            Informations personnelles
          </CardTitle>
          <CardDescription>
            Modifiez vos informations de profil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Entrez votre nom complet"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              value={user.email || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              L'adresse email ne peut pas être modifiée
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Membre depuis
            </Label>
            <Input
              value={user.created_at ? format(new Date(user.created_at), "d MMMM yyyy", { locale: fr }) : "-"}
              disabled
              className="bg-muted"
            />
          </div>

          <Button 
            onClick={handleSaveProfile} 
            disabled={isSaving}
            className="w-full gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <KeyRound className="w-5 h-5" />
            Sécurité
          </CardTitle>
          <CardDescription>
            Gérez la sécurité de votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={handleChangePassword}
            className="w-full gap-2"
          >
            <KeyRound className="w-4 h-4" />
            Changer le mot de passe
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Déconnexion */}
      <Button 
        variant="destructive" 
        onClick={handleSignOut}
        className="w-full gap-2"
      >
        <LogOut className="w-4 h-4" />
        Se déconnecter
      </Button>
    </div>
  );
};

export default Profile;
