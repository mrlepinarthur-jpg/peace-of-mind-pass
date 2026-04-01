import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PolitiqueConfidentialite = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-8">Politique de Confidentialité</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground">
          <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Données collectées</h2>
            <p className="text-muted-foreground">Dans le cadre de l'utilisation de Passeport de Vie, nous collectons :</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong className="text-foreground">Données d'identité :</strong> nom, prénom, date de naissance, adresse email</li>
              <li><strong className="text-foreground">Données du passeport :</strong> informations administratives, contacts d'urgence, documents, volontés personnelles</li>
              <li><strong className="text-foreground">Données de santé (sensibles — Art. 9 RGPD) :</strong> groupe sanguin, allergies, traitements en cours, antécédents médicaux, statut de donneur d'organes. Ces données ne sont collectées qu'après consentement explicite de l'utilisateur.</li>
              <li><strong className="text-foreground">Données de connexion :</strong> adresse IP, type de navigateur, horodatage de connexion</li>
              <li><strong className="text-foreground">Données de paiement :</strong> traitées de manière sécurisée par Stripe (nous ne stockons jamais vos données bancaires)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Sous-traitants</h2>
            <p className="text-muted-foreground">Vos données peuvent être traitées par les sous-traitants suivants :</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong className="text-foreground">Supabase Inc.</strong> — Hébergement, stockage et authentification (UE)</li>
              <li><strong className="text-foreground">Stripe Inc.</strong> — Paiements et gestion des abonnements (PCI-DSS)</li>
              <li><strong className="text-foreground">Resend Inc.</strong> — Envoi d'emails transactionnels</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Finalité du traitement</h2>
            <p className="text-muted-foreground">Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Stocker et sécuriser votre passeport de fin de vie</li>
              <li>Permettre l'accès d'urgence à votre personne de confiance</li>
              <li>Gérer votre abonnement et la facturation</li>
              <li>Vous envoyer des notifications liées au service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Durée de conservation</h2>
            <p className="text-muted-foreground">
              Vos données personnelles sont conservées pendant la durée de votre abonnement actif, 
              puis 3 ans après la résiliation de votre compte. Les données de facturation sont conservées 
              10 ans conformément aux obligations comptables et fiscales. En cas de demande de suppression, 
              vos données sont effacées dans un délai de 30 jours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Base légale</h2>
            <p className="text-muted-foreground">
              Le traitement de vos données repose sur votre consentement (article 6.1.a du RGPD) 
              et sur l'exécution du contrat de service (article 6.1.b du RGPD).<br /><br />
              <strong className="text-foreground">Données de santé :</strong> le traitement repose sur 
              votre consentement explicite conformément à l'article 9.2.a du RGPD. Ce consentement est 
              recueilli avant tout accès à la section « Fiche Santé ».
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Vos droits (RGPD)</h2>
            <p className="text-muted-foreground">Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong className="text-foreground">Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
              <li><strong className="text-foreground">Droit de rectification :</strong> corriger des données inexactes</li>
              <li><strong className="text-foreground">Droit à l'effacement :</strong> demander la suppression de vos données</li>
              <li><strong className="text-foreground">Droit à la portabilité :</strong> recevoir vos données dans un format structuré (export disponible dans les réglages)</li>
              <li><strong className="text-foreground">Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong className="text-foreground">Droit à la limitation :</strong> limiter le traitement de vos données</li>
              <li><strong className="text-foreground">Retrait du consentement :</strong> vous pouvez retirer votre consentement au traitement des données de santé à tout moment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Sécurité des données</h2>
            <p className="text-muted-foreground">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
              pour protéger vos données : chiffrement en transit (TLS), stockage sécurisé, 
              authentification renforcée, contrôle d'accès strict. Les données de santé bénéficient 
              d'une protection renforcée conformément à l'article 9 du RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contact DPO</h2>
            <p className="text-muted-foreground">
              Pour exercer vos droits ou pour toute question relative à la protection de vos données, 
              contactez-nous :<br />
              <a href="mailto:contact@passeportdevie.fr" className="text-primary underline">contact@passeportdevie.fr</a>
            </p>
            <p className="text-muted-foreground">
              Vous pouvez également introduire une réclamation auprès de la CNIL 
              (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.cnil.fr</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialite;
