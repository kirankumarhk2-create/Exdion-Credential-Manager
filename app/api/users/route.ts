import { NextResponse } from "next/server";
import { getAllUsers, getAllUsernames } from "@/app/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get("format");

    // Fetch usernames only if format=usernames
    if (format === "usernames") {
      const usernames = await getAllUsernames();
      return NextResponse.json(
        {
          success: true,
          data: usernames,
          count: usernames.length,
        },
        { status: 200 }
      );
    }

    // Fetch all user details
    const users = await getAllUsers();
    return NextResponse.json(
      {
        success: true,
        data: users,
        count: users.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in users API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}
