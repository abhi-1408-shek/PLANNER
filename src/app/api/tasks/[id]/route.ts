import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Get user from database
        const dbUser = await prisma.user.findUnique({
            where: { supabaseId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const task = await prisma.task.findFirst({
            where: {
                id,
                userId: dbUser.id,
            },
        });

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ task });
    } catch (error) {
        console.error("Error fetching task:", error);
        return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Get user from database
        const dbUser = await prisma.user.findUnique({
            where: { supabaseId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find the task
        const existingTask = await prisma.task.findFirst({
            where: {
                id,
                userId: dbUser.id,
            },
        });

        if (!existingTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        // If task is being completed, add XP
        let updatedUser = dbUser;
        if (body.completed && !existingTask.completed) {
            const xpMap = { easy: 10, medium: 25, hard: 50, epic: 100 };
            const xpReward = xpMap[existingTask.difficulty as keyof typeof xpMap] || 10;

            let newXp = dbUser.xp + xpReward;
            let newLevel = dbUser.level;
            let newXpToNextLevel = dbUser.xpToNextLevel;

            // Level up logic
            while (newXp >= newXpToNextLevel) {
                newXp -= newXpToNextLevel;
                newLevel += 1;
                newXpToNextLevel = Math.floor(newXpToNextLevel * 1.5);
            }

            updatedUser = await prisma.user.update({
                where: { supabaseId: user.id },
                data: {
                    xp: newXp,
                    level: newLevel,
                    xpToNextLevel: newXpToNextLevel,
                },
            });
        }

        // Update the task
        const task = await prisma.task.update({
            where: { id },
            data: {
                ...body,
                completedAt: body.completed && !existingTask.completed ? new Date() : body.completed ? existingTask.completedAt : null,
            },
        });

        return NextResponse.json({ task });
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Get user from database
        const dbUser = await prisma.user.findUnique({
            where: { supabaseId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find and delete the task
        const task = await prisma.task.findFirst({
            where: {
                id,
                userId: dbUser.id,
            },
        });

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        await prisma.task.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
