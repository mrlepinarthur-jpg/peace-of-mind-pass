import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CGU = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-8">Conditions Générales d'Utilisation</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground">
          <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Objet</h2>
            <p className="text-muted-foreground">
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de 
              l'application Passeport de Vie, un service de centralisation d'informations 
              personnelles destinées à être transmises à des proches en cas d'urgence.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Éditeur</h2>
            <p className="text-muted-foreground">
              L'application est éditée par [Nom Prénom du responsable légal].<br />
              Email : <a href="mailto:contact@passeportdevie.fr" className="text-primary underline">contact@passeportdevie.fr</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Acceptation des CGU</h2>
            <p className="text-muted-foreground">
              L'utilisation de l'application implique l'acceptation pleine et entière des 
              présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas 
              utiliser l'application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Inscription et compte</h2>
            <p className="text-muted-foreground">
              Pour utiliser Passeport de Vie, vous devez créer un compte en fournissant 
              une adresse email valide et un mot de passe. Vous êtes responsable de la 
              confidentialité de vos identifiants et de toutes les activités effectuées 
              sous votre compte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Services proposés</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong className="text-foreground">Plan Essentiel (gratuit) :</strong> accès aux sections Identité, Contacts, Documents et Fiche Santé</li>
              <li><strong className="text-foreground">Plan Solo :</strong> toutes les sections du passeport débloquées, export PDF complet</li>
              <li><strong className="text-foreground">Plan Sérénité :</strong> accès complet, accès d'urgence, partage avec personne de confiance</li>
              <li><strong className="text-foreground">Plan Famille :</strong> fonctionnalités Sérénité pour jusqu'à 5 profils interconnectés</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Sous-traitants</h2>
            <p className="text-muted-foreground">
              L'application fait appel aux sous-traitants suivants pour son fonctionnement :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong className="text-foreground">Supabase Inc.</strong> — Hébergement, base de données et authentification</li>
              <li><strong className="text-foreground">Stripe Inc.</strong> — Traitement des paiements et gestion des abonnements</li>
              <li><strong className="text-foreground">Resend Inc.</strong> — Envoi d'emails transactionnels</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Données de santé</h2>
            <p className="text-muted-foreground">
              L'application collecte des données de santé au sens de l'article 9 du RGPD 
              (groupe sanguin, allergies, traitements, etc.). Ces données ne sont traitées 
              qu'après recueil du consentement explicite de l'utilisateur. L'utilisateur peut 
              retirer son consentement à tout moment via les réglages de l'application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Abonnements et paiement</h2>
            <p className="text-muted-foreground">
              Les abonnements payants sont facturés mensuellement via Stripe. Un essai gratuit 
              de 7 jours est proposé pour les plans Solo et Sérénité. Vous pouvez annuler votre 
              abonnement à tout moment via les réglages de l'application. L'annulation prend 
              effet à la fin de la période de facturation en cours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Accès d'urgence</h2>
            <p className="text-muted-foreground">
              La fonctionnalité d'accès d'urgence permet à une personne de confiance désignée 
              d'accéder à votre passeport selon les conditions de sécurité que vous avez 
              configurées. L'éditeur ne saurait être tenu responsable de l'utilisation faite 
              des informations transmises via cette fonctionnalité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Durée de conservation des données</h2>
            <p className="text-muted-foreground">
              Les données personnelles sont conservées pendant la durée de l'abonnement actif, 
              puis 3 ans après la résiliation du compte. Les données de facturation sont conservées 
              10 ans conformément aux obligations légales. Pour plus de détails, consultez notre 
              Politique de Confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Responsabilité de l'utilisateur</h2>
            <p className="text-muted-foreground">
              L'utilisateur s'engage à fournir des informations exactes et à maintenir 
              ses données à jour. Il est seul responsable du contenu qu'il saisit dans 
              son passeport.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Limitation de responsabilité</h2>
            <p className="text-muted-foreground">
              Passeport de Vie est un outil d'organisation personnelle et ne se substitue 
              en aucun cas à un testament, un mandat de protection future, ou tout autre 
              document juridique officiel. L'éditeur ne fournit aucun conseil juridique.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">13. Modification des CGU</h2>
            <p className="text-muted-foreground">
              L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. 
              Les utilisateurs seront informés de toute modification significative par 
              notification dans l'application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">14. Droit applicable</h2>
            <p className="text-muted-foreground">
              Les présentes CGU sont régies par le droit français. En cas de litige, 
              les tribunaux français seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">15. Contact</h2>
            <p className="text-muted-foreground">
              Pour toute question relative aux présentes CGU ou à vos données personnelles :<br />
              <a href="mailto:contact@passeportdevie.fr" className="text-primary underline">contact@passeportdevie.fr</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CGU;
