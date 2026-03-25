-- Add 5 new passport sections
ALTER TABLE public.passports
  ADD COLUMN IF NOT EXISTS insurance_data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS insurance_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS legal_docs_data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS legal_docs_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS digital_access_data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS digital_access_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS personal_wishes_data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS personal_wishes_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS pets_data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS pets_completed boolean DEFAULT false;

-- Family members table
CREATE TABLE public.family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL,
  member_email text NOT NULL,
  member_name text NOT NULL,
  member_user_id uuid,
  status text NOT NULL DEFAULT 'invited',
  visible_sections text[] DEFAULT '{}',
  invited_at timestamp with time zone NOT NULL DEFAULT now(),
  joined_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(owner_user_id, member_email)
);

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Owner can manage their family members
CREATE POLICY "Owners can manage family members"
ON public.family_members
FOR ALL
TO authenticated
USING (auth.uid() = owner_user_id)
WITH CHECK (auth.uid() = owner_user_id);

-- Members can view their own invitations
CREATE POLICY "Members can view their invitations"
ON public.family_members
FOR SELECT
TO authenticated
USING (
  member_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Reminder preferences table
CREATE TABLE public.reminder_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  frequency text NOT NULL DEFAULT 'never',
  last_reminder_sent_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.reminder_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own reminder preferences"
ON public.reminder_preferences
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);