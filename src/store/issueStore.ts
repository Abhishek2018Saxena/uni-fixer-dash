import { create } from "zustand";
import { Issue, IssueStatus, IssuePriority } from "@/types/issue";

function calcPriority(upvotes: number): IssuePriority {
  if (upvotes >= 10) return "High";
  if (upvotes >= 5) return "Medium";
  return "Low";
}

const DEMO_ISSUES: Issue[] = [
  {
    id: "1",
    type: "WiFi",
    location: "Block A - 2nd Floor",
    block: "Block A",
    floor: "2nd Floor",
    description: "WiFi has been extremely slow in the computer lab for the past 3 days. Unable to attend online lectures.",
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop",
    status: "Reported",
    priority: "High",
    upvotes: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    type: "Cleaning",
    location: "Block B - Ground Floor",
    block: "Block B",
    floor: "Ground Floor",
    description: "Restroom near the cafeteria needs urgent cleaning. Overflowing bins.",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    status: "In Progress",
    priority: "Medium",
    upvotes: 7,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "3",
    type: "Electrical",
    location: "Block C - 1st Floor",
    block: "Block C",
    floor: "1st Floor",
    description: "Flickering lights in Lecture Hall 3. Hard to focus during evening classes.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
    status: "Resolved",
    priority: "Low",
    upvotes: 3,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    type: "Furniture",
    location: "Block D - 3rd Floor",
    block: "Block D",
    floor: "3rd Floor",
    description: "Several chairs in Room 301 are broken. Safety hazard for students.",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    status: "Reported",
    priority: "Medium",
    upvotes: 6,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
];

interface IssueStore {
  issues: Issue[];
  addIssue: (issue: Omit<Issue, "id" | "status" | "priority" | "upvotes" | "createdAt">) => void;
  updateStatus: (id: string, status: IssueStatus) => void;
  upvote: (id: string) => void;
}

export const useIssueStore = create<IssueStore>((set) => ({
  issues: DEMO_ISSUES,
  addIssue: (data) =>
    set((state) => ({
      issues: [
        {
          ...data,
          id: crypto.randomUUID(),
          status: "Reported",
          priority: "Low",
          upvotes: 0,
          createdAt: new Date(),
        },
        ...state.issues,
      ],
    })),
  updateStatus: (id, status) =>
    set((state) => ({
      issues: state.issues.map((i) => (i.id === id ? { ...i, status } : i)),
    })),
  upvote: (id) =>
    set((state) => ({
      issues: state.issues.map((i) =>
        i.id === id
          ? { ...i, upvotes: i.upvotes + 1, priority: calcPriority(i.upvotes + 1) }
          : i
      ),
    })),
}));
