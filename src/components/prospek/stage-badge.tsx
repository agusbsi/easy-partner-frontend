import { Badge } from "@/components/ui/badge";
import { stageMeta, type Stage } from "@/lib/mock-data";

export function StageBadge({ stage }: { stage: Stage }) {
  const m = stageMeta(stage);
  return <Badge variant={m.tone}>{m.label}</Badge>;
}
