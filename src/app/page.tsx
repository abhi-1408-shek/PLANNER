"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  Plus,
  Target,
  Timer,
  Sparkles,
  CheckCircle2,
  Circle,
  Trash2,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { EnergyOrb } from "@/components/features/EnergyOrb";

interface Task {
  id: string;
  title: string;
  description?: string;
  difficulty: "easy" | "medium" | "hard" | "epic";
  category: "work" | "health" | "learning" | "personal";
  completed: boolean;
}

interface User {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  energy: number;
  totalFocusMinutes: number;
  streak: number;
}

const difficultyColors = {
  easy: "text-green-400 bg-green-400/10 border-green-400/30",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  hard: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  epic: "text-purple-400 bg-purple-400/10 border-purple-400/30",
};

const categoryIcons = {
  work: Target,
  health: Zap,
  learning: Sparkles,
  personal: Timer,
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    difficulty: "medium" as const,
    category: "work" as const,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [userRes, tasksRes] = await Promise.all([
      fetch("/api/user"),
      fetch("/api/tasks"),
    ]);
    const userData = await userRes.json();
    const tasksData = await tasksRes.json();
    setUser(userData.user);
    setTasks(tasksData.tasks || []);
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    setShowModal(false);
    setNewTask({ title: "", description: "", difficulty: "medium", category: "work" });
    fetchData();
  }

  async function toggleComplete(task: Task) {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchData();
  }

  async function deleteTask(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchData();
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getEnergyAdvice = (energy: number) => {
    if (energy >= 70) return "Your energy is high! Perfect time for challenging tasks.";
    if (energy >= 40) return "Steady energy. Focus on moderate tasks.";
    return "Low energy detected. Consider rest or light tasks.";
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-cosmic p-6 md:p-10">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-glow">
              QuantumPlanner
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              {getGreeting()}, {user.name}
            </p>
          </div>
          <Link href="/focus">
            <NeonButton variant="secondary" className="flex items-center gap-2">
              <Timer size={18} />
              Focus Void
            </NeonButton>
          </Link>
        </motion.div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Energy & Stats Panel */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard glow className="flex flex-col items-center py-8">
            <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Energy Core
            </h2>
            <EnergyOrb level={user.energy} size="lg" />
            <p className="mt-4 text-center text-sm text-[var(--text-secondary)] max-w-xs">
              {getEnergyAdvice(user.energy)}
            </p>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="text-[var(--accent-tertiary)]" size={20} />
              Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Level {user.level}</span>
                  <span className="text-[var(--text-secondary)]">
                    {user.xp} / {user.xpToNextLevel} XP
                  </span>
                </div>
                <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Focus Time</span>
                <span>{user.totalFocusMinutes} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Streak</span>
                <span>{user.streak} days</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Tasks Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Quests</h2>
            <NeonButton onClick={() => setShowModal(true)} className="flex items-center gap-2">
              <Plus size={18} />
              New Quest
            </NeonButton>
          </div>

          {pendingTasks.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Sparkles className="mx-auto mb-4 text-[var(--accent-primary)]" size={48} />
              <p className="text-[var(--text-secondary)]">
                No active quests. Add one to start your journey!
              </p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {pendingTasks.map((task) => {
                  const CategoryIcon = categoryIcons[task.category];
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <GlassCard className="flex items-center gap-4 py-4">
                        <button
                          onClick={() => toggleComplete(task)}
                          className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                        >
                          <Circle size={24} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium truncate">{task.title}</h3>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[task.difficulty]}`}
                            >
                              {task.difficulty}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-sm text-[var(--text-secondary)] truncate mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <CategoryIcon className="text-[var(--text-dim)]" size={20} />
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-[var(--text-dim)] hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-[var(--text-secondary)] mb-3">
                Completed ({completedTasks.length})
              </h3>
              <div className="space-y-2 opacity-60">
                {completedTasks.slice(0, 5).map((task) => (
                  <GlassCard key={task.id} className="flex items-center gap-4 py-3">
                    <CheckCircle2 className="text-green-400" size={20} />
                    <span className="line-through text-[var(--text-secondary)]">
                      {task.title}
                    </span>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="glass-glow rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">New Quest</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[var(--text-secondary)] hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">
                    Quest Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)]"
                    placeholder="What will you conquer?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)] resize-none"
                    rows={2}
                    placeholder="Add details..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">
                      Difficulty
                    </label>
                    <select
                      value={newTask.difficulty}
                      onChange={(e) =>
                        setNewTask({ ...newTask, difficulty: e.target.value as any })
                      }
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)]"
                    >
                      <option value="easy">Easy (+10 XP)</option>
                      <option value="medium">Medium (+25 XP)</option>
                      <option value="hard">Hard (+50 XP)</option>
                      <option value="epic">Epic (+100 XP)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">
                      Category
                    </label>
                    <select
                      value={newTask.category}
                      onChange={(e) =>
                        setNewTask({ ...newTask, category: e.target.value as any })
                      }
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)]"
                    >
                      <option value="work">Work</option>
                      <option value="health">Health</option>
                      <option value="learning">Learning</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                </div>
                <NeonButton type="submit" className="w-full mt-4">
                  Create Quest
                </NeonButton>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
