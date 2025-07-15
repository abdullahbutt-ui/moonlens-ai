import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mood, promptType = 'reflection' } = await req.json();

    console.log('Generating journal prompt for mood:', mood, 'type:', promptType);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create mood-specific prompt templates
    const moodPrompts = {
      happy: [
        "What brought you the most joy today, and how can you cultivate more moments like this?",
        "Describe a moment today when you felt genuinely happy. What made it special?",
        "What are you grateful for right now, and how has it positively impacted your life?"
      ],
      sad: [
        "It's okay to feel sad. What emotions are you experiencing right now, and what do you need most today?",
        "Write about something that's weighing on your heart. Sometimes putting feelings into words can help.",
        "What would you tell a close friend who was feeling the way you feel right now?"
      ],
      anxious: [
        "What thoughts are creating anxiety for you today? Let's explore them gently.",
        "Describe your worries without judgment. What feels within your control right now?",
        "What are three things you can see, hear, and feel right now? Ground yourself in the present."
      ],
      angry: [
        "What triggered your anger today? Explore these feelings without judging yourself.",
        "Write about what you need right now to feel heard and understood.",
        "What boundaries do you need to set to protect your peace?"
      ],
      neutral: [
        "How are you truly feeling beneath the surface today?",
        "What's one small thing that would make today better?",
        "Describe your day as if you're telling your future self about it."
      ],
      excited: [
        "What's energizing you today? How can you channel this excitement productively?",
        "Describe what you're looking forward to and why it matters to you.",
        "What dreams feel possible right now, and what's your next step?"
      ],
      calm: [
        "What's contributing to your sense of peace today?",
        "Reflect on how you've grown recently. What are you proud of?",
        "What wisdom would you share with someone who's struggling today?"
      ],
      stressed: [
        "What's causing stress in your life right now? Let's break it down into manageable pieces.",
        "What support do you need today, and how can you ask for it?",
        "What's one small action you can take today to reduce your stress?"
      ]
    };

    // Get mood-specific prompts or use neutral as fallback
    const promptOptions = moodPrompts[mood as keyof typeof moodPrompts] || moodPrompts.neutral;
    const selectedPrompt = promptOptions[Math.floor(Math.random() * promptOptions.length)];

    // Use OpenAI to enhance the prompt based on the user's mood
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a compassionate mental wellness coach creating personalized journal prompts. 
            Create thoughtful, empathetic prompts that help people process their emotions safely. 
            Be gentle, non-judgmental, and encouraging. Keep prompts conversational and accessible.
            The user is feeling ${mood} today.`
          },
          {
            role: 'user',
            content: `Create a thoughtful journal prompt for someone feeling ${mood}. Make it personal, encouraging, and focused on emotional growth. Base it on this template but make it unique: "${selectedPrompt}"`
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedPrompt = data.choices[0].message.content.trim();

    console.log('Generated prompt:', generatedPrompt);

    return new Response(
      JSON.stringify({ 
        prompt: generatedPrompt,
        mood: mood,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in generate-journal-prompt function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate journal prompt',
        fallbackPrompt: "How are you feeling right now, and what's on your mind today?"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});