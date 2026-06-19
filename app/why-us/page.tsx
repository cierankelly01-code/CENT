import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Credibility from "@/components/sections/Credibility";
import Engineering from "@/components/Engineering";
import PressStrip from "@/components/PressStrip";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Why us — Centaur Robotics",
  description:
    "Designed by an ex-Ford team, in production now, engineered to automotive standards.",
};

export default function WhyUsPage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="Why us"
        title="Made by people who build things worth wanting."
        intro="An automotive design and engineering team applying car-industry standards to personal mobility."
      />
      <Credibility />
      <Engineering />
      <PressStrip />
      <CtaBand />
    </main>
  );
}
