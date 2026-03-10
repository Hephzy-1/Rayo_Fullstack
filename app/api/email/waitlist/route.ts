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
    sender: { name: "Rayo AI", email: process.env.EMAIL_FROM! },
    to: [{ email, name }],
    subject: "You're on the Rayo waitlist 🚀",
    htmlContent: `
    <div style="font-family: Inter, Arial, sans-serif; background:#f5f7fb; padding:40px 20px;">
      
      <div style="max-width:520px;margin:auto;background:white;border-radius:12px;padding:40px 32px;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

        <h1 style="font-size:24px;margin-bottom:16px;color:#111;">
          Welcome to Rayo, ${name}! 🚀
        </h1>

        <p style="font-size:16px;color:#444;line-height:1.6;">
          You're officially on the <strong>Rayo early access list</strong>.
        </p>

        <p style="font-size:16px;color:#444;line-height:1.6;">
          We're building <strong>your AI financial copilot</strong> — a smarter way to see and manage your money in one place.
        </p>

        <div style="margin:28px 0;padding:16px;background:#f1f5ff;border-radius:8px;">
          <p style="margin:0;font-size:15px;color:#333;">
            With Rayo you'll be able to:
          </p>
          <ul style="margin-top:10px;color:#333;font-size:15px;line-height:1.6;padding-left:18px;">
            <li>📊 Track all your investments in one dashboard</li>
            <li>💡 Get AI insights about your finances</li>
            <li>📈 Understand where your money is growing</li>
            <li>🧠 Make smarter financial decisions</li>
          </ul>
        </div>

        <p style="font-size:16px;color:#444;line-height:1.6;">
          We're opening access in small waves to make sure the experience is perfect.
        </p>

        <p style="font-size:16px;color:#444;line-height:1.6;">
          When your spot opens, you'll be one of the first people to try Rayo.
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