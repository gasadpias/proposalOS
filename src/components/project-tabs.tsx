"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/projects/${projectId}`;

  const tabs = [
    { href: base, label: "Overview" },
    { href: `${base}/documents`, label: "Documents" },
    { href: `${base}/analysis`, label: "Analysis" },
    { href: `${base}/proposal`, label: "Proposal Draft" },
    { href: `${base}/export`, label: "Export" },
  ];

  return (
    <div className="border-b border-border bg-background px-8">
      <nav className="-mb-px flex gap-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
