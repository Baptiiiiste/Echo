"use client";

import { useState, use } from "react";
import { PageLayout } from "@/components/shared/layout/page-layout";
import { GitFork } from "lucide-react";
import { FileBrowser } from "@/components/pages/editor/file-browser";
import { FileEditor } from "@/components/pages/editor/file-editor";
import Link from "next/link";

interface RepoEditorPageProps {
  params: Promise<{ owner: string; repo: string }>;
}

export default function RepoEditorPage({ params }: RepoEditorPageProps) {
  const { owner, repo } = use(params);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <PageLayout.Root>
      <PageLayout.Title>
        <Link href="/editor" className="text-blue-500 hover:underline">
          Editor
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-blue-500">{owner}</span>
        <span className="mx-1 text-muted-foreground">/</span>
        <span className="text-blue-500">{repo}</span>
      </PageLayout.Title>
      <PageLayout.Icon icon={GitFork} color="#238636" />
      <PageLayout.Description>
        {selectedFile
          ? `Editing ${selectedFile}`
          : "Select a JSON or YAML file to edit."}
      </PageLayout.Description>
      <PageLayout.Content>
        {selectedFile ? (
          <FileEditor
            owner={owner}
            repo={repo}
            filePath={selectedFile}
            isPrivate={false}
            onBack={() => setSelectedFile(null)}
          />
        ) : (
          <FileBrowser
            owner={owner}
            repo={repo}
            onSelectFile={setSelectedFile}
          />
        )}
      </PageLayout.Content>
    </PageLayout.Root>
  );
}
