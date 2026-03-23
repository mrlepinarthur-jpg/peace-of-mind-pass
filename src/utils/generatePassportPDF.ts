import jsPDF from "jspdf";
import { PassportData } from "@/hooks/usePassport";

const setupDoc = () => {
  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 7;
  const pageHeight = 280;
  const margin = 20;

  const checkPageBreak = (height: number = 20) => {
    if (yPos + height > pageHeight) { doc.addPage(); yPos = 20; }
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

  const addHeader = () => {
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
  };

  const addFooter = () => {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} / ${pageCount}`, 105, 290, { align: "center" });
      doc.text("Passeport de Vie - Document confidentiel", 105, 295, { align: "center" });
    }
  };

  return { doc, checkPageBreak, addTitle, addField, addSection, addHeader, addFooter, getY: () => yPos, setY: (v: number) => { yPos = v; } };
};

const addIdentity = (pdf: ReturnType<typeof setupDoc>, passport: PassportData) => {
  const data = passport.identity_data as Record<string, string> | null;
  if (data && passport.identity_completed) {
    pdf.addSection("1. Mon Identité", () => {
      pdf.addField("Nom", data.lastName);
      pdf.addField("Prénom", data.firstName);
      pdf.addField("Date de naissance", data.birthDate);
      pdf.addField("Lieu de naissance", data.birthPlace);
      pdf.addField("Nationalité", data.nationality);
      pdf.addField("Adresse", data.address);
      pdf.addField("Code postal", data.postalCode);
      pdf.addField("Ville", data.city);
      pdf.addField("Téléphone", data.phone);
      pdf.addField("Email", data.email);
    });
  }
};

const addContacts = (pdf: ReturnType<typeof setupDoc>, passport: PassportData) => {
  const data = passport.contacts_data as { contacts?: Array<Record<string, string>> } | null;
  if (data?.contacts && passport.contacts_completed) {
    pdf.addSection("3. Contacts Essentiels", () => {
      data.contacts?.forEach((contact, index) => {
        if (contact.name) {
          pdf.checkPageBreak(25);
          pdf.addField(`Contact ${index + 1}`, contact.name);
          pdf.addField("Rôle", contact.role);
          pdf.addField("Téléphone", contact.phone);
          pdf.addField("Email", contact.email);
        }
      });
    });
  }
};

const addDocuments = (pdf: ReturnType<typeof setupDoc>, passport: PassportData) => {
  const data = passport.documents_data as Record<string, string> | null;
  if (data && passport.documents_completed) {
    pdf.addSection("4. Documents Importants", () => {
      pdf.addField("Carte d'identité", data.idCardLocation);
      pdf.addField("Passeport", data.passportLocation);
      pdf.addField("Acte de naissance", data.birthCertificateLocation);
      pdf.addField("Livret de famille", data.marriageCertificateLocation);
      pdf.addField("Permis de conduire", data.drivingLicenseLocation);
      pdf.addField("Coffre-fort", data.safeLocation);
      pdf.addField("Code coffre", data.safeCode);
      pdf.addField("Autres", data.otherDocuments);
    });
  }
};

const addTrustedPerson = (pdf: ReturnType<typeof setupDoc>, passport: PassportData) => {
  const data = passport.trusted_person_data as Record<string, string> | null;
  if (data && passport.trusted_person_completed) {
    pdf.addSection("2. Personne de Confiance", () => {
      pdf.addField("Nom", data.fullName);
      pdf.addField("Lien", data.relationship);
      pdf.addField("Téléphone", data.phone);
      pdf.addField("Email", data.email);
      pdf.addField("Adresse", data.address);
      pdf.addField("Notes", data.notes);
    });
  }
};

const addAdministrative = (pdf: ReturnType<typeof setupDoc>, passport: PassportData) => {
  const data = passport.administrative_data as Record<string, unknown> | null;
  if (data && passport.administrative_completed) {
    pdf.addSection("5. Situation Financière", () => {
      const bankAccounts = data.bankAccounts as Array<Record<string, string>> | undefined;
      if (bankAccounts) {
        bankAccounts.forEach((account, index) => {
          if (account.bank) {
            pdf.addField(`Banque ${index + 1}`, `${account.bank} - ${account.accountType}`);
            if (account.notes) pdf.addField("Notes", account.notes);
          }
        });
      }
      pdf.addField("Assurance", data.insuranceCompany as string);
      pdf.addField("N° contrat", data.insuranceContract as string);
      pdf.addField("N° fiscal", data.taxNumber as string);
      pdf.addField("N° sécurité sociale", data.socialSecurityNumber as string);
      pdf.addField("Employeur", data.employer as string);
      pdf.addField("Caisse retraite", data.pension as string);
      pdf.addField("Autres", data.otherInfo as string);
    });
  }
};

const addDigital = (pdf: ReturnType<typeof setupDoc>, passport: PassportData) => {
  const data = passport.digital_data as Record<string, unknown> | null;
  if (data && passport.digital_completed) {
    pdf.addSection("6. Environnement Numérique", () => {
      pdf.addField("Email principal", data.emailAddress as string);
      pdf.addField("Fournisseur email", data.emailProvider as string);
      pdf.addField("Opérateur mobile", data.phoneProvider as string);
      pdf.addField("Gestionnaire MDP", data.passwordManager as string);
      const accounts = data.accounts as Array<Record<string, string>> | undefined;
      if (accounts) {
        accounts.forEach((account, index) => {
          if (account.platform) {
            pdf.addField(`Compte ${index + 1}`, `${account.platform} - ${account.username}`);
          }
        });
      }
      pdf.addField("Autres", data.otherInfo as string);
    });
  }
};

const addChecklists = (pdf: ReturnType<typeof setupDoc>, passport: PassportData) => {
  const data = passport.checklists_data as Record<string, string> | null;
  if (data && passport.checklists_completed) {
    pdf.addSection("7. Checklists d'Urgence", () => {
      pdf.addField("En cas d'hospitalisation", data.hospitalization);
      pdf.addField("En cas d'incapacité", data.incapacity);
      pdf.addField("En cas de décès", data.death);
      pdf.addField("Animaux", data.pets);
      pdf.addField("Numéros d'urgence", data.emergencyContacts);
      pdf.addField("Autres", data.other);
    });
  }
};

const addPersonalMessage = (pdf: ReturnType<typeof setupDoc>, passport: PassportData) => {
  const data = passport.personal_message_data as Record<string, string> | null;
  if (data && passport.personal_message_completed) {
    pdf.addSection("8. Message Personnel", () => {
      pdf.addField("Message", data.message);
      pdf.addField("Dernières volontés", data.wishes);
      pdf.addField("Conseils", data.advice);
    });
  }
};

export const generatePassportPDF = (passport: PassportData) => {
  const pdf = setupDoc();
  pdf.addHeader();
  addIdentity(pdf, passport);
  addTrustedPerson(pdf, passport);
  addContacts(pdf, passport);
  addDocuments(pdf, passport);
  addAdministrative(pdf, passport);
  addDigital(pdf, passport);
  addChecklists(pdf, passport);
  addPersonalMessage(pdf, passport);
  pdf.addFooter();
  pdf.doc.save("mon-passeport-de-vie.pdf");
};

export const generateFreePDF = (passport: PassportData) => {
  const pdf = setupDoc();
  pdf.addHeader();

  // Free plan: only identity, contacts, documents
  addIdentity(pdf, passport);
  addContacts(pdf, passport);
  addDocuments(pdf, passport);

  // Upsell notice
  pdf.doc.setFontSize(11);
  pdf.doc.setFont("helvetica", "bold");
  pdf.doc.setTextColor(34, 55, 78);
  const y = pdf.getY() + 10;
  pdf.setY(y);
  pdf.doc.text("⭐ Passez à la formule Sérénité pour exporter", 105, pdf.getY(), { align: "center" });
  pdf.setY(pdf.getY() + 7);
  pdf.doc.text("toutes les sections de votre passeport.", 105, pdf.getY(), { align: "center" });

  pdf.addFooter();
  pdf.doc.save("mon-passeport-de-vie-essentiel.pdf");
};
