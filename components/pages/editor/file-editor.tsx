"use client";

import { useState, useEffect } from "react";
import {
  Save,
  ArrowLeft,
  Loader2,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import * as yaml from "yaml";
import { Switch } from "@/components/ui/switch";

interface FileEditorProps {
  owner: string;
  repo: string;
  filePath: string;
  isPrivate: boolean;
  onBack: () => void;
}

interface SubscriptionInfo {
  plan: string;
  isPaid: boolean;
  commitsUsed: number;
  commitsLimit: number | null;
}

/* ——— Value editor for leaf nodes ——— */

function ValueEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  if (typeof value === "boolean") {
    return (
      <div className="flex items-center gap-2">
        <Switch checked={value} onCheckedChange={onChange} />
        <span className="text-sm text-muted-foreground">
          {value ? "Enabled" : "Disabled"}
        </span>
      </div>
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 w-full rounded-md border bg-background px-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    );
  }

  if (typeof value === "string") {
    if (value.length > 80 || value.includes("\n")) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(8, Math.max(3, value.split("\n").length + 1))}
          className="w-full rounded-md border bg-background px-2.5 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-md border bg-background px-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    );
  }

  return <span className="text-xs italic text-muted-foreground">null</span>;
}

/* ——— Friendly count badge ——— */

function CountBadge({ value }: { value: any }) {
  let label: string | null = null;

  if (Array.isArray(value)) {
    label = `${value.length} ${value.length === 1 ? "element" : "elements"}`;
  } else if (typeof value === "object" && value !== null) {
    const count = Object.keys(value).length;
    label = `${count} ${count === 1 ? "field" : "fields"}`;
  }

  if (!label) return null;

  return (
    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
      {label}
    </span>
  );
}

/* ——— Collapsible section for objects/arrays ——— */

