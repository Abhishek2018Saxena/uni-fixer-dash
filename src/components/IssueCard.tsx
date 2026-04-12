import { Issue, IssueStatus, STATUSES } from "@/types/issue";
import { useIssueStore } from "@/store/issueStore";
import { issueTypeConfig, getStatusClass, getStatusDotClass } from "@/lib/issueHelpers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MapPin, Clock, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function IssueCard({ issue }: { issue: Issue }) {
  const { upvote, updateStatus } = useIssueStore();
  const config = issueTypeConfig[issue.type];
  const Icon = config.icon;

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={issue.imageUrl}
          alt={issue.type}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className={`${getStatusClass(issue.status)} border text-xs font-medium px-2.5 py-0.5`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${getStatusDotClass(issue.status)}`} />
            {issue.status}
          </Badge>
          {issue.priority === "High" && (
            <Badge variant="destructive" className="text-xs gap-1">
              <AlertTriangle className="w-3 h-3" /> High
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${config.bg}`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <h3 className="font-display font-semibold text-card-foreground">{issue.type} Issue</h3>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span>{issue.location}</span>
        </div>

        {issue.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
        )}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{formatDistanceToNow(issue.createdAt, { addSuffix: true })}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <button
            onClick={() => upvote(issue.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{issue.upvotes}</span>
          </button>

          <Select value={issue.status} onValueChange={(v) => updateStatus(issue.id, v as IssueStatus)}>
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
