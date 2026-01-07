import { motion } from "framer-motion";
import { Shield, Menu, User } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  user?: SupabaseUser | null;
}

const Header = ({ showBack, onBack, user }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
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
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
