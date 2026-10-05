import { createFileRoute } from "@tanstack/react-router";
import { EncoreEnginePage } from "./encore-engine";

export const Route = createFileRoute("/encore_engine")({
  head: () => ({
    meta: [
      { title: "Encore Engine — Powered by Circular Intelligence | Encorb" },
    ],
  }),
  component: EncoreEnginePage,
});
