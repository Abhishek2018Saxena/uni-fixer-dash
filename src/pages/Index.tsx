import { useState, useMemo } from "react";
import { useIssueStore } from "@/store/issueStore";
import { IssueCard } from "@/components/IssueCard";
import { ReportForm } from "@/components/ReportForm";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { ISSUE_TYPES, STATUSES } from "@/types/issue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, BarChart3, LayoutGrid, AlertCircle, CheckCircle2, Clock, PieChart } from "lucide-react";
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Index() {
  const issues = useIssueStore((s) => s.issues);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    return issues.filter((i) => {
      const matchSearch = !search || i.description.toLowerCase().includes(search.toLowerCase()) || i.location.toLowerCase().includes(search.toLowerCase()) || i.type.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || i.type === typeFilter;
      const matchStatus = statusFilter === "all" || i.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [issues, search, typeFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: issues.length,
    reported: issues.filter((i) => i.status === "Reported").length,
    inProgress: issues.filter((i) => i.status === "In Progress").length,
    resolved: issues.filter((i) => i.status === "Resolved").length,
  }), [issues]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground leading-none">Campus Reporter</h1>
              <p className="text-xs text-muted-foreground">Report & Track Issues</p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-md">
                <Plus className="w-4 h-4" /> Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Report New Issue</DialogTitle>
              </DialogHeader>
              <ReportForm onSuccess={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Hero Tagline */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-lg md:text-xl text-muted-foreground font-medium">
            Empowering students to report and track campus issues in real time
          </p>
        </div>
      </div>

      <main className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, icon: LayoutGrid, cls: "text-primary" },
            { label: "Reported", value: stats.reported, icon: AlertCircle, cls: "text-destructive" },
            { label: "In Progress", value: stats.inProgress, icon: Clock, cls: "text-warning" },
            { label: "Resolved", value: stats.resolved, icon: CheckCircle2, cls: "text-success" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
              <s.icon className={`w-5 h-5 ${s.cls}`} />
              <div>
                <p className="text-2xl font-display font-bold text-card-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Insights Dashboard */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Issue Insights Dashboard</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Stats */}
            <div className="space-y-3">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Issues</p>
                <p className="text-3xl font-display font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">% Resolved</p>
                <p className="text-3xl font-display font-bold text-success">
                  {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
            
            {/* Simple Pie Chart */}
            <div className="md:col-span-2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={[
                      { name: "Reported", value: stats.reported, color: "hsl(var(--destructive))" },
                      { name: "In Progress", value: stats.inProgress, color: "hsl(var(--warning))" },
                      { name: "Resolved", value: stats.resolved, color: "hsl(var(--success))" },
                    ].filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {[
                      { name: "Reported", value: stats.reported, color: "hsl(var(--destructive))" },
                      { name: "In Progress", value: stats.inProgress, color: "hsl(var(--warning))" },
                      { name: "Resolved", value: stats.resolved, color: "hsl(var(--success))" },
                    ].filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="dashboard" className="gap-1.5">
              <LayoutGrid className="w-4 h-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5">
              <BarChart3 className="w-4 h-4" /> Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {ISSUE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Issue Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No issues found</p>
                <p className="text-sm">Try adjusting your filters or report a new issue</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsCharts />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
