
-- 1) Restrict emergency_access_requests SELECT to owner only.
-- Trusted persons access flows through the emergency-access edge function (service role).
DROP POLICY IF EXISTS "Owners and trusted persons read emergency requests" ON public.emergency_access_requests;

CREATE POLICY "Owners read emergency requests"
ON public.emergency_access_requests
FOR SELECT
TO authenticated
USING (auth.uid() = owner_user_id);

-- 2) Hide sensitive columns on trusted_access from the Data API.
-- Owner can still INSERT/UPDATE them, but SELECT cannot return them.
REVOKE SELECT (security_answer, security_code, security_question, security_method)
  ON public.trusted_access FROM authenticated;
REVOKE SELECT (security_answer, security_code, security_question, security_method)
  ON public.trusted_access FROM anon;
