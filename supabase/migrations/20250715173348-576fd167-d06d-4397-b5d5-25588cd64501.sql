-- Create enhanced tables for the upgraded mental fitness app

-- AI Journal entries table
CREATE TABLE public.ai_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  ai_prompt TEXT,
  mood_at_entry VARCHAR(20),
  emotion_tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User achievements table
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_type VARCHAR(50) NOT NULL,
  achievement_name VARCHAR(100) NOT NULL,
  description TEXT,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  streak_count INTEGER DEFAULT 0
);

-- User preferences and settings table  
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  is_premium BOOLEAN DEFAULT false,
  private_mode_enabled BOOLEAN DEFAULT false,
  pin_code VARCHAR(10),
  notification_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mood analytics table for detailed tracking
CREATE TABLE public.mood_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  primary_mood VARCHAR(20),
  mood_scores JSONB,
  burnout_score INTEGER CHECK (burnout_score >= 0 AND burnout_score <= 100),
  completed_challenges INTEGER DEFAULT 0,
  journal_entries_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enhanced daily challenges table
CREATE TABLE public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  challenge_type VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  difficulty_level VARCHAR(10) DEFAULT 'easy',
  estimated_minutes INTEGER DEFAULT 5,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood_context VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.ai_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ai_journal_entries
CREATE POLICY "Users can view their own journal entries" ON public.ai_journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries" ON public.ai_journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" ON public.ai_journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" ON public.ai_journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for mood_analytics
CREATE POLICY "Users can view their own mood analytics" ON public.mood_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood analytics" ON public.mood_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood analytics" ON public.mood_analytics
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for daily_challenges
CREATE POLICY "Users can view their own daily challenges" ON public.daily_challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily challenges" ON public.daily_challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily challenges" ON public.daily_challenges
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to calculate user streak
CREATE OR REPLACE FUNCTION public.calculate_journal_streak(user_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  streak INTEGER := 0;
  check_date_var DATE := CURRENT_DATE;
  found_date DATE;
BEGIN
  -- Check if user wrote a journal entry today, if not start from yesterday
  SELECT DATE(created_at) INTO found_date 
  FROM public.ai_journal_entries 
  WHERE user_id = user_uuid AND DATE(created_at) = check_date_var;
  
  IF found_date IS NULL THEN
    check_date_var := check_date_var - INTERVAL '1 day';
  END IF;
  
  -- Count consecutive days going backwards
  WHILE EXISTS (
    SELECT 1 FROM public.ai_journal_entries 
    WHERE user_id = user_uuid AND DATE(created_at) = check_date_var
  ) LOOP
    streak := streak + 1;
    check_date_var := check_date_var - INTERVAL '1 day';
  END LOOP;
  
  RETURN streak;
END;
$$;

-- Create function to update mood analytics
CREATE OR REPLACE FUNCTION public.update_mood_analytics(user_uuid uuid, mood_type varchar, challenge_completed boolean DEFAULT false)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
  current_scores JSONB;
  current_challenges INTEGER := 0;
  current_journal_count INTEGER := 0;
BEGIN
  -- Get current data for today
  SELECT mood_scores, completed_challenges, journal_entries_count
  INTO current_scores, current_challenges, current_journal_count
  FROM public.mood_analytics
  WHERE user_id = user_uuid AND date = today_date;
  
  -- Initialize if no record exists
  IF current_scores IS NULL THEN
    current_scores := '{}';
    current_challenges := 0;
    current_journal_count := 0;
  END IF;
  
  -- Update mood scores
  current_scores := current_scores || jsonb_build_object(mood_type, COALESCE((current_scores->>mood_type)::integer, 0) + 1);
  
  -- Update challenges if completed
  IF challenge_completed THEN
    current_challenges := current_challenges + 1;
  END IF;
  
  -- Count today's journal entries
  SELECT COUNT(*) INTO current_journal_count
  FROM public.ai_journal_entries
  WHERE user_id = user_uuid AND DATE(created_at) = today_date;
  
  -- Upsert mood analytics
  INSERT INTO public.mood_analytics (user_id, date, primary_mood, mood_scores, completed_challenges, journal_entries_count)
  VALUES (user_uuid, today_date, mood_type, current_scores, current_challenges, current_journal_count)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    primary_mood = EXCLUDED.primary_mood,
    mood_scores = EXCLUDED.mood_scores,
    completed_challenges = EXCLUDED.completed_challenges,
    journal_entries_count = EXCLUDED.journal_entries_count,
    updated_at = now();
END;
$$;

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_journal_entries_updated_at
  BEFORE UPDATE ON public.ai_journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mood_analytics_updated_at
  BEFORE UPDATE ON public.mood_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();