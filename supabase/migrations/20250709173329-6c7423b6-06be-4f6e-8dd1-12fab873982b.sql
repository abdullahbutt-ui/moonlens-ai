-- Create daily check-ins table
CREATE TABLE public.daily_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood EmotionType NOT NULL,
  check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, check_in_date)
);

-- Create enum for emotion types
CREATE TYPE public.EmotionType AS ENUM ('happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral', 'excited', 'calm', 'anxious');

-- Enable RLS
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own check-ins" 
ON public.daily_checkins 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own check-ins" 
ON public.daily_checkins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins" 
ON public.daily_checkins 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_checkins_updated_at
BEFORE UPDATE ON public.daily_checkins
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create function to calculate streak
CREATE OR REPLACE FUNCTION public.calculate_user_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 0;
  current_date DATE := CURRENT_DATE;
  check_date DATE;
BEGIN
  -- Check if user checked in today, if not start from yesterday
  SELECT check_in_date INTO check_date 
  FROM public.daily_checkins 
  WHERE user_id = user_uuid AND check_in_date = current_date;
  
  IF check_date IS NULL THEN
    current_date := current_date - INTERVAL '1 day';
  END IF;
  
  -- Count consecutive days going backwards
  WHILE EXISTS (
    SELECT 1 FROM public.daily_checkins 
    WHERE user_id = user_uuid AND check_in_date = current_date
  ) LOOP
    streak := streak + 1;
    current_date := current_date - INTERVAL '1 day';
  END LOOP;
  
  RETURN streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;