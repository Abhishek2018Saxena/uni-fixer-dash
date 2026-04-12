import { useMemo } from "react";
import { useIssueStore } from "@/store/issueStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const STATUS_COLORS = ["#ef4444", "#f59e0b", "#22c55e"];
const TYPE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

export function AnalyticsCharts() {
  const issues = useIssueStore((s) => s.issues);

  const byType = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach((i) => (counts[i.type] = (counts[i.type] || 0) + 1));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [issues]);

  const byStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach((i) => (counts[i.status] = (counts[i.status] || 0) + 1));
    return ["Reported", "In Progress", "Resolved"]
      .filter((s) => counts[s])
      .map((name) => ({ name, value: counts[name] }));
  }, [issues]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Issues by Type */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-display font-semibold text-card-foreground mb-4">Issues by Type</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={byType}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {byType.map((_, i) => (
                <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Issues by Status */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-display font-semibold text-card-foreground mb-4">Issues by Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={byStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
              {byStatus.map((_, i) => (
                <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
