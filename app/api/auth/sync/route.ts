import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

/**
 * POST /api/auth/sync
 *
 * Called by the client immediately after Firebase Google Sign-In succeeds.
 * Upserts the Firebase user into the Supabase `users` table so the user
 * row exists before any reports are created.
 *
 * Body: { uid, email, displayName, photoURL }
 */
export async function POST(req: NextRequest) {
  try {
    const { uid, email, displayName, photoURL } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "uid is required" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key || url.includes("your_") || key.includes("your_")) {
      // Supabase not configured — return success silently
      return NextResponse.json({ success: true });
    }

    const db = supabaseAdmin();
    const { error } = await db
      .from("users")
      .upsert(
        {
          id:           uid,
          email:        email        ?? null,
          display_name: displayName  ?? null,
          photo_url:    photoURL     ?? null,
        },
        { onConflict: "id" }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
