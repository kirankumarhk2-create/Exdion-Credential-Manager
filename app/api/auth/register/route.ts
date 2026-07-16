import { NextResponse } from "next/server";
import { getUserByUsername, createUser } from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, name, email } = body;

    if (!username || !password || !name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required: username, password, name, email",
        },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await getUserByUsername(username.trim());
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "That username is already in use",
        },
        { status: 409 }
      );
    }

    // Create new user with pending status
    const newUser = await createUser(
      username.trim(),
      password,
      email.trim(),
      name.trim(),
      "user",
      "pending"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Your access request was submitted. An admin can approve it from the dashboard.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to register user",
      },
      { status: 500 }
    );
  }
}
