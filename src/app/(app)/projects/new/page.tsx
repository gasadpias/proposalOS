import { PageHeader } from "@/components/page-header";
import { CreateProjectForm } from "@/components/create-project-form";
import { Card, CardContent } from "@/components/ui/card";

export default function NewProjectPage() {
  return (
    <div>
      <PageHeader
        title="New project"
        description="Set up a proposal project. You'll upload the RFP in the next step."
      />
      <div className="p-8">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="pt-6">
            <CreateProjectForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
