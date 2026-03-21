import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, KeyRound, HelpCircle, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type Step = "email" | "otp" | "security" | "waiting" | "granted" | "denied";

const EmergencyAccess = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [requestId, setRequestId] = useState("");
  const [securityMethod, setSecurityMethod] = useState<string>("none");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [waitingUntil, setWaitingUntil] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const invoke = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("emergency-access", { body });
    if (error) throw new Error(error.message);
    return data;
  };

  const handleRequestAccess = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await invoke({ action: "request_access", email: email.trim() });
      if (res.error) { setError(res.error); return; }
      setRequestId(res.requestId);
      setSecurityMethod(res.securityMethod);
      setSecurityQuestion(res.securityQuestion || "");
      setStep("otp");
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await invoke({ action: "verify_otp", requestId, otp });
      if (res.error) { setError(res.error); return; }
      setSecurityMethod(res.securityMethod);
      setSecurityQuestion(res.securityQuestion || "");

      if (res.securityMethod === "none") {
        // Go directly to verify_security which will trigger waiting mode
        const secRes = await invoke({ action: "verify_security", requestId });
        if (secRes.status === "waiting_approval") {
          setWaitingUntil(secRes.waitingUntil);
          setStep("waiting");
        } else if (secRes.status === "granted") {
          navigate(`/access/${secRes.accessToken}`);
        }
      } else {
        setStep("security");
      }
    } catch {
      setError("Erreur de vérification.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySecurity = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await invoke({
        action: "verify_security",
        requestId,
        securityCode: securityMethod === "code" ? securityCode : undefined,
        securityAnswer: securityMethod === "question" ? securityAnswer : undefined,
      });
      if (res.error) { setError(res.error); return; }
      if (res.status === "granted") {
        navigate(`/access/${res.accessToken}`);
      }
    } catch {
      setError("Erreur de vérification.");
    } finally {
      setLoading(false);
    }
  };

  // Poll waiting status
  useEffect(() => {
    if (step !== "waiting") return;
    const interval = setInterval(async () => {
      try {
        const res = await invoke({ action: "check_status", requestId });
        if (res.status === "granted") {
          navigate(`/access/${res.accessToken}`);
        } else if (res.status === "denied") {
          setStep("denied");
        }
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, [step, requestId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Accès d'Urgence</h1>
          <p className="text-muted-foreground mt-2">Passeport de Vie</p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card space-y-4">
          {/* STEP: Email */}
          {step === "email" && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Vérification d'identité</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Entrez l'email enregistré comme personne de confiance. Un code de vérification vous sera envoyé.
              </p>
              <div className="space-y-2">
                <Label htmlFor="email">Votre email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie@email.com"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={handleRequestAccess} disabled={loading || !email.trim()} className="w-full" variant="hero">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                Recevoir le code
              </Button>
            </>
          )}

          {/* STEP: OTP */}
          {step === "otp" && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Code de vérification</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Entrez le code à 6 chiffres envoyé à <strong>{email}</strong>
              </p>
              <div className="flex justify-center py-4">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6} className="w-full" variant="hero">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Vérifier
              </Button>
            </>
          )}

          {/* STEP: Security */}
          {step === "security" && (
            <>
              <div className="flex items-center gap-2 mb-2">
                {securityMethod === "code" ? (
                  <KeyRound className="w-5 h-5 text-primary" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-primary" />
                )}
                <h2 className="font-semibold text-foreground">Vérification de sécurité</h2>
              </div>
              {securityMethod === "code" ? (
                <>
                  <p className="text-sm text-muted-foreground">Entrez le code de sécurité à 6 chiffres fourni par le titulaire.</p>
                  <Input
                    type="text"
                    maxLength={6}
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Code à 6 chiffres"
                  />
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground font-medium">{securityQuestion}</p>
                  <Input
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="Votre réponse..."
                  />
                </>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                onClick={handleVerifySecurity}
                disabled={loading || (securityMethod === "code" ? securityCode.length !== 6 : !securityAnswer.trim())}
                className="w-full"
                variant="hero"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Valider
              </Button>
            </>
          )}

          {/* STEP: Waiting */}
          {step === "waiting" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-semibold text-foreground">En attente d'approbation</h2>
              <p className="text-sm text-muted-foreground">
                Le titulaire du passeport a été notifié. L'accès sera automatiquement accordé dans 1 heure, sauf refus du titulaire.
              </p>
              {waitingUntil && (
                <WaitingCountdown until={waitingUntil} />
              )}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Vérification automatique en cours...</span>
              </div>
            </div>
          )}

          {/* STEP: Denied */}
          {step === "denied" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="font-semibold text-foreground">Accès refusé</h2>
              <p className="text-sm text-muted-foreground">
                Le titulaire du passeport a refusé votre demande d'accès.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const WaitingCountdown = ({ until }: { until: string }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(until).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Accès imminent...");
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins}min ${secs.toString().padStart(2, "0")}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [until]);

  return (
    <div className="text-lg font-mono font-bold text-accent">{timeLeft}</div>
  );
};

export default EmergencyAccess;
