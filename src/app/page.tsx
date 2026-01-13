import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIESEC Malaysia Link Shortener | click.aiesec.my",
  description: "Official AIESEC Malaysia link shortening service. Create short, branded links for campaigns, events, and opportunities with comprehensive analytics tracking.",
};

export default function Home() {
  return (
    <main>
      <ScrollUp />
      <Hero />
    </main>
  );
}
