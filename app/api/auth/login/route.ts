import { NextResponse } from "next/server";
import { getUserByUsername } from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Username and password are required",
        },
        { status: 400 }
      );
    }

    // Fetch user from database
    const user = await getUserByUsername(username.trim());

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    // Check status
    if (user.status === "pending") {
      return NextResponse.json(
        {
          success: false,
          error: "Your access request is still pending admin approval",
        },
        { status: 403 }
      );
    }

    // Authentication successful
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      },
      { status: 500 }
    );
  }
}
