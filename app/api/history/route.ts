import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  if (url.includes("your_") || key.includes("your_")) return false;
  return true;
}

// ─── POST /api/history ─────────────────────────────────────────────────────
// Called after a research run completes.
// Body: { userId, company, ticker, recommendation, score, analysis }
// userId = Firebase UID (null/undefined if user not signed in → report saved anonymously)
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, message: "Supabase not configured" }, { status: 200 });
  }

  try {
    const body = await req.json();
    const { userId, company, ticker, recommendation, score, analysis } = body;

    const db = supabaseAdmin();

    // 1. Sync Firebase user to Supabase users table (upsert)
    if (userId) {
      await db.from("users").upsert(
        {
          id:           userId,
          email:        analysis?.userEmail ?? null,
          display_name: analysis?.userName  ?? null,
          photo_url:    analysis?.userPhoto ?? null,
        },
        { onConflict: "id", ignoreDuplicates: false }
      );
    }

    // 2. Upsert company (deduplicated by ticker)
    const { data: companyRow } = await db
      .from("companies")
      .upsert(
        {
          name:     company,
          ticker,
          sector:   analysis?.companyData?.sector   ?? "",
          industry: analysis?.companyData?.industry ?? "",
        },
        { onConflict: "ticker" }
      )
      .select()
      .single();

    // 3. Insert the report (linked to Firebase UID)
    const { data: report, error } = await db
      .from("reports")
      .insert({
        user_id:        userId ?? null,   // Firebase UID or null if anonymous
        company_id:     companyRow?.id,
        ticker,
        company_name:   company,
        recommendation,
        score,
        analysis,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, reportId: report.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── GET /api/history ──────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json([]);
  }

  try {
    const db = supabaseAdmin();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let query = db
      .from("reports")
      .select("id, company_name, ticker, recommendation, score, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    // Filter by Firebase UID when provided
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    // If the column doesn't exist yet (schema migration not run), fall back to all reports
    if (error) {
      if (error.message?.includes("user_id") || error.code === "42703") {
        // Column missing — return all reports without filtering
        const { data: fallback, error: fallbackErr } = await db
          .from("reports")
          .select("id, company_name, ticker, recommendation, score, created_at")
          .order("created_at", { ascending: false })
          .limit(50);
        if (fallbackErr) throw fallbackErr;
        return NextResponse.json(fallback ?? []);
      }
      throw error;
    }

    return NextResponse.json(data ?? []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
