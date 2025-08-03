-- Fix search path for security functions
CREATE OR REPLACE FUNCTION public.update_user_achievements()
RETURNS TRIGGER AS $$
DECLARE
  current_preferences RECORD;
  new_achievements JSONB;
  streak_days INTEGER;
BEGIN
  -- Get current user preferences
  SELECT * INTO current_preferences 
  FROM public.user_preferences 
  WHERE user_id = NEW.user_id;
  
  -- If no preferences record exists, create one
  IF current_preferences IS NULL THEN
    INSERT INTO public.user_preferences (user_id) 
    VALUES (NEW.user_id)
    RETURNING * INTO current_preferences;
  END IF;
  
  new_achievements := COALESCE(current_preferences.achievements, '{}');
  
  -- Calculate streak if challenge was completed
  IF NEW.completed = true AND (OLD IS NULL OR OLD.completed = false) THEN
    -- Check if this is consecutive day
    IF current_preferences.last_check_in_date = CURRENT_DATE - INTERVAL '1 day' 
       OR current_preferences.last_check_in_date IS NULL THEN
      streak_days := COALESCE(current_preferences.streak_count, 0) + 1;
    ELSE
      streak_days := 1; -- Reset streak
    END IF;
    
    -- Update achievements based on streak
    IF streak_days >= 7 AND NOT (new_achievements ? 'week_streak') THEN
      new_achievements := new_achievements || '{"week_streak": true}';
    END IF;
    
    IF streak_days >= 30 AND NOT (new_achievements ? 'month_streak') THEN
      new_achievements := new_achievements || '{"month_streak": true}';
    END IF;
    
    -- Update user preferences
    UPDATE public.user_preferences 
    SET 
      achievements = new_achievements,
      streak_count = streak_days,
      last_check_in_date = CURRENT_DATE,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Add trigger for achievements
DROP TRIGGER IF EXISTS update_achievements_trigger ON public.daily_challenges;
CREATE TRIGGER update_achievements_trigger
  AFTER UPDATE ON public.daily_challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_achievements();