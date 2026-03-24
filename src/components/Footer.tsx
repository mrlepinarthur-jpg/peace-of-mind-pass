import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 py-6 mb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <Link to="/mentions-legales" className="hover:text-foreground transition-colors">
            Mentions légales
          </Link>
          <span className="text-border">•</span>
          <Link to="/politique-confidentialite" className="hover:text-foreground transition-colors">
            Politique de confidentialité
          </Link>
          <span className="text-border">•</span>
          <Link to="/cgu" className="hover:text-foreground transition-colors">
            CGU
          </Link>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3">
          © {new Date().getFullYear()} Passeport de Vie. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
