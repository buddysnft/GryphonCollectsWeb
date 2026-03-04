import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Shop",
  description: "Browse our collection of premium soccer cards, boxes, cases, and slabs. Authentic products, fair prices, and fast shipping.",
  path: "/shop",
});
