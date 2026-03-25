import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CalendarClock } from "lucide-react";

const FREQUENCIES = [
  { value: "never", label: "Jamais" },
  { value: "3months", label: "Tous les 3 mois" },
  { value: "6months", label: "Tous les 6 mois" },
  { value: "1year", label: "1 fois par an" },
];

export const ReminderPreferencesCard = () => {
  const { user } = useAuth();
  const [frequency, setFrequency] = useState("never");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("reminder_preferences")
        .select("frequency")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setFrequency((data as any).frequency || "never");
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleChange = async (newFreq: string) => {
    if (!user) return;
    setFrequency(newFreq);
    const { error } = await supabase
      .from("reminder_preferences")
      .upsert({ user_id: user.id, frequency: newFreq }, { onConflict: "user_id" });
    if (error) {
      toast({ title: "Erreur", description: "Impossible de sauvegarder.", variant: "destructive" });
    } else {
      toast({ title: "Préférence enregistrée" });
    }
  };

  if (loading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarClock className="w-5 h-5" />
          Rappels de mise à jour
        </CardTitle>
        <CardDescription>
          Recevez un email pour vous rappeler de mettre à jour votre passeport
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label>Fréquence des rappels</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={frequency}
            onChange={(e) => handleChange(e.target.value)}
          >
            {FREQUENCIES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
};
