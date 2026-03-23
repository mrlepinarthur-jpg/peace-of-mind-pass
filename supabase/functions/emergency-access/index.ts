import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const FROM_EMAIL = "Passeport de Vie <onboarding@resend.dev>";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken(): string {
  return crypto.randomUUID() + "-" + crypto.randomUUID();
}

async function sendEmail(to: string, subject: string, html: string) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.error("RESEND_API_KEY not configured");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`Resend error: ${res.status} ${err}`);
  } else {
    console.log(`Email sent to ${to}: ${subject}`);
  }
}

function otpEmailHtml(otp: string, trustedName: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:30px">
      <h2 style="color:#1a1a2e">Passeport de Vie – Code de vérification</h2>
      <p>Bonjour <strong>${trustedName}</strong>,</p>
      <p>Une demande d'accès d'urgence a été initiée. Voici votre code de vérification :</p>
      <div style="background:#f0f0f5;border-radius:12px;padding:20px;text-align:center;margin:20px 0">
        <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1a1a2e">${otp}</span>
      </div>
      <p style="color:#666;font-size:14px">Ce code expire dans <strong>10 minutes</strong>.</p>
      <p style="color:#999;font-size:12px">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    </div>`;
}

function ownerNotificationHtml(trustedEmail: string, denyUrl: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:30px">
      <h2 style="color:#1a1a2e">⚠️ Demande d'accès d'urgence</h2>
      <p>Une personne (<strong>${trustedEmail}</strong>) a demandé l'accès à votre Passeport de Vie.</p>
      <p>L'accès sera automatiquement accordé dans <strong>1 heure</strong> si vous ne réagissez pas.</p>
      <div style="text-align:center;margin:25px 0">
        <a href="${denyUrl}" style="background:#dc2626;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px">
          🚫 Refuser l'accès
        </a>
      </div>
      <p style="color:#999;font-size:12px">Si vous êtes à l'origine de cette demande, aucune action n'est requise.</p>
    </div>`;
}

function accessGrantedHtml(trustedName: string, accessUrl: string, expiresAt: string): string {
  const expDate = new Date(expiresAt).toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  return `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:30px">
      <h2 style="color:#1a1a2e">✅ Accès au Passeport de Vie accordé</h2>
      <p>Bonjour <strong>${trustedName}</strong>,</p>
      <p>Vous avez maintenant accès au Passeport de Vie en lecture seule.</p>
      <div style="text-align:center;margin:25px 0">
        <a href="${accessUrl}" style="background:#1a1a2e;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px">
          📄 Consulter le Passeport
        </a>
      </div>
      <p style="color:#666;font-size:14px">Cet accès expire le <strong>${expDate}</strong>.</p>
    </div>`;
}

