import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Uses service role to bypass RLS — safe because this is server-side only
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, phone, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password, and role are required." }, { status: 400 });
    }

    // Create the Supabase auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // They'll confirm via email
      user_metadata: { full_name: fullName, phone, role },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Insert into admin_users table using service role (bypasses RLS)
    const { error: adminError } = await supabaseAdmin.from("admin_users").insert({
      email,
      role: role === "superadmin" ? "superadmin" : "admin",
    });

    if (adminError) {
      // Clean up auth user if admin insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: adminError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Admin account created. Check your email to confirm your account before signing in.",
      email,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
