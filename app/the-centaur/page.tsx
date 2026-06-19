import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProductExplorer from "@/components/sections/ProductExplorer";
import Features from "@/components/sections/Features";
import Specs from "@/components/Specs";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "The Centaur — self-balancing wheelchair",
  description:
    "Self-balancing on two wheels, rises to eye level, fits standard doorways, drops to the table. Engineered to automotive standards.",
};

export default function TheCentaurPage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="The Centaur"
        title="A wheelchair engineered like a car."
        intro="Self-balancing on two wheels. Eye-level at 820mm. Through any doorway at 470mm. Built to automotive standards, fail-safe by design."
      />
      <ProductExplorer />
      <Features />
      <Specs />
      <CtaBand />
    </main>
  );
}