function Section({
  keyName,
  value,
  onChange,
  defaultOpen = true,
}: {
  keyName: string;
  value: any;
  onChange: (v: any) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const isExpandable =
    (typeof value === "object" && value !== null) || Array.isArray(value);

  // Leaf field — just show label + editor
  if (!isExpandable) {
    return (
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex w-40 shrink-0 items-center gap-1.5">
          <span className="text-[13px] font-medium capitalize">{keyName.replace(/[_-]/g, " ")}</span>
        </div>
        <div className="flex-1">
          <ValueEditor value={value} onChange={onChange} />
        </div>
      </div>
    );
  }

  const isArray = Array.isArray(value);

  // Object / Array — collapsible dropdown section
  const entries = isArray
    ? value.map((v: any, i: number) => [String(i), v] as const)
    : Object.entries(value);

  const handleAddItem = () => {
    if (!isArray) return;
    // Determine default value based on existing items
    const sample = value.length > 0 ? value[0] : "";
    let newItem: any = "";
    if (typeof sample === "number") newItem = 0;
    else if (typeof sample === "boolean") newItem = false;
    else if (typeof sample === "object" && sample !== null) {
      if (Array.isArray(sample)) {
        newItem = [];
      } else {
        // Clone structure with empty/default values
        const empty: Record<string, any> = {};
        for (const [k, v] of Object.entries(sample)) {
          if (typeof v === "string") empty[k] = "";
          else if (typeof v === "number") empty[k] = 0;
          else if (typeof v === "boolean") empty[k] = false;
          else if (Array.isArray(v)) empty[k] = [];
          else if (typeof v === "object" && v !== null) empty[k] = {};
          else empty[k] = null;
        }
        newItem = empty;
      }
    }
    onChange([...value, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (!isArray) return;
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div className="overflow-hidden rounded-md border">
      {/* Section header — clickable to toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 bg-muted px-3 py-1.5 text-left text-[13px] font-medium transition-colors hover:bg-muted/80"
      >
        {open ? (
          <ChevronDown className="size-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-3.5 text-muted-foreground" />
        )}
        <span className="capitalize">{keyName.replace(/[_-]/g, " ")}</span>
        <CountBadge value={value} />
      </button>

      {/* Section body */}
      {open && (
        <div className="divide-y divide-border border-t">
          {entries.map(([k, v]) => {
            const childExpandable =
              (typeof v === "object" && v !== null) || Array.isArray(v);
            const index = Number(k);

            if (childExpandable) {
              return (
                <div key={k} className="flex items-start gap-1 px-2.5 py-1.5">
                  <div className="flex-1">
                    <Section
                      keyName={isArray ? `#${index + 1}` : k}
                      value={v}
                      defaultOpen={true}
                      onChange={(newVal) => {
                        if (isArray) {
                          const next = [...value];
                          next[index] = newVal;
                          onChange(next);
                        } else {
                          onChange({ ...value, [k]: newVal });
                        }
                      }}
                    />
                  </div>
                  {isArray && (
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="mt-1.5 shrink-0 rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              );
            }

            return (
              <div key={k} className="flex items-center gap-1 px-3 py-1.5">
                <div className="flex-1">
                  <Section
                    keyName={isArray ? `#${index + 1}` : k}
                    value={v}
                    onChange={(newVal) => {
                      if (isArray) {
                        const next = [...value];
                        next[index] = newVal;
                        onChange(next);
                      } else {
                        onChange({ ...value, [k]: newVal });
                      }
                    }}
                  />
                </div>
                {isArray && (
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="shrink-0 rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add item button for arrays */}
          {isArray && (
            <button
              onClick={handleAddItem}
              className="flex w-full items-center gap-1.5 px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <Plus className="size-3.5" />
              Add element
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ——— Main file editor component ——— */

export function FileEditor({ owner, repo, filePath, isPrivate, onBack }: FileEditorProps) {
  const [content, setContent] = useState<any>(null);
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [sub, setSub] = useState<SubscriptionInfo | null>(null);
  const [commitMessage, setCommitMessage] = useState("");

  const isYaml = filePath.endsWith(".yaml") || filePath.endsWith(".yml");

  useEffect(() => {
    fetch("/api/github/subscription")
      .then((r) => r.json())
      .then(setSub)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/github/repos/${owner}/${repo}/file?path=${encodeURIComponent(filePath)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          const decoded = atob(data.content.replace(/\n/g, ""));
          let parsed: any;
          try {
            parsed = isYaml ? yaml.parse(decoded) : JSON.parse(decoded);
          } catch {
            parsed = decoded;
          }
          setContent(parsed);
          setFormData(typeof parsed === "object" && parsed !== null ? { ...parsed } : {});
          setSha(data.sha);
          setCommitMessage(`Update ${filePath}`);
        } else {
          setError("Could not load file");
        }
      })
      .catch(() => setError("Failed to load file"))
      .finally(() => setLoading(false));
  }, [owner, repo, filePath, isYaml]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const serialized = isYaml
      ? yaml.stringify(formData)
      : JSON.stringify(formData, null, 2);

    try {
      const res = await fetch(`/api/github/repos/${owner}/${repo}/commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: filePath,
          content: serialized,
          sha,
          message: commitMessage || `Update ${filePath}`,
          isPrivate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }

      setSuccess(true);
      if (data.commit?.content?.sha) {
        setSha(data.commit.content.sha);
      }
      if (sub && data.commitsUsed !== undefined) {
        setSub({ ...sub, commitsUsed: data.commitsUsed });
      }
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const isPro = sub?.plan === "pro";
  const commitLabel = isPro
    ? "Pro — Unlimited"
    : `${sub?.commitsUsed ?? 0}/${sub?.commitsLimit ?? 10} commits`;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-blue-500 hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to files
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          <CreditCard className="size-3" />
          {commitLabel}
        </span>
      </div>

      {/* File header */}
      <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
        <span className="font-mono">{filePath}</span>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-500 dark:text-red-400">
          {error}
          {error.includes("Upgrade") && (
            <Link href="/billing" className="ml-2 underline">
              Go to billing
            </Link>
          )}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-sm text-green-600 dark:text-green-400">
          Changes committed successfully!
        </div>
      )}

      {/* Sections editor */}
      {typeof content === "object" && content !== null ? (
        <div className="space-y-4">
          {Object.entries(formData).map(([key, value]) => {
            const isExpandable =
              (typeof value === "object" && value !== null) || Array.isArray(value);

            if (isExpandable) {
              return (
                <Section
                  key={key}
                  keyName={key}
                  value={value}
                  defaultOpen={true}
                  onChange={(newVal) =>
                    setFormData((prev) => {
                      setSuccess(false);
                      return { ...prev, [key]: newVal };
                    })
                  }
                />
              );
            }

            // Top-level primitive — wrap in a simple row
            return (
              <div key={key} className="rounded-md border px-3 py-1.5">
                <Section
                  keyName={key}
                  value={value}
                  onChange={(newVal) =>
                    setFormData((prev) => {
                      setSuccess(false);
                      return { ...prev, [key]: newVal };
                    })
                  }
                />
              </div>
            );
          })}
        </div>
      ) : (
        <textarea
          value={typeof content === "string" ? content : JSON.stringify(content)}
          onChange={(e) => setFormData(e.target.value as any)}
          rows={20}
          className="w-full rounded-md border bg-background px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
        />
      )}

      {/* Commit */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder={`Update ${filePath}`}
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Commit changes
          </button>
        </div>
        {!isPro && (
          <p className="text-xs text-muted-foreground">
            Free plan: {sub?.commitsUsed ?? 0}/{sub?.commitsLimit ?? 10} commits used.{" "}
            <Link href="/billing" className="text-blue-500 hover:underline">
              Upgrade to Pro
            </Link>{" "}
            for unlimited commits and private repo access.
          </p>
        )}
      </div>
    </div>
  );
}
