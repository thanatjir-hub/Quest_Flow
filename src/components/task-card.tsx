
"use client";

import { useState } from "react";
import { Task, Priority } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Wand2, Trash2, Tag, Calendar, AlertCircle } from "lucide-react";
import { aiQuestBreakdown } from "@/ai/flows/ai-quest-breakdown";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onBreakdown: (id: string, subQuests: string[]) => void;
}

export function TaskCard({ task, onToggle, onDelete, onBreakdown }: TaskCardProps) {
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  const priorityColors = {
    low: "bg-blue-100 text-blue-700 border-blue-200",
    medium: "bg-orange-100 text-orange-700 border-orange-200",
    high: "bg-red-100 text-red-700 border-red-200",
  };

  const handleAIDecomposition = async () => {
    setIsBreakingDown(true);
    try {
      const result = await aiQuestBreakdown({ largeTask: task.title });
      onBreakdown(task.id, result.quests);
    } catch (error) {
      console.error("AI breakdown failed", error);
    } finally {
      setIsBreakingDown(false);
    }
  };

  return (
    <Card className={cn(
      "group relative transition-all duration-300 hover:shadow-md",
      task.isCompleted ? "opacity-60 bg-muted/30" : "bg-white"
    )}>
      <CardContent className="p-4 flex gap-4 items-start">
        <Checkbox 
          checked={task.isCompleted} 
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1 h-5 w-5 border-2 border-primary data-[state=checked]:bg-primary"
        />
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className={cn(
              "font-bold text-lg leading-tight",
              task.isCompleted && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={handleAIDecomposition}
                disabled={isBreakingDown || task.isCompleted}
              >
                <Wand2 className={cn("h-4 w-4", isBreakingDown && "animate-spin")} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline" className={cn("text-[10px] uppercase font-bold px-1.5 py-0", priorityColors[task.priority])}>
              {task.priority}
            </Badge>
            {task.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-[10px] bg-secondary/10 text-secondary hover:bg-secondary/20">
                <Tag className="h-2.5 w-2.5 mr-1" /> {tag}
              </Badge>
            ))}
            {task.dueDate && (
              <span className="text-[10px] flex items-center text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            <span className="text-[10px] font-bold text-primary ml-auto">
              +{task.points} XP
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
