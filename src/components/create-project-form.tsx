"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  createProjectSchema,
  INDUSTRIES,
  PROPOSAL_TYPES,
} from "@/types/project";

export function CreateProjectForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      client_name: String(formData.get("client_name") ?? ""),
      industry: String(formData.get("industry") ?? ""),
      country: String(formData.get("country") ?? ""),
      proposal_type: String(formData.get("proposal_type") ?? ""),
      submission_deadline: String(formData.get("submission_deadline") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    const parsed = createProjectSchema.safeParse(payload);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setError(first?.message ?? "Please check the form.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Could not create project.");
        setSubmitting(false);
        return;
      }

      router.push(`/projects/${json.project.id}`);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Project name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. ABC Financial — Digital Wallet RFP"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="client_name">Client name</Label>
          <Input
            id="client_name"
            name="client_name"
            placeholder="e.g. ABC Financial Services"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select id="industry" name="industry" defaultValue="">
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" placeholder="e.g. Bangladesh" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proposal_type">Proposal type</Label>
          <Select id="proposal_type" name="proposal_type" defaultValue="">
            <option value="">Select type</option>
            {PROPOSAL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="submission_deadline">Submission deadline</Label>
          <Input
            id="submission_deadline"
            name="submission_deadline"
            type="date"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Any context about this opportunity…"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating…" : "Create project"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
