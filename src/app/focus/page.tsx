"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";

const FOCUS_DURATION = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60;

export default function FocusVoid() {
    const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState<"focus" | "break">("focus");
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [showComplete, setShowComplete] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const saveProgress = useCallback(async (minutes: number) => {
        await fetch("/api/user", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ addFocusMinutes: minutes }),
        });
    }, []);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((t) => t - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleComplete();
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, timeLeft]);

    const handleComplete = async () => {
        setIsRunning(false);
        if (mode === "focus") {
            setSessionsCompleted((s) => s + 1);
            await saveProgress(25);
            setShowComplete(true);
            setTimeout(() => setShowComplete(false), 3000);
            setMode("break");
            setTimeLeft(SHORT_BREAK);
        } else {
            setMode("focus");
            setTimeLeft(FOCUS_DURATION);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = mode === "focus"
        ? (FOCUS_DURATION - timeLeft) / FOCUS_DURATION
        : (SHORT_BREAK - timeLeft) / SHORT_BREAK;

    const reset = () => {
        setIsRunning(false);
        setTimeLeft(mode === "focus" ? FOCUS_DURATION : SHORT_BREAK);
    };

    return (
        <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0">
                {/* Gradient orbs */}
                <motion.div
                    className="absolute w-96 h-96 rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
                        top: "20%",
                        left: "10%",
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute w-80 h-80 rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
                        bottom: "10%",
                        right: "15%",
                    }}
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            {/* Back button */}
            <Link
                href="/"
                className="absolute top-6 left-6 text-[var(--text-secondary)] hover:text-white transition-colors flex items-center gap-2 z-10"
            >
                <ArrowLeft size={20} />
                <span>Exit Void</span>
            </Link>

            {/* Sessions counter */}
            <div className="absolute top-6 right-6 text-sm text-[var(--text-secondary)] z-10">
                Sessions: {sessionsCompleted}
            </div>

            {/* Main Timer */}
            <div className="relative z-10 flex flex-col items-center">
                <motion.p
                    className="text-sm uppercase tracking-widest mb-4"
                    style={{ color: mode === "focus" ? "#7c3aed" : "#06b6d4" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {mode === "focus" ? "Deep Focus" : "Rest & Recharge"}
                </motion.p>

                {/* Circular Progress */}
                <div className="relative w-72 h-72 flex items-center justify-center">
                    <svg className="absolute w-full h-full -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="144"
                            cy="144"
                            r="130"
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="8"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="144"
                            cy="144"
                            r="130"
                            fill="none"
                            stroke={mode === "focus" ? "#7c3aed" : "#06b6d4"}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 130}
                            strokeDashoffset={2 * Math.PI * 130 * (1 - progress)}
                            style={{
                                filter: `drop-shadow(0 0 10px ${mode === "focus" ? "#7c3aed" : "#06b6d4"})`,
                            }}
                        />
                    </svg>

                    {/* Time display */}
                    <motion.div
                        className="text-6xl font-mono font-light tracking-wider"
                        animate={isRunning ? {} : { opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        {formatTime(timeLeft)}
                    </motion.div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 mt-10">
                    <NeonButton variant="ghost" onClick={reset} className="p-4">
                        <RotateCcw size={24} />
                    </NeonButton>

                    <motion.button
                        className={`w-20 h-20 rounded-full flex items-center justify-center ${isRunning
                                ? "bg-[var(--accent-secondary)]"
                                : "bg-[var(--accent-primary)]"
                            }`}
                        style={{
                            boxShadow: `0 0 30px ${isRunning ? "#06b6d4" : "#7c3aed"}80`,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsRunning(!isRunning)}
                    >
                        {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                    </motion.button>

                    <NeonButton
                        variant="ghost"
                        onClick={handleComplete}
                        className="p-4"
                        disabled={!isRunning}
                    >
                        <CheckCircle size={24} />
                    </NeonButton>
                </div>

                {/* Breathing guide */}
                {isRunning && (
                    <motion.div
                        className="mt-10 text-[var(--text-dim)] text-sm"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        Breathe...
                    </motion.div>
                )}
            </div>

            {/* Completion notification */}
            <AnimatePresence>
                {showComplete && (
                    <motion.div
                        className="fixed top-10 left-1/2 -translate-x-1/2 glass-glow px-6 py-3 rounded-xl flex items-center gap-3 z-50"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <CheckCircle className="text-green-400" size={20} />
                        <span>+25 Focus Minutes! XP Gained!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
