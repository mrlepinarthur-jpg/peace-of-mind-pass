
-- Fix trusted_access policy
DROP POLICY IF EXISTS "Trusted persons can view their trusted_access entries" ON public.trusted_access;

CREATE POLICY "Trusted persons can view their trusted_access entries"
ON public.trusted_access
FOR SELECT
TO authenticated
USING (trusted_email = public.get_auth_email());

-- Fix family_members policy
DROP POLICY IF EXISTS "Members can view their invitations" ON public.family_members;

CREATE POLICY "Members can view their invitations"
ON public.family_members
FOR SELECT
TO authenticated
USING (member_email = public.get_auth_email());
