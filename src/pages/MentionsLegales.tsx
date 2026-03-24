import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MentionsLegales = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-8">Mentions Légales</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Éditeur de l'application</h2>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Passeport de Vie</strong><br />
              Application mobile et web de gestion de documents de fin de vie<br />
              Email de contact : <a href="mailto:contact@passeportdevie.fr" className="text-primary underline">contact@passeportdevie.fr</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Hébergement</h2>
            <p className="text-muted-foreground">
              L'application est hébergée par :<br />
              <strong className="text-foreground">Lovable / Supabase</strong><br />
              Les données sont stockées sur des serveurs sécurisés conformes au RGPD,
              situés dans l'Union Européenne.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Propriété intellectuelle</h2>
            <p className="text-muted-foreground">
              L'ensemble du contenu de l'application Passeport de Vie (textes, images, logos, 
              éléments graphiques) est protégé par le droit de la propriété intellectuelle. 
              Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Responsabilité</h2>
            <p className="text-muted-foreground">
              L'éditeur s'efforce de fournir des informations aussi précises que possible. 
              Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes 
              et des carences dans la mise à jour, qu'elles soient de son fait ou du fait 
              des tiers partenaires qui lui fournissent ces informations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Contact</h2>
            <p className="text-muted-foreground">
              Pour toute question relative aux mentions légales, vous pouvez nous contacter à :<br />
              <a href="mailto:contact@passeportdevie.fr" className="text-primary underline">contact@passeportdevie.fr</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegales;
