-- Fix search path for all existing functions to meet security requirements

-- Update existing functions with proper search path
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.calculate_user_streak(uuid) SET search_path = 'public';
ALTER FUNCTION public.handle_updated_at() SET search_path = 'public';
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';
ALTER FUNCTION public.calculate_journal_streak(uuid) SET search_path = 'public';
ALTER FUNCTION public.update_mood_analytics(uuid, character varying, boolean) SET search_path = 'public';