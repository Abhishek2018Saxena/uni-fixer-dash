import { Wifi, Paintbrush, Zap, Armchair, AlertTriangle } from "lucide-react";
import { IssueType } from "@/types/issue";

export const issueTypeConfig: Record<IssueType, { icon: typeof Wifi; color: string; bg: string }> = {
  WiFi: { icon: Wifi, color: "text-blue-600", bg: "bg-blue-50" },
  Cleaning: { icon: Paintbrush, color: "text-emerald-600", bg: "bg-emerald-50" },
  Electrical: { icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  Furniture: { icon: Armchair, color: "text-purple-600", bg: "bg-purple-50" },
};

export function getStatusClass(status: string) {
  switch (status) {
    case "Reported": return "status-reported";
    case "In Progress": return "status-in-progress";
    case "Resolved": return "status-resolved";
    default: return "";
  }
}

export function getStatusDotClass(status: string) {
  switch (status) {
    case "Reported": return "status-dot-reported";
    case "In Progress": return "status-dot-in-progress";
    case "Resolved": return "status-dot-resolved";
    default: return "";
  }
}
