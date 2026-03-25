CREATE POLICY "Trusted persons can view their trusted_access entries"
ON public.trusted_access
FOR SELECT
TO authenticated
USING (
  trusted_email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  )
);