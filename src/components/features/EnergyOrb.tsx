"use client";

import { motion } from "framer-motion";

interface EnergyOrbProps {
    level: number; // 0-100
    size?: "sm" | "md" | "lg";
}

export function EnergyOrb({ level, size = "md" }: EnergyOrbProps) {
    const getColor = (lvl: number) => {
        if (lvl >= 70) return { primary: "#22c55e", secondary: "#4ade80" }; // Green
        if (lvl >= 40) return { primary: "#eab308", secondary: "#facc15" }; // Yellow
        return { primary: "#ef4444", secondary: "#f87171" }; // Red
    };

    const colors = getColor(level);
    const sizes = {
        sm: { container: 80, inner: 60 },
        md: { container: 140, inner: 100 },
        lg: { container: 200, inner: 150 },
    };

    const { container, inner } = sizes[size];

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: container, height: container }}
        >
            {/* Outer glow ring */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: container,
                    height: container,
                    background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Inner orb */}
            <motion.div
                className="relative rounded-full flex items-center justify-center"
                style={{
                    width: inner,
                    height: inner,
                    background: `radial-gradient(circle at 30% 30%, ${colors.secondary}, ${colors.primary})`,
                    boxShadow: `0 0 40px ${colors.primary}80, 0 0 80px ${colors.primary}40, inset 0 0 30px ${colors.secondary}60`,
                }}
                animate={{
                    scale: [1, 1.03, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <span className="text-2xl font-bold text-white drop-shadow-lg">
                    {level}%
                </span>
            </motion.div>

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ background: colors.primary }}
                    initial={{
                        x: Math.cos((i * 60 * Math.PI) / 180) * (container / 2.5),
                        y: Math.sin((i * 60 * Math.PI) / 180) * (container / 2.5),
                    }}
                    animate={{
                        x: [
                            Math.cos((i * 60 * Math.PI) / 180) * (container / 2.5),
                            Math.cos(((i * 60 + 30) * Math.PI) / 180) * (container / 2.2),
                            Math.cos((i * 60 * Math.PI) / 180) * (container / 2.5),
                        ],
                        y: [
                            Math.sin((i * 60 * Math.PI) / 180) * (container / 2.5),
                            Math.sin(((i * 60 + 30) * Math.PI) / 180) * (container / 2.2),
                            Math.sin((i * 60 * Math.PI) / 180) * (container / 2.5),
                        ],
                        opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3,
                    }}
                />
            ))}
        </div>
    );
}
