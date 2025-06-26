import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmotionType } from "@/types/emotion";
import { emotionColors, emotionEmojis } from "@/utils/emotionData";
interface CurrentMoodProps {
  emotion: EmotionType;
  confidence: number;
  isDetecting: boolean;
}
const CurrentMood = ({
  emotion,
  confidence,
  isDetecting
}: CurrentMoodProps) => {
  return <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
          <span>                       Current Mood</span>
          <div className={`w-3 h-3 rounded-full ${isDetecting ? 'bg-green-500 animate-pulse' : 'bg-gray-400 dark:bg-gray-600'}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center bg-slate-700">
        <div className="mb-4">
          <div className="text-6xl mb-2 transition-all duration-500 hover:scale-110" style={{
          filter: `hue-rotate(${emotion === 'happy' ? '0deg' : '45deg'})`
        }}>
            {emotionEmojis[emotion]}
          </div>
          <h3 className="text-2xl font-bold capitalize mb-2 dark:text-white" style={{
          color: emotionColors[emotion]
        }}>
            {emotion}
          </h3>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full transition-all duration-500 rounded-full" style={{
              width: `${confidence * 100}%`,
              backgroundColor: emotionColors[emotion]
            }} />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {Math.round(confidence * 100)}%
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isDetecting ? "Analyzing your expression..." : "Emotion detection paused"}
        </p>
      </CardContent>
    </Card>;
};
export default CurrentMood;