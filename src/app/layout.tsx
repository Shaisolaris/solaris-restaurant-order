import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solaris Kitchen — Order Online",
  description:
    "Order from Solaris Kitchen. Hot, fast, delivered. Menu, cart, and checkout — no app download required.",
  openGraph: {
    title: "Solaris Kitchen — Order Online",
    description: "Modern online ordering for independent restaurants.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-stone-50 font-sans text-stone-900 antialiased transition-colors dark:bg-stone-950 dark:text-stone-100">
        {children}
      </body>
    </html>
  );
}
