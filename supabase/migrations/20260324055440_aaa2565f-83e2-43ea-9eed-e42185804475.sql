ALTER TABLE public.passports ADD COLUMN IF NOT EXISTS health_data jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.passports ADD COLUMN IF NOT EXISTS health_completed boolean DEFAULT false;