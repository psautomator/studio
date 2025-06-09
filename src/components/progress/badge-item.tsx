import type { Badge as BadgeType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpenCheck, Flame, Star as StarIcon, Trophy } from 'lucide-react'; // Added Trophy

interface BadgeItemProps {
  badge: BadgeType;
  isUnlocked: boolean;
}

// Mapping icon names to Lucide components
const iconComponents: { [key: string]: React.ElementType } = {
  Award,
  BookOpenCheck,
  Flame,
  StarIcon,
  Trophy, // Added Trophy
  default: Award, // Default icon
};


export function BadgeItem({ badge, isUnlocked }: BadgeItemProps) {
  const IconComponent = iconComponents[badge.icon] || iconComponents.default;

  return (
    <Card className={`shadow-md transition-opacity duration-300 ${isUnlocked ? 'opacity-100' : 'opacity-50 bg-muted/50'}`}>
      <CardHeader className="items-center text-center pb-2">
         <div className={`p-3 rounded-full ${isUnlocked ? 'bg-accent/20' : 'bg-muted-foreground/20'} mb-2`}>
          <IconComponent className={`h-8 w-8 ${isUnlocked ? 'text-accent' : 'text-muted-foreground'}`} />
        </div>
        <CardTitle className={`text-md font-semibold ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`}>{badge.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <CardDescription className="text-xs">{badge.description}</CardDescription>
        {!isUnlocked && badge.threshold && (
          <p className="text-xs text-muted-foreground mt-1">(Unlock at {badge.threshold})</p>
        )}
      </CardContent>
    </Card>
  );
}
