import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify user
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const owner = userData.user;

    const body = await req.json().catch(() => ({}));
    const { email, firstName, relationship } = body as {
      email?: string; firstName?: string; relationship?: string;
    };

    if (!email || !firstName) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Get owner display name
    const { data: ownerProfile } = await admin
      .from("profiles")
      .select("first_name, last_name, full_name")
      .eq("user_id", owner.id)
      .maybeSingle();
    const ownerName = [ownerProfile?.first_name, ownerProfile?.last_name]
      .filter(Boolean).join(" ") || ownerProfile?.full_name || owner.email || "Un proche";

    const token = crypto.randomUUID() + "-" + crypto.randomUUID();

    const { data: inserted, error: insertErr } = await admin
      .from("family_profiles")
      .insert({
        owner_id: owner.id,
        first_name: firstName,
        last_name: "",
        relationship: relationship ?? "autre",
        invite_email: email,
        invite_token: token,
        invite_status: "pending",
      })
      .select()
      .single();

    if (insertErr) {
      return new Response(JSON.stringify({ error: insertErr.message }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send email via Resend
    // Hardcoded app base URL — never trust the request Origin header for email links
    const APP_BASE_URL = "https://peace-of-mind-pass.lovable.app";
    const acceptUrl = `${APP_BASE_URL}/accept-invite?token=${encodeURIComponent(token)}`;

    if (resendKey) {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; color: #1a1a1a;">
          <h2 style="color:#0c2340;">${ownerName} vous invite à créer votre Passeport de Vie</h2>
          <p>Bonjour ${firstName},</p>
          <p>${ownerName} souhaite que vous rejoigniez son cercle de confiance sur <strong>Passeport de Vie</strong>,
          une application qui aide à centraliser ses informations essentielles pour ses proches.</p>
          <p style="margin: 24px 0;">
            <a href="${acceptUrl}" style="background:#0c2340;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;">
              Accepter l'invitation
            </a>
          </p>
          <p style="font-size:12px;color:#666;">Ou copiez ce lien : ${acceptUrl}</p>
        </div>`;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Passeport de Vie <onboarding@resend.dev>",
          to: [email],
          subject: `${ownerName} vous invite à créer votre Passeport de Vie`,
          html,
        }),
      }).catch((e) => console.error("Email send failed", e));
    } else {
      console.warn("RESEND_API_KEY not set, skipping email send");
    }

    return new Response(JSON.stringify({ ok: true, profile: inserted, acceptUrl }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
