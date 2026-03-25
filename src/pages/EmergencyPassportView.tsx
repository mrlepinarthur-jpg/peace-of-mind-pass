import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, User, Heart, Phone, FolderOpen, Wallet, Laptop, ClipboardCheck, MessageSquare, AlertTriangle, Clock, Cross, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface PassportViewData {
  passport: Record<string, unknown>;
  ownerName: string;
  expiresAt: string;
}

const sectionConfig = [
  { key: "identity", icon: User, title: "Identité" },
  { key: "trusted_person", icon: Heart, title: "Personne de confiance" },
  { key: "contacts", icon: Phone, title: "Contacts essentiels" },
  { key: "documents", icon: FolderOpen, title: "Documents importants" },
  { key: "health", icon: Cross, title: "Fiche Santé" },
  { key: "administrative", icon: Wallet, title: "Situation financière" },
  { key: "digital", icon: Laptop, title: "Environnement numérique" },
  { key: "checklists", icon: ClipboardCheck, title: "Checklists d'urgence" },
  { key: "personal_message", icon: MessageSquare, title: "Message personnel" },
];

const EmergencyPassportView = () => {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<PassportViewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPassport = async () => {
      try {
        const { data: res, error: err } = await supabase.functions.invoke("emergency-access", {
          body: { action: "get_passport", accessToken: token },
        });
        if (err) throw err;
        if (res.error) { setError(res.error); return; }
        setData(res);
      } catch {
        setError("Impossible d'accéder au passeport.");
      } finally {
        setLoading(false);
      }
    };
    fetchPassport();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-8 shadow-card text-center max-w-md">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Accès impossible</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const passport = data.passport;
  const expiresAt = new Date(data.expiresAt);
  const healthData = passport.health_data as Record<string, unknown> | null;
  const healthCompleted = passport.health_completed as boolean;

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency banner */}
      <div className="bg-destructive text-destructive-foreground py-3 px-4 text-center text-sm font-medium flex items-center justify-center gap-2">
        <Shield className="w-4 h-4" />
        Accès d'urgence — Lecture seule
        <span className="mx-2">•</span>
        <Clock className="w-4 h-4" />
        Expire le {expiresAt.toLocaleDateString("fr-FR")} à {expiresAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Passeport de Vie — {data.ownerName}
            </h1>
          </div>

          {/* Emergency Medical Info Banner */}
          {healthCompleted && healthData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-destructive/10 border-2 border-destructive rounded-xl p-5 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-destructive rounded-lg flex items-center justify-center">
                  <Cross className="w-5 h-5 text-destructive-foreground" />
                </div>
                <h2 className="font-bold text-lg text-destructive">Informations médicales d'urgence</h2>
              </div>

              <div className="grid gap-3">
                {healthData.bloodType && (
                  <div className="flex justify-between items-center py-2 border-b border-destructive/20">
                    <span className="text-sm font-medium text-foreground">Groupe sanguin</span>
                    <span className="text-lg font-bold text-destructive">{String(healthData.bloodType)}</span>
                  </div>
                )}
                {healthData.allergies && String(healthData.allergies).trim() && (
                  <div className="py-2 border-b border-destructive/20">
                    <p className="text-sm font-medium text-foreground mb-1">Allergies</p>
                    <p className="text-sm text-destructive font-semibold">{String(healthData.allergies)}</p>
                  </div>
                )}
                {Array.isArray(healthData.treatments) && (healthData.treatments as Array<Record<string, string>>).length > 0 && (
                  <div className="py-2">
                    <p className="text-sm font-medium text-foreground mb-2">Traitements en cours</p>
                    {(healthData.treatments as Array<Record<string, string>>).map((t, i) => (
                      <div key={i} className="ml-2 text-sm text-foreground mb-1">
                        <span className="font-semibold">{t.medication}</span>
                        {t.dosage && <span> — {t.dosage}</span>}
                        {t.frequency && <span> ({t.frequency})</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* All sections */}
          <div className="space-y-4">
            {sectionConfig.map((section) => {
              const sectionData = passport[`${section.key}_data`] as Record<string, unknown> | null;
              const completed = passport[`${section.key}_completed`] as boolean;
              const Icon = section.icon;

              if (!completed || !sectionData) return null;

              // Skip health here since it's shown in the emergency banner above
              if (section.key === "health") return null;

              return (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-xl p-5 shadow-card"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 gradient-hero rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h2 className="font-semibold text-lg text-foreground">{section.title}</h2>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(sectionData).map(([key, value]) => {
                      if (!value || (typeof value === "string" && !value.trim())) return null;
                      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

                      if (Array.isArray(value)) {
                        return (
                          <div key={key}>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                            {value.map((item, i) => (
                              <div key={i} className="ml-2 mt-1 text-sm text-foreground">
                                {typeof item === "object" ? (
                                  Object.entries(item as Record<string, unknown>).map(([k, v]) =>
                                    v ? <p key={k}><span className="text-muted-foreground">{k}:</span> {String(v)}</p> : null
                                  )
                                ) : (
                                  <p>{String(item)}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      }

                      return (
                        <div key={key} className="flex justify-between py-1 border-b border-border/50 last:border-0">
                          <span className="text-sm text-muted-foreground">{label}</span>
                          <span className="text-sm text-foreground font-medium text-right max-w-[60%]">
                            {String(value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmergencyPassportView;
