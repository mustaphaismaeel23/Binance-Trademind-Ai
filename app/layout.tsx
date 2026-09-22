import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BINANCE TRADEMIND AI",
  description: "Live Binance crypto market research and risk intelligence",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
