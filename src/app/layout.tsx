import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Notely.ai",
  description: "AI pdf note taking app",
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
