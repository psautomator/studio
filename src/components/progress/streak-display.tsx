import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  currentStreak: number;
}

export function StreakDisplay({ currentStreak }: StreakDisplayProps) {
  let streakMessage = "";

  if (currentStreak === 0) {
    streakMessage = "Start a new streak today!";
  } else if (currentStreak < 5) {
    streakMessage = `Keep up the great work! You're on a ${currentStreak}-day streak.`;
  } else if (currentStreak < 10) {
    streakMessage = `Nice! ${currentStreak}-day streak, keep it up!`;
  } else if (currentStreak < 20) {
    streakMessage = `Amazing dedication! That's a ${currentStreak}-day streak!`;
  } else if (currentStreak < 50) {
    streakMessage = `Wow, a ${currentStreak}-day streak! You're on fire!`;
  } else {
    streakMessage = `Incredible! ${currentStreak}-day streak - you're a Javanese Journey legend!`;
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
        <Flame className="h-5 w-5 text-orange-500" /> {/* Using a direct color for Flame */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{currentStreak} days</div>
        <p className="text-xs text-muted-foreground">
          {streakMessage}
        </p>
      </CardContent>
    </Card>
  );
}
