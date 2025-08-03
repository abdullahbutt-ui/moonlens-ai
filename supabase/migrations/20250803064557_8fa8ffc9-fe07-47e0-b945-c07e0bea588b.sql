-- Add premium features and achievements tracking

-- Add premium subscription tracking to user_preferences
ALTER TABLE public.user_preferences 
ADD COLUMN subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
ADD COLUMN subscription_end_date TIMESTAMPTZ,
ADD COLUMN achievements JSONB DEFAULT '{}',
ADD COLUMN streak_count INTEGER DEFAULT 0,
ADD COLUMN last_check_in_date DATE;

-- Create shareable mood cards table
CREATE TABLE public.mood_summary_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  dominant_mood TEXT NOT NULL,
  mood_distribution JSONB NOT NULL,
  challenges_completed INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  card_image_url TEXT,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start_date)
);

-- Enable RLS on mood_summary_cards
ALTER TABLE public.mood_summary_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for mood_summary_cards
CREATE POLICY "Users can view their own mood cards" ON public.mood_summary_cards
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood cards" ON public.mood_summary_cards
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood cards" ON public.mood_summary_cards
FOR UPDATE
USING (auth.uid() = user_id);

-- Update achievements when daily challenges are completed
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
$$ LANGUAGE plpgsql SECURITY DEFINER;