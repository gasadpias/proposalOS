import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/types/project";

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; variant: "default" | "muted" | "warning" | "success" }
> = {
  draft: { label: "Draft", variant: "muted" },
  analyzing: { label: "Analyzing", variant: "warning" },
  analyzed: { label: "Analyzed", variant: "default" },
  completed: { label: "Completed", variant: "success" },
};

export function StatusBadge({ status }: { status: string }) {
  const config =
    STATUS_CONFIG[status as ProjectStatus] ?? {
      label: status,
      variant: "muted" as const,
    };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
