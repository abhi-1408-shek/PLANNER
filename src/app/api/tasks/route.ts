import { NextRequest, NextResponse } from "next/server";
import { getAllTasks, createTask, Task } from "@/lib/store";

export async function GET() {
    try {
        const tasks = getAllTasks();
        return NextResponse.json({ tasks });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, difficulty, category } = body;

        if (!title || !difficulty || !category) {
            return NextResponse.json(
                { error: "Title, difficulty, and category are required" },
                { status: 400 }
            );
        }

        const task = createTask({
            title,
            description: description || "",
            difficulty,
            category,
        });

        return NextResponse.json({ task }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}
