import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/poesie")({
  beforeLoad: () => {
    throw redirect({ to: "/scritti" });
  },
});
