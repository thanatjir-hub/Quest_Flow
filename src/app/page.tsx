"use client";

import { useState, useEffect } from "react";
import { Task, UserStats, Priority } from "@/lib/types";
import { GameProgress } from "@/components/game-progress";
import { TaskCard } from "@/components/task-card";
import { AchievementList } from "@/components/achievement-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutDashboard, 
  Sparkles,
  Award as AwardIcon,
  Settings,
  Sword,
  Wand2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aiEpicNaming } from "@/ai/flows/ai-epic-naming";
import { cn } from "@/lib/utils";

const INITIAL_ACHIEVEMENTS = [
  { id: '1', name: 'เควสต์แรก', description: 'ทำเควสต์แรกของคุณให้สำเร็จ', icon: 'Star' },
  { id: '2', name: 'นักสำรวจ', description: 'สร้างเควสต์ทั้งหมด 10 เควสต์', icon: 'Compass' },
  { id: '3', name: 'นักรบ', description: 'ทำเควสต์ระดับความสำคัญสูงสำเร็จ 5 เควสต์', icon: 'Shield' },
  { id: '4', name: 'ตำนาน', description: 'บรรลุถึงเลเวล 5', icon: 'Award' },
  { id: '5', name: 'จ้าวความเร็ว', description: 'ทำเควสต์ให้สำเร็จภายใน 1 ชั่วโมง', icon: 'Zap' },
  { id: '6', name: 'กำลังร้อนแรง', description: 'ทำเควสต์ให้สำเร็จ 5 เควสต์ในวันเดียว', icon: 'Flame' },
];

