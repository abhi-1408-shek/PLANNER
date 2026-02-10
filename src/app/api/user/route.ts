import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get or create user in database
        let dbUser = await prisma.user.findUnique({
            where: { supabaseId: user.id },
        });

        if (!dbUser) {
            // Create user if doesn't exist
            dbUser = await prisma.user.create({
                data: {
                    supabaseId: user.id,
                    email: user.email || "",
                    name: user.user_metadata?.name || user.email?.split('@')[0] || "Explorer",
                },
            });
        }

        return NextResponse.json({ user: dbUser });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Get user from database
        let dbUser = await prisma.user.findUnique({
            where: { supabaseId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Special handling for focus minutes
        if (body.addFocusMinutes) {
            const minutes = body.addFocusMinutes;
            const bonusXp = Math.floor(minutes / 25) * 10;

            let newXp = dbUser.xp + bonusXp;
            let newLevel = dbUser.level;
            let newXpToNextLevel = dbUser.xpToNextLevel;

            // Level up logic
            while (newXp >= newXpToNextLevel) {
                newXp -= newXpToNextLevel;
                newLevel += 1;
                newXpToNextLevel = Math.floor(newXpToNextLevel * 1.5);
            }

            dbUser = await prisma.user.update({
                where: { supabaseId: user.id },
                data: {
                    totalFocusMinutes: dbUser.totalFocusMinutes + minutes,
                    xp: newXp,
                    level: newLevel,
                    xpToNextLevel: newXpToNextLevel,
                },
            });
        } else {
            // Regular update
            dbUser = await prisma.user.update({
                where: { supabaseId: user.id },
                data: body,
            });
        }

        return NextResponse.json({ user: dbUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
