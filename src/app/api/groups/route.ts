import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

async function generateUniqueInviteCode(): Promise<string> {
  let inviteCode: string;
  let isUnique = false;

  while (!isUnique) {
    inviteCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const existingGroup = await db.group.findUnique({
      where: { inviteCode },
    });

    if (!existingGroup) {
      isUnique = true;
    }
  }
  return inviteCode!;
}


export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { name, icon } = await req.json();

    if (!name && !icon) {
      return NextResponse.json(
        {
          error: "Name is Required",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const inviteCode = await generateUniqueInviteCode();

    const group = db.group.create({
      data: {
        name,
        icon,
        inviteCode,
        members: {
          create: [
            {
              userId: userId,
              role: "ADMIN",
            },
          ],
        },
      },
      include: {
        members: true,
      },
    });

    if (!group) {
      return NextResponse.json(
        {
          success: false,
          error: "Can not created group ",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Group created successfully",
        group,
        success: true,
      },
      {
        status: 200,
        statusText: "Group created successfully",
      }
    );
  } catch (error) {
    console.error("[GROUPS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
