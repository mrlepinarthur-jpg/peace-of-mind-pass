import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, User, X, FileText, Users, AlertTriangle, Scale, ShieldCheck, ScrollText, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  user?: SupabaseUser | null;
  onTabChange?: (tab: string) => void;
}

const Header = ({ showBack, onBack, user, onTabChange }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    navigate("/");
  };

  const handleMenuNav = (action: string) => {
    setMenuOpen(false);
    if (action.startsWith("/")) {
      navigate(action);
    } else if (onTabChange) {
      onTabChange(action);
    }
  };

  const menuItems = user
    ? [
        { label: "Mon Passeport", action: "passport", icon: Shield },
        { label: "Partagés avec moi", action: "shared", icon: Users },
        { label: "Accès d'urgence", action: "/emergency-access", icon: AlertTriangle },
        { divider: true },
        { label: "Mentions légales", action: "/mentions-legales", icon: Scale },
        { label: "Politique de confidentialité", action: "/politique-confidentialite", icon: ShieldCheck },
        { label: "CGU", action: "/cgu", icon: ScrollText },
        { divider: true },
        { label: "Se déconnecter", action: "signout", icon: LogOut, destructive: true },
      ]
    : [
        { label: "Accès d'urgence", action: "/emergency-access", icon: AlertTriangle },
        { divider: true },
        { label: "Mentions légales", action: "/mentions-legales", icon: Scale },
        { label: "Politique de confidentialité", action: "/politique-confidentialite", icon: ShieldCheck },
        { label: "CGU", action: "/cgu", icon: ScrollText },
      ];

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-lg leading-tight">
                Passeport de Vie
              </h1>
              <p className="text-xs text-muted-foreground">Votre sérénité administrative</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-sage" />
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                Connexion
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-16 right-0 bottom-0 w-72 bg-background border-l border-border z-50 overflow-y-auto shadow-xl"
            >
              <div className="py-2">
                {menuItems.map((item, i) => {
                  if ("divider" in item && item.divider) {
                    return <div key={`div-${i}`} className="my-2 border-t border-border" />;
                  }
                  const Icon = item.icon!;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.action === "signout") {
                          handleSignOut();
                        } else {
                          handleMenuNav(item.action!);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-muted/60 ${
                        item.destructive ? "text-destructive" : "text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
