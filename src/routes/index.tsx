import Index from "@/pages/home/Index";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/")({
  component: Index,
});
