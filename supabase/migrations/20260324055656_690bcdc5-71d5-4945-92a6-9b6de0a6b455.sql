CREATE POLICY "Trusted persons can view owner profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  user_id IN (
    SELECT ta.user_id FROM public.trusted_access ta
    WHERE ta.trusted_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);