import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; // ShadCN Progress
import { Star } from 'lucide-react';

interface XpDisplayProps {
  currentXp: number;
  xpToNextLevel: number;
  level: number;
}

export function XpDisplay({ currentXp, xpToNextLevel, level }: XpDisplayProps) {
  const progressPercentage = xpToNextLevel > 0 ? (currentXp / xpToNextLevel) * 100 : 100;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Experience Points (XP)</CardTitle>
        <Star className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{currentXp} XP</div>
        <p className="text-xs text-muted-foreground">
          Level {level} - {xpToNextLevel - currentXp} XP to next level
        </p>
        <Progress value={progressPercentage} className="mt-2 h-2" />
      </CardContent>
    </Card>
  );
}
