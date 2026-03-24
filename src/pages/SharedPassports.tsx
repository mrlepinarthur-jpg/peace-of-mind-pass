import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Lock, AlertTriangle, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface SharedPassport {
  ownerName: string;
  ownerEmail: string;
  userId: string;
  hasActiveEmergency: boolean;
  accessToken: string | null;
}

const SharedPassports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sharedPassports, setSharedPassports] = useState<SharedPassport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const fetchShared = async () => {
      try {
        // Find trusted_access entries where this user's email is the trusted person
        const { data: trustedEntries, error } = await supabase
          .from("trusted_access")
          .select("user_id, trusted_name")
          .eq("trusted_email", user.email);

        if (error) throw error;

        if (!trustedEntries || trustedEntries.length === 0) {
          setSharedPassports([]);
          setLoading(false);
          return;
        }

        const results: SharedPassport[] = [];

        for (const entry of trustedEntries) {
          // Check for active emergency access
          const { data: emergencyReq } = await supabase
            .from("emergency_access_requests")
            .select("status, access_token, access_expires_at")
            .eq("owner_user_id", entry.user_id)
            .eq("trusted_email", user.email)
            .in("status", ["granted", "waiting"])
            .order("created_at", { ascending: false })
            .limit(1);

          const activeReq = emergencyReq?.[0];
          const isGranted = activeReq?.status === "granted" &&
            activeReq.access_expires_at &&
            new Date(activeReq.access_expires_at) > new Date();

          // Get owner profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("user_id", entry.user_id)
            .maybeSingle();

          results.push({
            ownerName: profile?.full_name || entry.trusted_name || "Utilisateur",
            ownerEmail: profile?.email || "",
            userId: entry.user_id,
            hasActiveEmergency: isGranted || false,
            accessToken: isGranted ? activeReq?.access_token || null : null,
          });
        }

        setSharedPassports(results);
      } catch (error) {
        console.error("Error fetching shared passports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShared();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Passeports partagés</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Les personnes qui vous ont désigné comme personne de confiance
        </p>
      </div>

      {sharedPassports.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Aucun passeport partagé
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Personne ne vous a encore désigné comme personne de confiance.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {sharedPassports.map((sp, index) => (
            <motion.div
              key={sp.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Avatar initials */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold ${
                      sp.hasActiveEmergency
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary"
                    }`}>
                      {sp.ownerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || <User className="w-6 h-6" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{sp.ownerName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {sp.hasActiveEmergency ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-semibold">
                            <AlertTriangle className="w-3 h-3" />
                            Urgence active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold">
                            <Lock className="w-3 h-3" />
                            Verrouillé
                          </span>
                        )}
                      </div>
                    </div>

                    {sp.hasActiveEmergency && sp.accessToken ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => navigate(`/access/${sp.accessToken}`)}
                        className="gap-1 flex-shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Voir
                      </Button>
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Emergency access button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <Button
              variant="outline"
              className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => navigate("/emergency-access")}
            >
              <AlertTriangle className="w-4 h-4" />
              Demander l'accès d'urgence
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SharedPassports;
