import { createFileRoute } from "@tanstack/react-router";
import { HowItWorksPage } from "./how-it-works";

export const Route = createFileRoute("/how_it_works")({
  head: () => ({
    meta: [
      { title: "How Encorb Works — 5-Step Circular Commodity Process | Encorb" },
    ],
  }),
  component: HowItWorksPage,
});
