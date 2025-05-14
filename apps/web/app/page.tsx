import type { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import Header from '@/components/Header';

// Page-specific metadata from your landing page (can be refined)
export const metadata: Metadata = {
  title: "Airodental | Revolutionizing Dental Practices with AI",
  description: "Enhance efficiency, streamline patient communication, and empower your dental team with Airodental's AI-powered solutions.",
};

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
    </>
  );
}
