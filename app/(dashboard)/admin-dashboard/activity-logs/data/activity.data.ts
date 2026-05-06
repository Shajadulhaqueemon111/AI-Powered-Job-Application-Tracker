export type ActivityLog = {
  id: string;
  user: string;
  action: string;
  target: string;
  status: "success" | "warning" | "danger";
  createdAt: string;
};