function getAppBaseUrl(): string {
  return "https://peace-of-mind-pass.lovable.app";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const { action, ...params } = await req.json();

    // ACTION 1: Request emergency access (send OTP)
    if (action === "request_access") {
      const { email } = params;
      if (!email) {
        return new Response(JSON.stringify({ error: "Email requis" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: trustedAccess } = await supabase
        .from("trusted_access")
        .select("*")
        .eq("trusted_email", email.toLowerCase().trim())
        .maybeSingle();

      if (!trustedAccess) {
        return new Response(
          JSON.stringify({ error: "Email non reconnu comme personne de confiance" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { data: request, error } = await supabase
        .from("emergency_access_requests")
        .insert({
          owner_user_id: trustedAccess.user_id,
          trusted_email: email.toLowerCase().trim(),
          otp_code: otp,
          otp_expires_at: otpExpiresAt,
          status: "otp_sent",
        })
        .select()
        .single();

      if (error) throw error;

      // Send OTP email
      await sendEmail(
        email,
        "Votre code de vérification – Passeport de Vie",
        otpEmailHtml(otp, trustedAccess.trusted_name)
      );

      return new Response(
        JSON.stringify({
          success: true,
          requestId: request.id,
          securityMethod: trustedAccess.security_method,
          securityQuestion: trustedAccess.security_method === "question" ? trustedAccess.security_question : null,
          message: "Code OTP envoyé par email",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION 2: Verify OTP
    if (action === "verify_otp") {
      const { requestId, otp } = params;

      const { data: request } = await supabase
        .from("emergency_access_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (!request) {
        return new Response(JSON.stringify({ error: "Requête non trouvée" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (new Date(request.otp_expires_at) < new Date()) {
        return new Response(JSON.stringify({ error: "Code OTP expiré" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (request.otp_code !== otp) {
        return new Response(JSON.stringify({ error: "Code OTP incorrect" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabase
        .from("emergency_access_requests")
        .update({ otp_verified: true, status: "otp_verified" })
        .eq("id", requestId);

      const { data: trustedAccess } = await supabase
        .from("trusted_access")
        .select("security_method, security_question")
        .eq("user_id", request.owner_user_id)
        .single();

      return new Response(
        JSON.stringify({
          success: true,
          securityMethod: trustedAccess?.security_method || "none",
          securityQuestion: trustedAccess?.security_method === "question" ? trustedAccess.security_question : null,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION 3: Verify security (code or question) and grant access
    if (action === "verify_security") {
      const { requestId, securityCode, securityAnswer } = params;

      const { data: request } = await supabase
        .from("emergency_access_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (!request || !request.otp_verified) {
        return new Response(JSON.stringify({ error: "OTP non vérifié" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: trustedAccess } = await supabase
        .from("trusted_access")
        .select("*")
        .eq("user_id", request.owner_user_id)
        .single();

      if (!trustedAccess) {
        return new Response(JSON.stringify({ error: "Configuration non trouvée" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get owner email for notifications
      const { data: ownerProfile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("user_id", request.owner_user_id)
        .single();

      let securityOk = false;

      if (trustedAccess.security_method === "code") {
        securityOk = trustedAccess.security_code === securityCode;
      } else if (trustedAccess.security_method === "question") {
        securityOk =
          trustedAccess.security_answer?.toLowerCase().trim() ===
          securityAnswer?.toLowerCase().trim();
      } else {
        // No security method - waiting approval mode
        const denialToken = generateToken();
        const waitingUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        await supabase
          .from("emergency_access_requests")
          .update({
            status: "waiting_approval",
            denial_token: denialToken,
            waiting_until: waitingUntil,
          })
          .eq("id", requestId);

        // Send notification to owner with denial link
        if (ownerProfile?.email) {
          const denyUrl = `${getAppBaseUrl()}/deny-access?token=${denialToken}`;
          await sendEmail(
            ownerProfile.email,
            "⚠️ Demande d'accès d'urgence à votre Passeport de Vie",
            ownerNotificationHtml(request.trusted_email, denyUrl)
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            status: "waiting_approval",
            waitingUntil,
            message: "Le titulaire a été notifié. Accès automatique dans 1 heure.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!securityOk) {
        return new Response(
          JSON.stringify({ error: "Vérification de sécurité échouée" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Grant immediate access
      const accessToken = generateToken();
      const accessExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      await supabase
        .from("emergency_access_requests")
        .update({
          security_verified: true,
          status: "granted",
          access_token: accessToken,
          access_granted_at: new Date().toISOString(),
          access_expires_at: accessExpiresAt,
        })
        .eq("id", requestId);

      // Send access granted email to trusted person
      const accessUrl = `${getAppBaseUrl()}/access/${accessToken}`;
      await sendEmail(
        request.trusted_email,
        "✅ Accès accordé – Passeport de Vie",
        accessGrantedHtml(trustedAccess.trusted_name, accessUrl, accessExpiresAt)
      );

      return new Response(
        JSON.stringify({
          success: true,
          status: "granted",
          accessToken,
          expiresAt: accessExpiresAt,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION 4: Check waiting status & auto-grant
    if (action === "check_status") {
      const { requestId } = params;

      const { data: request } = await supabase
        .from("emergency_access_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (!request) {
        return new Response(JSON.stringify({ error: "Requête non trouvée" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (request.status === "denied") {
        return new Response(
          JSON.stringify({ status: "denied", message: "Accès refusé par le titulaire" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (request.status === "granted") {
        return new Response(
          JSON.stringify({ status: "granted", accessToken: request.access_token, expiresAt: request.access_expires_at }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (request.status === "waiting_approval" && request.waiting_until) {
        if (new Date(request.waiting_until) <= new Date()) {
          // Auto-grant after 1 hour
          const accessToken = generateToken();
          const accessExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

          await supabase
            .from("emergency_access_requests")
            .update({
              status: "granted",
              access_token: accessToken,
              access_granted_at: new Date().toISOString(),
              access_expires_at: accessExpiresAt,
            })
            .eq("id", requestId);

          // Get trusted access info for email
          const { data: trustedAccess } = await supabase
            .from("trusted_access")
            .select("trusted_name")
            .eq("user_id", request.owner_user_id)
            .single();

          // Send access granted email
          const accessUrl = `${getAppBaseUrl()}/access/${accessToken}`;
          await sendEmail(
            request.trusted_email,
            "✅ Accès accordé – Passeport de Vie",
            accessGrantedHtml(trustedAccess?.trusted_name || "Personne de confiance", accessUrl, accessExpiresAt)
          );

          return new Response(
            JSON.stringify({ status: "granted", accessToken, expiresAt: accessExpiresAt }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            status: "waiting_approval",
            waitingUntil: request.waiting_until,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ status: request.status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION 5: Deny access (from owner email link)
    if (action === "deny_access") {
      const { denialToken } = params;

      const { data: request } = await supabase
        .from("emergency_access_requests")
        .select("*")
        .eq("denial_token", denialToken)
        .single();

      if (!request) {
        return new Response(JSON.stringify({ error: "Lien invalide" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (request.status !== "waiting_approval") {
        return new Response(
          JSON.stringify({ error: "Cette demande a déjà été traitée" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await supabase
        .from("emergency_access_requests")
        .update({ status: "denied" })
        .eq("id", request.id);

      return new Response(
        JSON.stringify({ success: true, message: "Accès refusé avec succès" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION 6: Get passport by access token (for reading)
    if (action === "get_passport") {
      const { accessToken } = params;

      const { data: request } = await supabase
        .from("emergency_access_requests")
        .select("*")
        .eq("access_token", accessToken)
        .eq("status", "granted")
        .single();

      if (!request) {
        return new Response(JSON.stringify({ error: "Accès non autorisé" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (new Date(request.access_expires_at!) < new Date()) {
        await supabase
          .from("emergency_access_requests")
          .update({ status: "expired" })
          .eq("id", request.id);

        return new Response(JSON.stringify({ error: "Lien d'accès expiré" }), {
          status: 410,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: passport } = await supabase
        .from("passports")
        .select("*")
        .eq("user_id", request.owner_user_id)
        .single();

      if (!passport) {
        return new Response(JSON.stringify({ error: "Passeport non trouvé" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("user_id", request.owner_user_id)
        .single();

      return new Response(
        JSON.stringify({
          passport,
          ownerName: profile?.full_name || "Titulaire",
          expiresAt: request.access_expires_at,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION 7: Direct activation by owner
    if (action === "activate_direct") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Non authentifié" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      if (!user) {
        return new Response(JSON.stringify({ error: "Non authentifié" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: trustedAccess } = await supabase
        .from("trusted_access")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!trustedAccess) {
        return new Response(
          JSON.stringify({ error: "Aucune personne de confiance configurée" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const accessToken = generateToken();
      const accessExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      await supabase.from("emergency_access_requests").insert({
        owner_user_id: user.id,
        trusted_email: trustedAccess.trusted_email,
        otp_code: "direct",
        otp_expires_at: new Date().toISOString(),
        otp_verified: true,
        security_verified: true,
        access_token: accessToken,
        access_granted_at: new Date().toISOString(),
        access_expires_at: accessExpiresAt,
        status: "granted",
      });

      // Send access email to trusted person
      const accessUrl = `${getAppBaseUrl()}/access/${accessToken}`;
      await sendEmail(
        trustedAccess.trusted_email,
        "✅ Accès accordé – Passeport de Vie",
        accessGrantedHtml(trustedAccess.trusted_name, accessUrl, accessExpiresAt)
      );

      return new Response(
        JSON.stringify({
          success: true,
          accessToken,
          trustedEmail: trustedAccess.trusted_email,
          trustedName: trustedAccess.trusted_name,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Action inconnue" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
