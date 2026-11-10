export const GOAL_CATEGORIES = [
  "Personal growth",
  "Career",
  "Health & wellbeing",
  "Relationships",
  "Creativity",
  "Financial",
  "Learning",
] as const;

export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  targetDate?: string;
  progress: number;
  status: "active" | "completed";
  createdDate: string;
}
