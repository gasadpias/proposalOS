import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createProjectSchema } from "@/types/project";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS already scopes to the owner; the filter is belt-and-suspenders.
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects: data });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const v = parsed.data;
  const toNull = (s?: string) => (s && s.trim() !== "" ? s.trim() : null);

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: v.name.trim(),
      client_name: toNull(v.client_name),
      industry: toNull(v.industry),
      country: toNull(v.country),
      proposal_type: toNull(v.proposal_type),
      submission_deadline: toNull(v.submission_deadline),
      notes: toNull(v.notes),
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data }, { status: 201 });
}
