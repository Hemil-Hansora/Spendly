import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// export async function POST(req: Request) {
//   const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
//   if (!WEBHOOK_SECRET) {
//     throw new Error("Missing CLERK_WEBHOOK_SECRET in env");
//   }

//   const headerPayload = await headers();
//   const svix_id = headerPayload.get("svix-id");
//   const svix_timestamp = headerPayload.get("svix-timestamp");
//   const svix_signature = headerPayload.get("svix-signature");

//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
//   }

//   const body = await req.text(); // RAW body
//   const wh = new Webhook(WEBHOOK_SECRET);

//   let evt: WebhookEvent;
//   try {
//     evt = wh.verify(body, {
//       "svix-id": svix_id,
//       "svix-timestamp": svix_timestamp,
//       "svix-signature": svix_signature,
//     }) as WebhookEvent;
//   } catch (err) {
//     console.error("❌ Webhook verification failed:", err);
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//   }

//   const eventType = evt.type;
//   console.log("📩 Webhook event:", eventType);

//   if (eventType === "user.created") {
//     const { id, email_addresses, first_name, last_name, username } = evt.data;
//     const email = email_addresses[0]?.email_address;

//     if (!email) {
//       return NextResponse.json({ error: "Missing email" }, { status: 400 });
//     }

//     try {
//       await db.user.create({
//         data: {
//           clerkId: id,
//           email,
//           username: username || email.split("@")[0],
//           name: `${first_name || ""} ${last_name || ""}`.trim() || email,
//         },
//       });
//       console.log("✅ User created:", id);
//       return NextResponse.json({ message: "User created" }, { status: 201 });
//     } catch (dbErr) {
//       console.error("❌ DB Insert failed:", dbErr);
//       return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
//     }
//   }

//   return new NextResponse("Webhook received", { status: 200 });
// }

export async function POST(req: Request) {
  return NextResponse.json({ ok: true });
}