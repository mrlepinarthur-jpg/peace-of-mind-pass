import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Home from "./Home";
import Dashboard from "./Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      setActiveTab("passport");
    } else {
      navigate("/auth");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setActiveTab("home");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home onGetStarted={handleGetStarted} />;
      case "passport":
        if (!user) {
          navigate("/auth");
          return null;
        }
        return <Dashboard />;
      case "profile":
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            {user ? (
              <>
                <h2 className="text-xl font-bold text-foreground mb-2">Mon Profil</h2>
                <p className="text-muted-foreground text-sm mb-4">{user.email}</p>
                <Button variant="outline" onClick={handleSignOut} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-foreground mb-2">Mon Profil</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Connectez-vous pour accéder à votre profil
                </p>
                <Button variant="hero" onClick={() => navigate("/auth")}>
                  Se connecter
                </Button>
              </>
            )}
          </div>
        );
      case "settings":
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Settings className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Réglages</h2>
            <p className="text-muted-foreground text-sm">
              Personnalisez votre expérience
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
