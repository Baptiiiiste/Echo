"use client";

import { useState, useEffect, useMemo } from "react";
import { FileJson, ChevronDown, ChevronRight, Folder, FolderOpen, FileCode2 } from "lucide-react";

interface FileItem {
  name: string;
  path: string;
  type: string;
  sha: string;
  size: number;
}

interface FileBrowserProps {
  owner: string;
  repo: string;
  onSelectFile: (path: string) => void;
}

/**
 * Build a nested tree from flat file paths.
 */
interface TreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children: TreeNode[];
  file?: FileItem;
}

function buildTree(files: FileItem[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const existing = current.find((n) => n.name === part);

      if (existing) {
        current = existing.children;
      } else {
        const node: TreeNode = {
          name: part,
          path: parts.slice(0, i + 1).join("/"),
          isDir: !isLast,
          children: [],
          file: isLast ? file : undefined,
        };
        current.push(node);
        current = node.children;
      }
    }
  }

  // Sort: folders first, then files, alphabetically
  function sortNodes(nodes: TreeNode[]) {
    nodes.sort((a, b) => {
      if (a.isDir && !b.isDir) return -1;
      if (!a.isDir && b.isDir) return 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => sortNodes(n.children));
  }
  sortNodes(root);

  return root;
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "json") return <FileJson className="size-4 shrink-0 text-yellow-500" />;
  if (ext === "yaml" || ext === "yml") return <FileCode2 className="size-4 shrink-0 text-purple-400" />;
  return <FileJson className="size-4 shrink-0 text-muted-foreground" />;
}

function TreeRow({
  node,
  depth,
  expandedDirs,
  toggleDir,
  onSelectFile,
}: {
  node: TreeNode;
  depth: number;
  expandedDirs: Set<string>;
  toggleDir: (path: string) => void;
  onSelectFile: (path: string) => void;
}) {
  const isExpanded = expandedDirs.has(node.path);

  if (node.isDir) {
    return (
      <>
        <button
          onClick={() => toggleDir(node.path)}
          className="flex w-full items-center gap-2 border-b border-border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
          style={{ paddingLeft: `${12 + depth * 20}px` }}
        >
          {isExpanded ? (
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          )}
          {isExpanded ? (
            <FolderOpen className="size-4 shrink-0 text-blue-500" />
          ) : (
            <Folder className="size-4 shrink-0 text-blue-500" />
          )}
          <span className="font-medium">{node.name}</span>
        </button>
        {isExpanded &&
          node.children.map((child) => (
            <TreeRow
              key={child.path}
              node={child}
              depth={depth + 1}
              expandedDirs={expandedDirs}
              toggleDir={toggleDir}
              onSelectFile={onSelectFile}
            />
          ))}
      </>
    );
  }

  return (
    <button
      onClick={() => onSelectFile(node.path)}
      className="flex w-full items-center gap-2 border-b border-border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
      style={{ paddingLeft: `${12 + depth * 20}px` }}
    >
      {/* Spacer to align with folder chevron */}
      <span className="size-4 shrink-0" />
      {getFileIcon(node.name)}
      <span className="text-foreground">{node.name}</span>
    </button>
  );
}

export function FileBrowser({ owner, repo, onSelectFile }: FileBrowserProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    fetch(`/api/github/repos/${owner}/${repo}/contents`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFiles(data);
          // Auto-expand all directories
          const dirs = new Set<string>();
          data.forEach((f: FileItem) => {
            const parts = f.path.split("/");
            for (let i = 1; i < parts.length; i++) {
              dirs.add(parts.slice(0, i).join("/"));
            }
          });
          setExpandedDirs(dirs);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [owner, repo]);

  const tree = useMemo(() => buildTree(files), [files]);

  const toggleDir = (path: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-md border">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-border px-4 py-2.5">
            <div className="h-4 w-4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <FileJson className="mx-auto mb-3 size-10 text-muted-foreground" />
        <h3 className="font-semibold">No data files found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          This repository doesn&apos;t contain any JSON or YAML files.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      {tree.map((node) => (
        <TreeRow
          key={node.path}
          node={node}
          depth={0}
          expandedDirs={expandedDirs}
          toggleDir={toggleDir}
          onSelectFile={onSelectFile}
        />
      ))}
    </div>
  );
}
