import { NextRequest, NextResponse } from "next/server";
import { getUser, updateUser, addFocusMinutes } from "@/lib/store";

export async function GET() {
    try {
        const user = getUser();
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        // Special handling for focus minutes
        if (body.addFocusMinutes) {
            const user = addFocusMinutes(body.addFocusMinutes);
            return NextResponse.json({ user });
        }

        const user = updateUser(body);
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
