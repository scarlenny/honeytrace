import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { AppShell } from "@/components/shell/app-shell";
import "./globals.css";

// Body UI text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Headings, nav labels, logo, micro-labels
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// All data: IPs, hashes, commands, timestamps, raw logs
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Pages set a short title ("Attack Feed"); the template adds the product name.
  title: { default: "HoneyTrace", template: "%s · HoneyTrace" },
  description: "Honeypot attack classifier and threat-intelligence dashboard",
};

export const viewport: Viewport = {
  themeColor: "#070B14",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // "dark" lets any shadcn dark: variants apply; the app is dark-only.
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
