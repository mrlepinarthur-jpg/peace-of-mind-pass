-- family_profiles table for multi-profile management
CREATE TABLE public.family_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  linked_user_id UUID,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  relationship TEXT NOT NULL DEFAULT 'autre',
  invite_email TEXT,
  invite_token TEXT UNIQUE,
  invite_status TEXT NOT NULL DEFAULT 'none',
  passport_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_self BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_family_profiles_owner ON public.family_profiles(owner_id);
CREATE INDEX idx_family_profiles_linked ON public.family_profiles(linked_user_id);
CREATE INDEX idx_family_profiles_token ON public.family_profiles(invite_token);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_profiles TO authenticated;
GRANT ALL ON public.family_profiles TO service_role;

ALTER TABLE public.family_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their family profiles"
  ON public.family_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Linked users can view their profile"
  ON public.family_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = linked_user_id);

CREATE TRIGGER trg_family_profiles_updated
  BEFORE UPDATE ON public.family_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: create self profile for new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  INSERT INTO public.passports (user_id) VALUES (NEW.id);
  INSERT INTO public.family_profiles (owner_id, first_name, last_name, relationship, is_self, invite_status)
  VALUES (NEW.id, '', '', 'titulaire', true, 'none');
  RETURN NEW;
END;
$$;

-- Backfill: ensure each existing user has a self profile
INSERT INTO public.family_profiles (owner_id, first_name, last_name, relationship, is_self, invite_status)
SELECT p.user_id,
       COALESCE(p.first_name, ''),
       COALESCE(p.last_name, ''),
       'titulaire', true, 'none'
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.family_profiles fp
  WHERE fp.owner_id = p.user_id AND fp.is_self = true
);

-- RPC: accept an invitation
CREATE OR REPLACE FUNCTION public.accept_profile_invite(_token TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _profile_id UUID;
  _email TEXT;
BEGIN
  SELECT email INTO _email FROM auth.users WHERE id = auth.uid();
  IF _email IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.family_profiles
     SET linked_user_id = auth.uid(),
         invite_status = 'accepted',
         invite_token = NULL
   WHERE invite_token = _token
     AND invite_status = 'pending'
   RETURNING id INTO _profile_id;

  IF _profile_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invitation';
  END IF;

  RETURN _profile_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.accept_profile_invite(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.accept_profile_invite(TEXT) TO authenticated;