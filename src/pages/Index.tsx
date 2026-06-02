import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Settings from "./Settings";
import SharedPassports from "./SharedPassports";
import MyProfiles from "./MyProfiles";
import ProfilePassportView from "@/components/profiles/ProfilePassportWrapper";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [openedProfileId, setOpenedProfileId] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) setActiveTab("passport");
    else navigate("/auth");
  };

  const handleTabChange = (tab: string) => {
    setOpenedProfileId(null);
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (openedProfileId) {
      return <ProfilePassportView profileId={openedProfileId} onBack={() => setOpenedProfileId(null)} />;
    }
    switch (activeTab) {
      case "home":
        return <Home onGetStarted={handleGetStarted} />;
      case "passport":
        if (!user) { navigate("/auth"); return null; }
        return <Dashboard />;
      case "shared":
        if (!user) { navigate("/auth"); return null; }
        return <SharedPassports />;
      case "my_profiles":
        if (!user) { navigate("/auth"); return null; }
        return (
          <MyProfiles
            onOpenProfile={(id) => setOpenedProfileId(id)}
            onGoHome={() => handleTabChange("home")}
          />
        );
      case "profile":
        if (!user) { navigate("/auth"); return null; }
        return <Profile />;
      case "settings":
        return <Settings />;
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
      <Header user={user} onTabChange={handleTabChange} />
      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={openedProfileId ?? activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
