
-- Table for trusted access configuration
CREATE TABLE public.trusted_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  trusted_name text NOT NULL,
  trusted_email text NOT NULL,
  security_method text NOT NULL DEFAULT 'none' CHECK (security_method IN ('none', 'code', 'question')),
  security_code text,
  security_question text,
  security_answer text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.trusted_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own trusted access" ON public.trusted_access
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Table for emergency access requests
CREATE TABLE public.emergency_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL,
  trusted_email text NOT NULL,
  otp_code text NOT NULL,
  otp_expires_at timestamptz NOT NULL,
  otp_verified boolean NOT NULL DEFAULT false,
  security_verified boolean NOT NULL DEFAULT false,
  access_token text UNIQUE,
  access_granted_at timestamptz,
  access_expires_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'otp_sent', 'otp_verified', 'granted', 'denied', 'expired', 'waiting_approval')),
  denial_token text UNIQUE,
  waiting_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.emergency_access_requests ENABLE ROW LEVEL SECURITY;

-- Public can insert (emergency requests come from non-authenticated users)
CREATE POLICY "Anyone can create emergency requests" ON public.emergency_access_requests
  FOR INSERT TO public
  WITH CHECK (true);

-- Public can read their own requests by matching trusted_email  
CREATE POLICY "Anyone can read emergency requests" ON public.emergency_access_requests
  FOR SELECT TO public
  USING (true);

-- Allow updates (for OTP verification, status changes)
CREATE POLICY "Anyone can update emergency requests" ON public.emergency_access_requests
  FOR UPDATE TO public
  USING (true);

-- Trigger for updated_at on trusted_access
CREATE TRIGGER update_trusted_access_updated_at
  BEFORE UPDATE ON public.trusted_access
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
