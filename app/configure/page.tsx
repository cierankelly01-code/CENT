import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ConfigureClient from "@/components/ConfigureClient";

export const metadata: Metadata = {
  title: "Configure your Centaur",
  description:
    "Tell us about you and how you'll use the Centaur, and our team will spec the right chair with you and arrange a test drive.",
};

export default function ConfigurePage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="Configure"
        title="Let's spec your Centaur."
        intro="A few quick questions so our team can tailor the right chair for you — and arrange a test drive. No payment, no commitment."
      />
      <ConfigureClient />
    </main>
  );
}
