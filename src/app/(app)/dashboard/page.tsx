import Link from "next/link";
import { FolderKanban, FileText, CheckCircle2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types/project";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const projects = (data ?? []) as Project[];

  const total = projects.length;
  const analyzed = projects.filter(
    (p) => p.status === "analyzed" || p.status === "completed"
  ).length;
  const completed = projects.filter((p) => p.status === "completed").length;

  const stats = [
    { label: "Total projects", value: total, icon: FolderKanban },
    { label: "Completed analyses", value: analyzed, icon: FileText },
    { label: "Completed proposals", value: completed, icon: CheckCircle2 },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your proposal projects at a glance."
        action={
          <Link href="/projects/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        }
      />

      <div className="space-y-8 p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Recent projects</h2>

          {error ? (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Could not load projects: {error.message}
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first proposal project to start turning RFPs into proposal-ready intelligence."
              action={
                <Link href="/projects/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Project
                  </Button>
                </Link>
              }
            />
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="px-6 py-3 font-medium">Project</th>
                      <th className="px-6 py-3 font-medium">Client</th>
                      <th className="px-6 py-3 font-medium">Industry</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr
                        key={project.id}
                        className="border-b border-border last:border-0 hover:bg-accent/40"
                      >
                        <td className="px-6 py-3">
                          <Link
                            href={`/projects/${project.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {project.name}
                          </Link>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {project.client_name || "—"}
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {project.industry || "—"}
                        </td>
                        <td className="px-6 py-3">
                          <StatusBadge status={project.status} />
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {formatDate(project.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
