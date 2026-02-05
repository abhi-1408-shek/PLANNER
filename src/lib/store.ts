import fs from "fs";
import path from "path";

export interface Task {
    id: string;
    title: string;
    description?: string;
    difficulty: "easy" | "medium" | "hard" | "epic";
    category: "work" | "health" | "learning" | "personal";
    completed: boolean;
    createdAt: string;
    completedAt?: string;
}

export interface User {
    name: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
    energy: number; // 0-100
    totalFocusMinutes: number;
    streak: number;
}

export interface StoreData {
    user: User;
    tasks: Task[];
}

const STORE_PATH = path.join(process.cwd(), "src/data/store.json");

function readStore(): StoreData {
    try {
        const data = fs.readFileSync(STORE_PATH, "utf-8");
        return JSON.parse(data);
    } catch {
        // Return default if file doesn't exist
        const defaultData: StoreData = {
            user: {
                name: "Explorer",
                level: 1,
                xp: 0,
                xpToNextLevel: 100,
                energy: 75,
                totalFocusMinutes: 0,
                streak: 0,
            },
            tasks: [],
        };
        writeStore(defaultData);
        return defaultData;
    }
}

function writeStore(data: StoreData): void {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// Task operations
export function getAllTasks(): Task[] {
    return readStore().tasks;
}

export function getTask(id: string): Task | undefined {
    return readStore().tasks.find((t) => t.id === id);
}

export function createTask(task: Omit<Task, "id" | "createdAt" | "completed">): Task {
    const store = readStore();
    const newTask: Task = {
        ...task,
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        completed: false,
        createdAt: new Date().toISOString(),
    };
    store.tasks.push(newTask);
    writeStore(store);
    return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
    const store = readStore();
    const index = store.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    store.tasks[index] = { ...store.tasks[index], ...updates };

    // If task is being completed, add XP
    if (updates.completed && !store.tasks[index].completedAt) {
        store.tasks[index].completedAt = new Date().toISOString();
        const xpReward = getXpForDifficulty(store.tasks[index].difficulty);
        addXp(store, xpReward);
    }

    writeStore(store);
    return store.tasks[index];
}

export function deleteTask(id: string): boolean {
    const store = readStore();
    const index = store.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    store.tasks.splice(index, 1);
    writeStore(store);
    return true;
}

// User operations
export function getUser(): User {
    return readStore().user;
}

export function updateUser(updates: Partial<User>): User {
    const store = readStore();
    store.user = { ...store.user, ...updates };
    writeStore(store);
    return store.user;
}

export function addFocusMinutes(minutes: number): User {
    const store = readStore();
    store.user.totalFocusMinutes += minutes;
    // Every 25 minutes of focus = bonus XP
    const bonusXp = Math.floor(minutes / 25) * 10;
    if (bonusXp > 0) {
        addXp(store, bonusXp);
    }
    writeStore(store);
    return store.user;
}

// Helpers
function getXpForDifficulty(difficulty: Task["difficulty"]): number {
    const xpMap = { easy: 10, medium: 25, hard: 50, epic: 100 };
    return xpMap[difficulty] || 10;
}

function addXp(store: StoreData, amount: number): void {
    store.user.xp += amount;
    while (store.user.xp >= store.user.xpToNextLevel) {
        store.user.xp -= store.user.xpToNextLevel;
        store.user.level += 1;
        store.user.xpToNextLevel = Math.floor(store.user.xpToNextLevel * 1.5);
    }
}
