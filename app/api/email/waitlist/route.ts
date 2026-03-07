import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, name } = await req.json();

  // Catch missing env var early
  if (!process.env.BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not set");
    return NextResponse.json({ success: false, error: "Email service not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
    sender: { name: "Rayo AI", email: process.env.EMAIL_FROM!},
    to: [{ email, name }],
    subject: "Welcome to Rayo 💖",
    htmlContent: `
    <div style="font-family: Inter, Arial, sans-serif; background:#f5f7fb; padding:40px 20px;">
      
      <div style="max-width:520px;margin:auto;background:white;border-radius:12px;padding:40px 32px;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

        <h1 style="font-size:24px;margin-bottom:16px;color:#111;">
          Welcome to Rayo, ${name}! 💖
        </h1>

        <p style="font-size:16px;color:#444;line-height:1.6;">
          You're officially on the <strong>Rayo waitlist</strong>.
        </p>

        <p style="font-size:16px;color:#444;line-height:1.6;">
          We're building an AI workspace designed to help you think, create, and ship faster.
        </p>

        <div style="margin:28px 0;padding:16px;background:#f1f5ff;border-radius:8px;">
          <p style="margin:0;font-size:15px;color:#333;">
            ✨ Early access is opening soon. We'll notify you as soon as your invite is ready.
          </p>
        </div>

        <p style="font-size:15px;color:#555;">
          In the meantime, keep an eye on your inbox for updates.
        </p>

        <p style="margin-top:32px;font-size:14px;color:#777;">
          — The Rayo Team
        </p>

      </div>

    </div>
    `,
  })
  });

  if (!res.ok) {
    // Safely read response — Brevo sometimes returns plain text on auth errors
    const text = await res.text();
    console.error("Brevo error:", res.status, text);
    return NextResponse.json({ success: false, error: text }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}