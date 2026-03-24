import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LucideIcon } from "lucide-react";
import { IdentityForm } from "./IdentityForm";
import { TrustedPersonForm } from "./TrustedPersonForm";
import { ContactsForm } from "./ContactsForm";
import { DocumentsForm } from "./DocumentsForm";
import { HealthForm } from "./HealthForm";
import { AdministrativeForm } from "./AdministrativeForm";
import { DigitalForm } from "./DigitalForm";
import { ChecklistsForm } from "./ChecklistsForm";
import { PersonalMessageForm } from "./PersonalMessageForm";
import { PassportData } from "@/hooks/usePassport";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionKey: string;
  title: string;
  icon: LucideIcon;
  passport: PassportData | null;
  onSave: (sectionKey: string, data: Record<string, unknown>, completed: boolean) => void;
}

export const SectionModal = ({
  isOpen,
  onClose,
  sectionKey,
  title,
  icon: Icon,
  passport,
  onSave,
}: SectionModalProps) => {
  const getSectionData = (): Record<string, unknown> => {
    if (!passport) return {};
    const dataKey = `${sectionKey}_data` as keyof PassportData;
    return (passport[dataKey] as Record<string, unknown>) || {};
  };

  const handleSave = (data: Record<string, unknown>, completed: boolean) => {
    onSave(sectionKey, data, completed);
    onClose();
  };

  const renderForm = () => {
    const data = getSectionData();

    switch (sectionKey) {
      case "identity":
        return <IdentityForm data={data} onSave={handleSave} />;
      case "trusted_person":
        return <TrustedPersonForm data={data} onSave={handleSave} />;
      case "contacts":
        return <ContactsForm data={data} onSave={handleSave} />;
      case "documents":
        return <DocumentsForm data={data} onSave={handleSave} />;
      case "administrative":
        return <AdministrativeForm data={data} onSave={handleSave} />;
      case "digital":
        return <DigitalForm data={data} onSave={handleSave} />;
      case "checklists":
        return <ChecklistsForm data={data} onSave={handleSave} />;
      case "personal_message":
        return <PersonalMessageForm data={data} onSave={handleSave} />;
      default:
        return <div>Section non trouvée</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-sage flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary-foreground" />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-100px)] px-6 pb-6">
          {renderForm()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
