import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rayo AI — Your AI Financial Copilot",
  description:
    "Budget smarter. Save automatically. Invest confidently. Rayo connects to your accounts and uses AI to find money you didn't know you had.",
  keywords: ["fintech", "AI finance", "budgeting", "savings", "Nigeria", "Gen Z"],
  authors: [{ name: "Rayo Financial Inc." }],
  openGraph: {
    title: "Rayo AI — Your AI Financial Copilot",
    description: "AI-powered personal finance for the next generation of Nigerians.",
    type: "website",
    locale: "en_NG",
  },
  themeColor: "#254F22",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-rayo-beige antialiased">
        {children}
      </body>
    </html>
  );
}
