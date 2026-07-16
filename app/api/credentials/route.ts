import { NextResponse } from "next/server";
import {
  getAllCredentials,
  getCredentialsByUserId,
  createCredential,
  updateCredential,
  deleteCredential,
} from "@/app/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (userId) {
      const credentials = await getCredentialsByUserId(parseInt(userId));
      return NextResponse.json(
        {
          success: true,
          data: credentials,
          count: credentials.length,
        },
        { status: 200 }
      );
    }

    const credentials = await getAllCredentials();
    return NextResponse.json(
      {
        success: true,
        data: credentials,
        count: credentials.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching credentials:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch credentials",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, email, password, description } = body;

    if (!userId || !name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: userId, name, email, password",
        },
        { status: 400 }
      );
    }

    const credential = await createCredential(userId, name, email, password, description || "");

    return NextResponse.json(
      {
        success: true,
        message: "Credential created successfully",
        data: credential,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating credential:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create credential",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, password, description } = body;

    if (!id || !name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: id, name, email, password",
        },
        { status: 400 }
      );
    }

    const credential = await updateCredential(id, name, email, password, description || "");

    return NextResponse.json(
      {
        success: true,
        message: "Credential updated successfully",
        data: credential,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating credential:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update credential",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: id",
        },
        { status: 400 }
      );
    }

    await deleteCredential(id);

    return NextResponse.json(
      {
        success: true,
        message: "Credential deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting credential:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete credential",
      },
      { status: 500 }
    );
  }
}
