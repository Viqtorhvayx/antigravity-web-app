import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "CREDO | Hedera DeFi",
  description: "Stability through Reputation. Developed by Viqtorhvayx.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
