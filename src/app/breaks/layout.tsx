import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Breaks",
  description: "Join our live soccer card breaks on YouTube, Instagram, and Whatnot. Fair breaks, authentic products, and great community.",
  path: "/breaks",
});

export default function BreaksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
