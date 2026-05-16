import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createClient();

    // Insert into Supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await supabase
      .from("subscribers")
      .insert([{ email }] as any);

    if (dbError) {
      if (dbError.code === "23505") { // unique violation
        return NextResponse.json({ error: "You are already subscribed." }, { status: 400 });
      }
      return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
    }

    // Send Welcome Email
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Trivo Kenya <hello@trivokenya.store>", // Ensure this domain is verified in Resend
        to: email,
        subject: "Welcome to Trivo Kenya 🔥",
        html: `
          <div style="font-family: sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px 20px; text-align: center;">
            <h1 style="color: #25D366; margin-bottom: 20px;">Welcome to Trivo Kenya</h1>
            <p style="font-size: 16px; color: #cccccc; line-height: 1.5; max-width: 500px; margin: 0 auto;">
              You're in. We'll hit you first when premium tech drops. Stay tuned.
            </p>
            <div style="margin-top: 40px; border-top: 1px solid #333333; padding-top: 20px; font-size: 12px; color: #666666;">
              — Trivo Kenya Team
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
