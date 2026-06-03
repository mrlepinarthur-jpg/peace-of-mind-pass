
-- 1. emergency_access_requests: drop permissive public policies
DROP POLICY IF EXISTS "Anyone can create emergency requests" ON public.emergency_access_requests;
DROP POLICY IF EXISTS "Anyone can read emergency requests" ON public.emergency_access_requests;
DROP POLICY IF EXISTS "Anyone can update emergency requests" ON public.emergency_access_requests;

-- Owner or targeted trusted person can read
CREATE POLICY "Owners and trusted persons read emergency requests"
ON public.emergency_access_requests
FOR SELECT
TO authenticated
USING (
  auth.uid() = owner_user_id
  OR trusted_email = public.get_auth_email()
);

-- Owners can update (e.g. deny). Inserts/updates from the request flow go through edge functions using service role and bypass RLS.
CREATE POLICY "Owners can update their emergency requests"
ON public.emergency_access_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_user_id)
WITH CHECK (auth.uid() = owner_user_id);

-- 2. subscriptions: prevent users from modifying their plan/status
DROP POLICY IF EXISTS "Users manage own subscription" ON public.subscriptions;

CREATE POLICY "Users can view their own subscription"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- INSERT/UPDATE/DELETE intentionally restricted to service_role (Stripe webhook).

-- 3. trusted_access: stop exposing security_answer/security_code to trusted persons
DROP POLICY IF EXISTS "Trusted persons can view their trusted_access entries" ON public.trusted_access;

-- Safe RPC for the SharedPassports page (only non-sensitive columns)
CREATE OR REPLACE FUNCTION public.get_my_shared_trusted_entries()
RETURNS TABLE (owner_user_id uuid, trusted_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id, trusted_name
  FROM public.trusted_access
  WHERE trusted_email = public.get_auth_email();
$$;

REVOKE ALL ON FUNCTION public.get_my_shared_trusted_entries() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_shared_trusted_entries() TO authenticated;

-- 4. Lock down SECURITY DEFINER helpers that should not be callable from the API
REVOKE EXECUTE ON FUNCTION public.get_auth_email() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- accept_profile_invite is intentionally callable by authenticated users
REVOKE EXECUTE ON FUNCTION public.accept_profile_invite(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.accept_profile_invite(text) TO authenticated;
