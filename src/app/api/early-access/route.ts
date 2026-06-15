import { NextResponse } from "next/server"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Early-access capture stub. Validates the submitted email and returns 200.
// There is NO datastore yet — to actually collect addresses, wire this to a
// provider (Resend audience, a Vercel-marketplace DB, or a form service like
// Formspree) where the TODO is below.
export async function POST(request: Request) {
  let email = ""
  try {
    const body = await request.json()
    email = typeof body?.email === "string" ? body.email.trim() : ""
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 },
    )
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email address" },
      { status: 422 },
    )
  }

  // TODO: persist `email` with a real provider (Resend / DB / form service).
  console.log("[early-access] signup:", email)

  return NextResponse.json({ ok: true })
}
