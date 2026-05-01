
"use client";

import { Achievement } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Shield, Star, Award, Zap, Compass, Flame } from "lucide-react";

const iconMap: Record<string, any> = {
  Shield, Star, Award, Zap, Compass, Flame
};

interface AchievementListProps {
  achievements: Achievement[];
}

export function AchievementList({ achievements }: AchievementListProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {achievements.map((achievement) => {
        const Icon = iconMap[achievement.icon] || Award;
        const isUnlocked = !!achievement.unlockedAt;

        return (
          <div key={achievement.id} className="group relative flex flex-col items-center gap-2">
            <div className={cn(
              "p-4 rounded-full border-2 transition-all duration-300",
              isUnlocked 
                ? "bg-secondary/10 border-secondary text-secondary scale-110 shadow-lg animate-celebrate" 
                : "bg-muted border-muted-foreground/20 text-muted-foreground/40 opacity-50"
            )}>
              <Icon className="h-8 w-8" />
            </div>
            <p className={cn(
              "text-[10px] font-bold text-center uppercase tracking-tighter leading-none max-w-[80px]",
              isUnlocked ? "text-foreground" : "text-muted-foreground"
            )}>
              {achievement.name}
            </p>
            {!isUnlocked && (
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 rounded-lg p-2 text-[9px] font-medium text-center">
                {achievement.description}
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
