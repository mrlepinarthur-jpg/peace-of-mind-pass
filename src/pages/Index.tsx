import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Settings from "./Settings";
import { useAuth } from "@/hooks/useAuth";

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
        if (!user) {
          navigate("/auth");
          return null;
        }
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
