export type IssueType = "WiFi" | "Cleaning" | "Electrical" | "Furniture";
export type IssueStatus = "Reported" | "In Progress" | "Resolved";
export type IssuePriority = "Low" | "Medium" | "High";

export interface Issue {
  id: string;
  type: IssueType;
  location: string;
  block: string;
  floor: string;
  description: string;
  imageUrl: string;
  status: IssueStatus;
  priority: IssuePriority;
  upvotes: number;
  createdAt: Date;
}

export const ISSUE_TYPES: IssueType[] = ["WiFi", "Cleaning", "Electrical", "Furniture"];
export const BLOCKS = ["Block A", "Block B", "Block C", "Block D"];
export const FLOORS = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor"];
export const STATUSES: IssueStatus[] = ["Reported", "In Progress", "Resolved"];
