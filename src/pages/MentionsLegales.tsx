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
              Éditeur : [Nom Prénom du responsable légal]<br />
              Email de contact : <a href="mailto:contact@passeportdevie.fr" className="text-primary underline">contact@passeportdevie.fr</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Hébergement et sous-traitants</h2>
            <p className="text-muted-foreground">
              L'application fait appel aux sous-traitants suivants :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong className="text-foreground">Supabase Inc.</strong> — Hébergement, base de données et authentification. Données stockées sur des serveurs conformes au RGPD, situés dans l'Union Européenne.</li>
              <li><strong className="text-foreground">Stripe Inc.</strong> — Traitement des paiements et gestion des abonnements. Certifié PCI-DSS niveau 1.</li>
              <li><strong className="text-foreground">Resend Inc.</strong> — Envoi d'emails transactionnels (notifications, codes d'accès d'urgence).</li>
            </ul>
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
            <h2 className="text-xl font-semibold mb-3">4. Données de santé — Article 9 du RGPD</h2>
            <p className="text-muted-foreground">
              L'application collecte, avec le consentement explicite de l'utilisateur (Article 9.2.a du RGPD), 
              des données de santé considérées comme sensibles : groupe sanguin, allergies, traitements en cours, 
              antécédents médicaux et statut de donneur d'organes. Ces données sont chiffrées en transit (TLS) 
              et au repos, et ne sont accessibles qu'à l'utilisateur et aux personnes de confiance qu'il a 
              expressément autorisées.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Durée de conservation des données</h2>
            <p className="text-muted-foreground">
              Les données personnelles sont conservées pendant la durée de l'abonnement actif, 
              puis 3 ans après la résiliation du compte. Les données de facturation sont conservées 
              10 ans conformément aux obligations comptables et fiscales françaises. 
              En cas de demande de suppression, les données sont effacées dans un délai de 30 jours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Responsabilité</h2>
            <p className="text-muted-foreground">
              L'éditeur s'efforce de fournir des informations aussi précises que possible. 
              Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes 
              et des carences dans la mise à jour.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
            <p className="text-muted-foreground">
              Pour toute question relative aux mentions légales ou à vos données personnelles :<br />
              <a href="mailto:contact@passeportdevie.fr" className="text-primary underline">contact@passeportdevie.fr</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegales;
