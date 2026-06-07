import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ProjectTabs } from "@/components/project-tabs";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/types/project";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Could not load project: {error.message}
        </div>
      </div>
    );
  }

  if (!data) {
    notFound();
  }

  const project = data as Project;

  const fields: { label: string; value: string }[] = [
    { label: "Client", value: project.client_name || "—" },
    { label: "Industry", value: project.industry || "—" },
    { label: "Country", value: project.country || "—" },
    { label: "Proposal type", value: project.proposal_type || "—" },
    {
      label: "Submission deadline",
      value: formatDate(project.submission_deadline),
    },
    { label: "Created", value: formatDate(project.created_at) },
  ];

  return (
    <div>
      <PageHeader
        title={project.name}
        description="Project overview and details."
        action={<StatusBadge status={project.status} />}
      />
      <ProjectTabs projectId={project.id} />

      <div className="space-y-6 p-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <Card>
          <CardContent className="pt-6">
            <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map((field) => (
                <div key={field.label}>
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {field.label}
                  </dt>
                  <dd className="mt-1 text-sm">{field.value}</dd>
                </div>
              ))}
            </dl>

            {project.notes && (
              <div className="mt-6 border-t border-border pt-6">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Notes
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm">
                  {project.notes}
                </dd>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold">Next step</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Document upload and AI analysis arrive in the next phase. Once
              available, you&apos;ll upload your RFP from the Documents tab and
              generate proposal-ready intelligence.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
