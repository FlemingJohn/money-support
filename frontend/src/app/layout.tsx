import type { Metadata } from "next";
import { Figtree, JetBrains_Mono } from "next/font/google";
import "@/styles/theme.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Money Support Agent",
  description: "Dashboard for the Where is my money voice support agent",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${figtree.variable} ${jetBrainsMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
