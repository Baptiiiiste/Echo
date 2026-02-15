"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GitFork, Lock, Globe, ExternalLink, BookOpen, GitBranchIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string; avatar_url: string };
  description: string | null;
  private: boolean;
  default_branch: string;
  stargazers_count: number;
  updated_at: string;
  language: string | null;
}



export function RepoBrowser() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/github/repos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          setError(data.error || "Failed to load repos");
        }
      })
      .catch(() => setError("Failed to load repos"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-md border bg-muted/30" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">{error}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Make sure you have installed the{" "}
          <a
            href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG || "gitdata-edit"}/installations/new`}
            className="text-blue-500 hover:underline"
          >
            GitHub App
          </a>
          .
        </p>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <BookOpen className="mx-auto mb-3 size-10 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No repositories found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Install the GitHub App on your repositories to get started.
        </p>
        <a
          href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG || "gitdata-edit"}/installations/new`}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <ExternalLink className="size-4" />
          Install GitHub App
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <Link
          key={repo.id}
          href={`/editor/${repo.owner.login}/${repo.name}`}
          className="group flex flex-col justify-between rounded-md border p-4 transition-colors hover:border-blue-500/50 hover:bg-muted/30"
        >
          <div>
            {/* Name + badge */}
            <div className="flex items-start gap-2">
              <BookOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="font-semibold text-blue-500 group-hover:underline">
                {repo.full_name}
              </span>
              <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {repo.private ? (
                  <>
                    <Lock className="size-2.5" /> Private
                  </>
                ) : (
                  <>
                    <Globe className="size-2.5" /> Public
                  </>
                )}
              </span>
            </div>

            {/* Description */}
            {repo.description && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {repo.description}
              </p>
            )}
          </div>

          {/* Footer meta */}
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <GitBranchIcon className="size-3" />
              {repo.default_branch}
            </span>
            <span className="ml-auto">
              {formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