export default function QuestFlowDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    totalQuestsCompleted: 0,
    achievements: INITIAL_ACHIEVEMENTS,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEpicNaming, setIsEpicNaming] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    tags: "",
  });
  
  const { toast } = useToast();

  // Load from local storage
  useEffect(() => {
    const savedTasks = localStorage.getItem("questflow_tasks");
    const savedStats = localStorage.getItem("questflow_stats");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("questflow_tasks", JSON.stringify(tasks));
    localStorage.setItem("questflow_stats", JSON.stringify(stats));
  }, [tasks, stats]);

  const addTask = () => {
    if (!newTask.title) return;
    
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      description: newTask.description,
      isCompleted: false,
      priority: newTask.priority,
      tags: newTask.tags.split(",").map(t => t.trim()).filter(Boolean),
      points: newTask.priority === 'high' ? 250 : newTask.priority === 'medium' ? 150 : 100,
      createdAt: Date.now(),
    };

    setTasks([task, ...tasks]);
    setNewTask({ title: "", description: "", priority: "medium", tags: "" });
    setIsAddingTask(false);
    
    if (tasks.length + 1 >= 10 && !stats.achievements.find(a => a.id === '2')?.unlockedAt) {
      unlockAchievement('2');
    }

    toast({
      title: "รับเควสต์แล้ว!",
      description: "การผจญภัยครั้งใหม่รอคุณอยู่",
    });
  };

  const handleEpicNaming = async () => {
    if (!newTask.title) return;
    setIsEpicNaming(true);
    try {
      const result = await aiEpicNaming({ taskTitle: newTask.title });
      setNewTask(prev => ({ ...prev, title: result.epicTitle }));
      toast({
        title: "ร่ายมนต์สำเร็จ!",
        description: "ชื่อเควสต์ของคุณดูขลังขึ้นเยอะเลย",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "มานาหมด!",
        description: "ไม่สามารถเปลี่ยนชื่อได้ในขณะนี้",
      });
    } finally {
      setIsEpicNaming(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newState = !t.isCompleted;
        if (newState) {
          handleTaskCompletion(t);
        }
        return { ...t, isCompleted: newState };
      }
      return t;
    }));
  };

  const handleTaskCompletion = (task: Task) => {
    const newXP = stats.xp + task.points;
    const newTotalCompleted = stats.totalQuestsCompleted + 1;
    const newLevel = Math.floor(newXP / 1000) + 1;
    
    setStats(prev => ({
      ...prev,
      xp: newXP,
      totalQuestsCompleted: newTotalCompleted,
      level: newLevel,
    }));

    if (newLevel > stats.level) {
      toast({
        title: "เลเวลอัป!",
        description: `คุณบรรลุเลเวล ${newLevel} แล้ว! คุณกำลังจะกลายเป็นตำนาน`,
      });
    }

    if (newTotalCompleted === 1 && !stats.achievements[0].unlockedAt) {
      unlockAchievement('1');
    }
    if (task.priority === 'high') {
       const highCount = tasks.filter(t => t.isCompleted && t.priority === 'high').length + 1;
       if (highCount >= 5 && !stats.achievements[2].unlockedAt) unlockAchievement('3');
    }
  };

  const unlockAchievement = (id: string) => {
    setStats(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => 
        a.id === id ? { ...a, unlockedAt: Date.now() } : a
      )
    }));
    toast({
      title: "ปลดล็อกความสำเร็จ!",
      description: `คุณได้รับเหรียญตรา ${INITIAL_ACHIEVEMENTS.find(a => a.id === id)?.name} แล้ว!`,
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAIDecomposition = (id: string, subQuests: string[]) => {
    const parentTask = tasks.find(t => t.id === id);
    if (!parentTask) return;

    const newSubTasks: Task[] = subQuests.map((q, i) => ({
      id: crypto.randomUUID(),
      title: q,
      description: `ส่วนหนึ่งของ: ${parentTask.title}`,
      isCompleted: false,
      priority: parentTask.priority,
      tags: [...parentTask.tags, "AI-SubQuest"],
      points: 50,
      createdAt: Date.now() + i,
    }));

    setTasks(prev => [...newSubTasks, ...prev.filter(t => t.id !== id)]);
    toast({
      title: "แยกย่อยเควสต์ด้วย AI",
      description: `แยกย่อยเควสต์ "${parentTask.title}" ออกเป็น ${subQuests.length} เควสต์ย่อยเรียบร้อยแล้ว`,
    });
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeQuests = filteredTasks.filter(t => !t.isCompleted);
  const completedQuests = filteredTasks.filter(t => t.isCompleted);

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sword className="text-white h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black text-primary tracking-tighter">QuestFlow</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
              {stats.level}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Progress Section */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-border/50">
          <GameProgress 
            level={stats.level} 
            xp={stats.xp} 
            totalCompleted={stats.totalQuestsCompleted} 
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Quest Log */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold uppercase tracking-tight">บันทึกเควสต์</h2>
              </div>
              
              <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                <DialogTrigger asChild>
                  <Button className="rounded-full gap-2 shadow-lg shadow-primary/30 font-bold uppercase tracking-wider">
                    <Plus className="h-5 w-5" /> เควสต์ใหม่
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-primary">สร้างเควสต์ใหม่</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase text-muted-foreground">ชื่อเควสต์</label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-[10px] font-bold uppercase gap-1 text-primary hover:bg-primary/10"
                          onClick={handleEpicNaming}
                          disabled={!newTask.title || isEpicNaming}
                        >
                          <Wand2 className={cn("h-3 w-3", isEpicNaming && "animate-spin")} />
                          {isEpicNaming ? "กำลังเสก..." : "เสกชื่อให้น่าตื่นเต้น"}
                        </Button>
                      </div>
                      <Input 
                        placeholder="เช่น ล้างจาน, เขียนรายงาน" 
                        value={newTask.title}
                        onChange={e => setNewTask({...newTask, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">รายละเอียด (ไม่บังคับ)</label>
                      <Textarea 
                        placeholder="ข้อมูลเพิ่มเติมเกี่ยวกับการผจญภัยนี้..." 
                        value={newTask.description}
                        onChange={e => setNewTask({...newTask, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">ความสำคัญ</label>
                        <Select value={newTask.priority} onValueChange={(v: Priority) => setNewTask({...newTask, priority: v})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">ต่ำ (100 XP)</SelectItem>
                            <SelectItem value="medium">ปานกลาง (150 XP)</SelectItem>
                            <SelectItem value="high">สูง (250 XP)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">แท็ก (คั่นด้วยลูกน้ำ)</label>
                        <Input 
                          placeholder="ทำงาน, เรียน" 
                          value={newTask.tags}
                          onChange={e => setNewTask({...newTask, tags: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button onClick={addTask} className="w-full h-12 text-lg font-black uppercase shadow-lg shadow-primary/20">
                      เริ่มเควสต์
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="ค้นหาเควสต์ของคุณ..." 
                className="pl-10 rounded-2xl bg-white border-muted"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-2xl">
                <TabsTrigger value="active" className="rounded-xl font-bold uppercase text-xs">กำลังทำ ({activeQuests.length})</TabsTrigger>
                <TabsTrigger value="completed" className="rounded-xl font-bold uppercase text-xs">สำเร็จแล้ว ({completedQuests.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-3 mt-4">
                {activeQuests.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-muted flex flex-col items-center gap-4">
                    <Sparkles className="h-12 w-12 text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground font-bold italic">เส้นทางว่างเปล่า ได้เวลาค้นหาการผจญภัยครั้งใหม่แล้ว!</p>
                  </div>
                ) : (
                  activeQuests.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTask} 
                      onDelete={deleteTask}
                      onBreakdown={handleAIDecomposition}
                    />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-3 mt-4">
                {completedQuests.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onToggle={toggleTask} 
                    onDelete={deleteTask}
                    onBreakdown={handleAIDecomposition}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <AwardIcon className="h-5 w-5 text-secondary" />
                <h2 className="text-xl font-bold uppercase tracking-tight">หอเกียรติยศ</h2>
              </div>
              <AchievementList achievements={stats.achievements} />
            </section>

            <section className="bg-white rounded-3xl p-6 shadow-sm border border-border/50 space-y-4">
               <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">เคล็ดลับการพิชิตเควสต์</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "ใช้ปุ่มไม้กายสิทธิ์เสกชื่อเควสต์ธรรมดาให้กลายเป็นชื่อภารกิจที่น่าตื่นเต้นเพื่อเพิ่มพลังใจในการทำงาน!"
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground mb-1">
                  <span>ความคืบหน้าระดับตำนาน</span>
                  <span>{stats.totalQuestsCompleted}/50</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (stats.totalQuestsCompleted / 50) * 100)}%` }}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
