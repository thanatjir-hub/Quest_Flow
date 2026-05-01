
"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Trophy } from "lucide-react";

interface GameProgressProps {
  level: number;
  xp: number;
  totalCompleted: number;
}

export function GameProgress({ level, xp, totalCompleted }: GameProgressProps) {
  const xpToNextLevel = 1000;
  const progress = (xp % xpToNextLevel) / (xpToNextLevel / 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg text-white">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Current Level</p>
            <h2 className="text-3xl font-black text-primary">Level {level}</h2>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Total Quests</p>
          <p className="text-2xl font-bold flex items-center justify-end gap-2 text-secondary">
            {totalCompleted} <Trophy className="h-5 w-5" />
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase">
          <span>{xp % xpToNextLevel} / {xpToNextLevel} XP</span>
          <span>Next Level</span>
        </div>
        <Progress value={progress} className="h-3 bg-muted" />
      </div>
    </div>
  );
}
