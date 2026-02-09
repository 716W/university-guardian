import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "lost" | "found" | "claimed" | "returned" | "active" | "banned" | "pending" | "approved" | "rejected";

const statusStyles: Record<StatusType, string> = {
  lost: "bg-destructive/10 text-destructive border-destructive/20",
  found: "bg-success/10 text-success border-success/20",
  claimed: "bg-warning/10 text-warning border-warning/20",
  returned: "bg-info/10 text-info border-info/20",
  active: "bg-success/10 text-success border-success/20",
  banned: "bg-destructive/10 text-destructive border-destructive/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  approved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[status],
        className
      )}
    >
      {status}
    </Badge>
  );
}
