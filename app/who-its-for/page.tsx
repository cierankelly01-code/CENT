import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import WhoItsFor from "@/components/sections/WhoItsFor";
import DayInTheLife from "@/components/DayInTheLife";
import OwningCentaur from "@/components/OwningCentaur";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Who it's for — Centaur Robotics",
  description:
    "Built for the home, and for the places people pass through — care homes, hospitals, airports and venues.",
};

export default function WhoItsForPage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="Who it's for"
        title="For your home, and the places you move through."
        intro="Built for people who can't comfortably walk more than around 400m unaided — but who get on with their day otherwise. Independence and dignity at home, and a better experience to offer for care homes, hospitals, airports and venues."
      />
      <WhoItsFor />
      <DayInTheLife />
      <OwningCentaur />
      <CtaBand />
    </main>
  );
}
