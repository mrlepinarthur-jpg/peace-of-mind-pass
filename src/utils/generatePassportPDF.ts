import jsPDF from "jspdf";
import { PassportData } from "@/hooks/usePassport";

export const generatePassportPDF = (passport: PassportData) => {
  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 7;
  const pageHeight = 280;
  const margin = 20;

  const checkPageBreak = (height: number = 20) => {
    if (yPos + height > pageHeight) {
      doc.addPage();
      yPos = 20;
    }
  };

  const addTitle = (text: string) => {
    checkPageBreak(15);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 55, 78);
    doc.text(text, margin, yPos);
    yPos += lineHeight + 3;
  };

  const addField = (label: string, value: string) => {
    if (!value || value.trim() === "") return;
    checkPageBreak();
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text(`${label}:`, margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const textLines = doc.splitTextToSize(value, 160);
    doc.text(textLines, margin + 50, yPos);
    yPos += lineHeight * textLines.length;
  };

  const addSection = (title: string, content: () => void) => {
    addTitle(title);
    content();
    yPos += 5;
  };

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 55, 78);
  doc.text("Mon Passeport de Vie", 105, yPos, { align: "center" });
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 105, yPos, { align: "center" });
  yPos += 15;

  // Identity Section
  const identityData = passport.identity_data as Record<string, string> | null;
  if (identityData && passport.identity_completed) {
    addSection("1. Mon Identité", () => {
      addField("Nom", identityData.lastName);
      addField("Prénom", identityData.firstName);
      addField("Date de naissance", identityData.birthDate);
      addField("Lieu de naissance", identityData.birthPlace);
      addField("Nationalité", identityData.nationality);
      addField("Adresse", identityData.address);
      addField("Code postal", identityData.postalCode);
      addField("Ville", identityData.city);
      addField("Téléphone", identityData.phone);
      addField("Email", identityData.email);
    });
  }

  // Trusted Person Section
  const trustedData = passport.trusted_person_data as Record<string, string> | null;
  if (trustedData && passport.trusted_person_completed) {
    addSection("2. Personne de Confiance", () => {
      addField("Nom", trustedData.fullName);
      addField("Lien", trustedData.relationship);
      addField("Téléphone", trustedData.phone);
      addField("Email", trustedData.email);
      addField("Adresse", trustedData.address);
      addField("Notes", trustedData.notes);
    });
  }

  // Contacts Section
  const contactsData = passport.contacts_data as { contacts?: Array<Record<string, string>> } | null;
  if (contactsData?.contacts && passport.contacts_completed) {
    addSection("3. Contacts Essentiels", () => {
      contactsData.contacts?.forEach((contact, index) => {
        if (contact.name) {
          checkPageBreak(25);
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text(`Contact ${index + 1}`, margin, yPos);
          yPos += lineHeight;
          addField("Nom", contact.name);
          addField("Rôle", contact.role);
          addField("Téléphone", contact.phone);
          addField("Email", contact.email);
        }
      });
    });
  }

  // Documents Section
  const documentsData = passport.documents_data as Record<string, string> | null;
  if (documentsData && passport.documents_completed) {
    addSection("4. Documents Importants", () => {
      addField("Carte d'identité", documentsData.idCardLocation);
      addField("Passeport", documentsData.passportLocation);
      addField("Acte de naissance", documentsData.birthCertificateLocation);
      addField("Livret de famille", documentsData.marriageCertificateLocation);
      addField("Permis de conduire", documentsData.drivingLicenseLocation);
      addField("Coffre-fort", documentsData.safeLocation);
      addField("Code coffre", documentsData.safeCode);
      addField("Autres", documentsData.otherDocuments);
    });
  }

  // Administrative Section
  const adminData = passport.administrative_data as Record<string, unknown> | null;
  if (adminData && passport.administrative_completed) {
    addSection("5. Situation Financière", () => {
      const bankAccounts = adminData.bankAccounts as Array<Record<string, string>> | undefined;
      if (bankAccounts) {
        bankAccounts.forEach((account, index) => {
          if (account.bank) {
            addField(`Banque ${index + 1}`, `${account.bank} - ${account.accountType}`);
            if (account.notes) addField("Notes", account.notes);
          }
        });
      }
      addField("Assurance", adminData.insuranceCompany as string);
      addField("N° contrat", adminData.insuranceContract as string);
      addField("N° fiscal", adminData.taxNumber as string);
      addField("N° sécurité sociale", adminData.socialSecurityNumber as string);
      addField("Employeur", adminData.employer as string);
      addField("Caisse retraite", adminData.pension as string);
      addField("Autres", adminData.otherInfo as string);
    });
  }

  // Digital Section
  const digitalData = passport.digital_data as Record<string, unknown> | null;
  if (digitalData && passport.digital_completed) {
    addSection("6. Environnement Numérique", () => {
      addField("Email principal", digitalData.emailAddress as string);
      addField("Fournisseur email", digitalData.emailProvider as string);
      addField("Opérateur mobile", digitalData.phoneProvider as string);
      addField("Gestionnaire MDP", digitalData.passwordManager as string);
      const accounts = digitalData.accounts as Array<Record<string, string>> | undefined;
      if (accounts) {
        accounts.forEach((account, index) => {
          if (account.platform) {
            addField(`Compte ${index + 1}`, `${account.platform} - ${account.username}`);
          }
        });
      }
      addField("Autres", digitalData.otherInfo as string);
    });
  }

  // Checklists Section
  const checklistsData = passport.checklists_data as Record<string, string> | null;
  if (checklistsData && passport.checklists_completed) {
    addSection("7. Checklists d'Urgence", () => {
      addField("En cas d'hospitalisation", checklistsData.hospitalization);
      addField("En cas d'incapacité", checklistsData.incapacity);
      addField("En cas de décès", checklistsData.death);
      addField("Animaux", checklistsData.pets);
      addField("Numéros d'urgence", checklistsData.emergencyContacts);
      addField("Autres", checklistsData.other);
    });
  }

  // Personal Message Section
  const messageData = passport.personal_message_data as Record<string, string> | null;
  if (messageData && passport.personal_message_completed) {
    addSection("8. Message Personnel", () => {
      addField("Message", messageData.message);
      addField("Dernières volontés", messageData.wishes);
      addField("Conseils", messageData.advice);
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} / ${pageCount}`, 105, 290, { align: "center" });
    doc.text("Passeport de Vie - Document confidentiel", 105, 295, { align: "center" });
  }

  // Download
  doc.save("mon-passeport-de-vie.pdf");
};
