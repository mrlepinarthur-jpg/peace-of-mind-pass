
-- 1) Hide secret columns of emergency_access_requests from Data API (owners no longer read otp_code / access_token / denial_token)
REVOKE SELECT ON public.emergency_access_requests FROM authenticated, anon;
GRANT SELECT (
  id, owner_user_id, trusted_email, status,
  otp_verified, security_verified,
  otp_expires_at, access_expires_at, access_granted_at,
  waiting_until, created_at
) ON public.emergency_access_requests TO authenticated;

-- 2) Restrict get_auth_email() execution to authenticated users only
REVOKE EXECUTE ON FUNCTION public.get_auth_email() FROM anon, PUBLIC;

-- 3) Explicitly lock subscription writes from client roles (defense in depth)
REVOKE INSERT, UPDATE, DELETE ON public.subscriptions FROM authenticated, anon;
