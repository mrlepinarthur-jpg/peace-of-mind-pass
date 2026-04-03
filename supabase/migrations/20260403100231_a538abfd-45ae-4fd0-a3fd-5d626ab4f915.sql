
-- Create a security definer function to safely get the current user's email
CREATE OR REPLACE FUNCTION public.get_auth_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email::text FROM auth.users WHERE id = auth.uid()
$$;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Trusted persons can view owner profiles" ON public.profiles;

-- Recreate it using the security definer function
CREATE POLICY "Trusted persons can view owner profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  user_id IN (
    SELECT ta.user_id FROM public.trusted_access ta
    WHERE ta.trusted_email = public.get_auth_email()
  )
);
