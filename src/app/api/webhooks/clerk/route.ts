import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timeStamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  if (!svix_id || !svix_signature || !svix_timeStamp) {
    return NextResponse.json(
      {
        error: "Error occured -- no svix headers",
      },
      { status: 400 }
    );
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);


  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timeStamp,
    }) as WebhookEvent;

  console.log("Webhook user.created data:", JSON.stringify(evt.data, null, 2));

  } catch (error) {
    console.error("Error verifying webhook : ", error);
    return NextResponse.json(
      { error: `Varifying webhook ${error}` },
      { status: 400 }
    );
  }

  const eventType = evt.type

  if(eventType === "user.created"){
    const {id , email_addresses ,first_name,last_name } = evt.data
    const email = email_addresses[0]?.email_address;

    if(!email){
        return NextResponse.json({error : "Missing email address"},{status : 400})
    }

    try {
        await db.user.create({
            data : {
                clerkId : id,
                email : email,
                name : `${first_name || ""} ${last_name || ""}`.trim(),
            }
        })

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
    } catch (error) {
         console.error('Error creating user in database:', error);
         return NextResponse.json({error : `creating user in database ${error}`},{status: 500})
    }
  }
  return new NextResponse('', { status: 200 });
}
