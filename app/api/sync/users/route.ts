import { NextResponse } from "next/server";
import { syncUsersFromDatabase } from "@/app/lib/userSync";

export async function POST(request: Request) {
  try {
    const syncedUsers = await syncUsersFromDatabase();

    return NextResponse.json(
      {
        success: true,
        message: `Successfully synced ${syncedUsers.length} users from database`,
        data: syncedUsers.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error syncing users:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to sync users",
      },
      { status: 500 }
    );
  }
}
