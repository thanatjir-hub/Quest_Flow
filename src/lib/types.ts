
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: Priority;
  tags: string[];
  points: number;
  createdAt: number;
  dueDate?: number;
}

export interface UserStats {
  level: number;
  xp: number;
  totalQuestsCompleted: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}
