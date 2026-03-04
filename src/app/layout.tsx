import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import SkipLink from "@/components/SkipLink";
import { brandConfig } from "@/config/brand";
import { generateMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = generateMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <GoogleAnalytics measurementId={brandConfig.googleAnalytics.measurementId} />
        <SkipLink />
        <AuthProvider>
          <Navbar />
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
