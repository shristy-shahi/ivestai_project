import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "Investra — AI Investment Research",
  description: "Institutional-grade AI investment analysis. Enter any public company and receive a comprehensive INVEST or PASS recommendation powered by a 7-agent LangGraph pipeline in under 60 seconds.",
  keywords: ["AI investment research", "stock analysis", "LangGraph", "financial AI", "investment recommendation"],
  authors: [{ name: "Investra" }],
  openGraph: {
    title: "Investra — AI Investment Research",
    description: "Institutional-grade AI analysis for any public company in under 60 seconds.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
