export interface FloodReport {
  id: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  photos: string[];
  user_barangay: string;
  user_email: string;
  timestamp: string;
  status: "Pending" | "Approved" | "Disapproved";
}
