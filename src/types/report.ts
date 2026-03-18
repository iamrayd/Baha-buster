export type SeverityLevel = "High" | "Medium" | "Low";
export type ReportStatus = "Pending" | "Approved" | "Disapproved";

export interface FloodReport {
  id: string;
  severity: SeverityLevel;
  description: string;
  photos: string[];
  user_barangay: string;
  user_email: string;
  timestamp: string;
  status: ReportStatus;
}