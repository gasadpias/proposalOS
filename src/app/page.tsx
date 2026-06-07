import Link from "next/link";
import {
  FileSearch,
  ListChecks,
  ShieldCheck,
  FileText,
  Download,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  { icon: FileSearch, title: "Upload RFP", text: "Bring in any RFP, tender, or requirement document." },
  { icon: ListChecks, title: "Extract requirements", text: "Surface explicit and implied requirements automatically." },
  { icon: ShieldCheck, title: "Generate compliance matrix", text: "Map every requirement to a compliance position." },
  { icon: FileText, title: "Create proposal draft", text: "Get a first proposal draft you can refine." },
  { icon: Download, title: "Export outputs", text: "Export matrices to CSV and the draft to DOCX." },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-lg font-semibold tracking-tight">ProposalOS</span>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/login">
            <Button>Start New Proposal</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            FinTech RFP-to-Proposal Intelligence Engine
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Turn RFPs into proposal-ready intelligence in minutes.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            ProposalOS helps presales, product, and business development teams
            convert RFPs, tenders, and requirement documents into structured,
            proposal-ready outputs.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Start New Proposal <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map((step) => (
                <div key={step.title} className="flex flex-col">
                  <step.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        ProposalOS — proposal-ready intelligence for FinTech teams.
      </footer>
    </div>
  );
}
