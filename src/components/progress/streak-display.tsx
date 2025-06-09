import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  currentStreak: number;
}

export function StreakDisplay({ currentStreak }: StreakDisplayProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
        <Flame className="h-5 w-5 text-orange-500" /> {/* Using a direct color for Flame */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{currentStreak} days</div>
        <p className="text-xs text-muted-foreground">
          {currentStreak > 0 ? `Keep up the great work!` : `Start a new streak today!`}
        </p>
      </CardContent>
    </Card>
  );
}
