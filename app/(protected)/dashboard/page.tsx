import { getCurrentUser } from "@/lib/actions/user/get-current-user";
import { getUserPlan, getUserCommitCount } from "@/lib/actions/user/is-paid";
import { constructMetadata } from "@/lib/utils";
import { PageLayout } from "@/components/shared/layout/page-layout";
import {
  LayoutDashboardIcon,
  GitFork,
  CreditCard,
  ExternalLink,
  GitCommitHorizontal,
} from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Dashboard – GitData Edit",
  description: "Manage your Git-based data files.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const plan = await getUserPlan(user!.id!);
  const commitsUsed = await getUserCommitCount(user!.id!);
  const isPro = plan === "pro";
  const commitsLimit = 10;
  const commitsRemaining = isPro
    ? null
    : Math.max(0, commitsLimit - commitsUsed);

  return (
    <PageLayout.Root>
      <PageLayout.Title>Dashboard</PageLayout.Title>
      <PageLayout.Icon icon={LayoutDashboardIcon} color="#238636" />
      <PageLayout.Description>
        Welcome to GitData Edit — your Git-based CMS for data files.
      </PageLayout.Description>
      <PageLayout.Content>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/editor"
            className="group flex flex-col gap-3 rounded-md border p-5 transition-colors hover:border-primary"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <GitFork className="size-5 text-primary" />
            </div>
            <h3 className="font-semibold">Open Editor</h3>
            <p className="text-sm text-muted-foreground">
              Browse your repos and edit JSON/YAML files visually.
            </p>
          </Link>

          <a
            href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG || "gitdata-edit"}/installations/new`}
            className="group flex flex-col gap-3 rounded-md border p-5 transition-colors hover:border-blue-500"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <ExternalLink className="size-5 text-blue-500" />
            </div>
            <h3 className="font-semibold">
              Connect Repos
            </h3>
            <p className="text-sm text-muted-foreground">
              Install the GitHub App on more repositories.
            </p>
          </a>

          <Link
            href="/billing"
            className="group flex flex-col gap-3 rounded-md border p-5 transition-colors hover:border-yellow-500"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-500/10">
              <CreditCard className="size-5 text-yellow-500" />
            </div>
            <h3 className="font-semibold">Subscription</h3>
            <p className="text-sm text-muted-foreground">
              Manage your plan and unlock commit access.
            </p>
          </Link>
        </div>

        <div className="mt-6 rounded-md border p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <GitCommitHorizontal className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">
                Commit Usage
              </h3>
              <p className="text-sm text-muted-foreground">
                {isPro
                  ? "Pro — Unlimited commits"
                  : `Free — ${commitsUsed} / ${commitsLimit} commits used (30-day window)`}
              </p>
            </div>
          </div>

          {!isPro && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{commitsUsed} used</span>
                <span>{commitsRemaining} remaining</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${
                    commitsUsed >= commitsLimit
                      ? "bg-red-500"
                      : commitsUsed >= commitsLimit * 0.8
                        ? "bg-yellow-500"
                        : "bg-primary"
                  }`}
                  style={{
                    width: `${Math.min(100, (commitsUsed / commitsLimit) * 100)}%`,
                  }}
                />
              </div>
              {commitsUsed >= commitsLimit && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  Limit reached —{" "}
                  <Link
                    href="/billing"
                    className="underline"
                  >
                    upgrade to Pro
                  </Link>{" "}
                  for unlimited commits.
                </p>
              )}
            </div>
          )}

          {isPro && (
            <p className="text-xs text-muted-foreground">
              {commitsUsed} commits in the last 30 days.
            </p>
          )}
        </div>

        <div className="mt-6 rounded-md border p-6">
          <h3 className="mb-4 text-lg font-semibold">
            How it works
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </span>
              <div>
                <p className="font-medium">
                  Install the GitHub App
                </p>
                <p className="text-sm text-muted-foreground">
                  Grant access to your repositories
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </span>
              <div>
                <p className="font-medium">
                  Browse & Edit
                </p>
                <p className="text-sm text-muted-foreground">
                  Open any JSON/YAML file in the visual editor
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                3
              </span>
              <div>
                <p className="font-medium">
                  Commit Changes
                </p>
                <p className="text-sm text-muted-foreground">
                  Save directly to your repository
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageLayout.Content>
    </PageLayout.Root>
  );
}
