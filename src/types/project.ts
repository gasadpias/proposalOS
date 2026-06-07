import { z } from "zod";

export const INDUSTRIES = [
  "FinTech",
  "Digital Banking",
  "Wallet / MFS",
  "Remittance",
  "eKYC",
  "Loan Origination",
  "Transaction Monitoring / AML",
  "Wealth / Investment",
  "SaaS / B2B Technology",
  "Other",
] as const;

export const PROPOSAL_TYPES = [
  "RFP",
  "RFQ",
  "Tender",
  "Concept Note",
  "Requirement Document",
] as const;

export const PROJECT_STATUSES = [
  "draft",
  "analyzing",
  "analyzed",
  "completed",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface Project {
  id: string;
  user_id: string;
  name: string;
  client_name: string | null;
  industry: string | null;
  country: string | null;
  proposal_type: string | null;
  submission_deadline: string | null;
  notes: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

// Schema used by the create-project form and the POST /api/projects route.
export const createProjectSchema = z.object({
  name: z.string().trim().min(2, "Project name must be at least 2 characters").max(120),
  client_name: z.string().trim().max(120).optional().or(z.literal("")),
  industry: z.enum(INDUSTRIES).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  proposal_type: z.enum(PROPOSAL_TYPES).optional().or(z.literal("")),
  submission_deadline: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
