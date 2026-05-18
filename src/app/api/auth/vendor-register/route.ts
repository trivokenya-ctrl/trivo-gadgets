import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, phone, businessName } = await req.json();

    if (!email || !password || !businessName) {
      return NextResponse.json({ error: "Email, password, and business name are required." }, { status: 400 });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { full_name: fullName, phone, business_name: businessName, role: "vendor" },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Insert into vendors table using service role
    const { error: vendorError } = await supabaseAdmin.from("vendors").insert({
      name: fullName || businessName,
      email,
      phone: phone || null,
      business_name: businessName,
      status: "active",
    });

    if (vendorError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: vendorError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Vendor account created. Check your email to confirm before signing in.",
      email,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
