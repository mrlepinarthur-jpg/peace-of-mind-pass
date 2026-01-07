-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create passports table to store passport data
CREATE TABLE public.passports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Section 1: Identity
  identity_data JSONB DEFAULT '{}'::jsonb,
  identity_completed BOOLEAN DEFAULT false,
  
  -- Section 2: Trusted person
  trusted_person_data JSONB DEFAULT '{}'::jsonb,
  trusted_person_completed BOOLEAN DEFAULT false,
  
  -- Section 3: Essential contacts
  contacts_data JSONB DEFAULT '{}'::jsonb,
  contacts_completed BOOLEAN DEFAULT false,
  
  -- Section 4: Document locations
  documents_data JSONB DEFAULT '{}'::jsonb,
  documents_completed BOOLEAN DEFAULT false,
  
  -- Section 5: Administrative situation
  administrative_data JSONB DEFAULT '{}'::jsonb,
  administrative_completed BOOLEAN DEFAULT false,
  
  -- Section 6: Digital environment
  digital_data JSONB DEFAULT '{}'::jsonb,
  digital_completed BOOLEAN DEFAULT false,
  
  -- Section 7: Checklists
  checklists_data JSONB DEFAULT '{}'::jsonb,
  checklists_completed BOOLEAN DEFAULT false,
  
  -- Section 8: Personal message
  personal_message_data JSONB DEFAULT '{}'::jsonb,
  personal_message_completed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_user_passport UNIQUE (user_id)
);

-- Enable RLS on passports
ALTER TABLE public.passports ENABLE ROW LEVEL SECURITY;

-- RLS policies for passports
CREATE POLICY "Users can view their own passport"
  ON public.passports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own passport"
  ON public.passports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own passport"
  ON public.passports FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own passport"
  ON public.passports FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_passports_updated_at
  BEFORE UPDATE ON public.passports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  
  -- Also create an empty passport for the new user
  INSERT INTO public.passports (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();