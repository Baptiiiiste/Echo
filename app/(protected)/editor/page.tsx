import { constructMetadata } from "@/lib/utils";
import { PageLayout } from "@/components/shared/layout/page-layout";
import { GitFork } from "lucide-react";
import { RepoBrowser } from "@/components/pages/editor/repo-browser";

export const metadata = constructMetadata({
  title: "Editor – GitData Edit",
  description: "Browse and edit your Git-based data files.",
});

export default function EditorPage() {
  return (
    <PageLayout.Root>
      <PageLayout.Title>Editor</PageLayout.Title>
      <PageLayout.Icon icon={GitFork} color="#238636" />
      <PageLayout.Description>
        Select a repository to browse and edit JSON/YAML files.
      </PageLayout.Description>
      <PageLayout.Content>
        <RepoBrowser />
      </PageLayout.Content>
    </PageLayout.Root>
  );
}
