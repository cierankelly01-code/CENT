import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Story from "@/components/sections/Story";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Our Story — Centaur Robotics",
  description:
    "Two fathers, one refusal to accept what a wheelchair could be. The story behind the Centaur.",
};

export default function StoryPage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="Our story"
        title="It started at home."
        intro="The Centaur began with two families who refused to settle for what a wheelchair was supposed to be."
      />
      <Story />
      <CtaBand />
    </main>
  );
}
