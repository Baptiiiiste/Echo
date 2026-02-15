import { App } from "@octokit/app";
import { env } from "@/env.mjs";
import { prisma } from "@/lib/prisma";

export function getGitHubApp() {
  return new App({
    appId: env.GITHUB_APP_ID,
    privateKey: env.GITHUB_APP_PRIVATE_KEY,
    webhooks: { secret: env.GITHUB_WEBHOOK_SECRET || "unused" },
  });
}

/**
 * Save a specific installation by its ID (from the GitHub App callback).
 * This works without needing the user's GitHub username.
 */
export async function saveInstallationById(userId: string, installationId: number) {
  const app = getGitHubApp();

  // Fetch installation details from GitHub API
  const { data: inst } = await app.octokit.request("GET /app/installations/{installation_id}", {
    installation_id: installationId,
  });

  const login = (inst.account as any)?.login || "unknown";
  const accountType = (inst.account as any)?.type || "User";

  await prisma.gitHubInstallation.upsert({
    where: { installationId: inst.id },
    update: { accountLogin: login, accountType, userId },
    create: { installationId: inst.id, accountLogin: login, accountType, userId },
  });

  // Also update the user's githubUsername if not set yet
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { githubUsername: true },
  });

  if (!user?.githubUsername && accountType === "User") {
    await prisma.user.update({
      where: { id: userId },
      data: { githubUsername: login },
    });
  }

  return inst;
}

/**
 * Auto-discover and sync installations for a user by their GitHub username.
 */
export async function syncUserInstallations(userId: string, githubUsername: string) {
  const app = getGitHubApp();

  // Use the app-level JWT to list installations
  const { data: installations } = await app.octokit.request("GET /app/installations");

  for (const inst of installations) {
    const login = (inst.account as any)?.login;
    if (!login) continue;

    // Match installations belonging to this user
    if (login.toLowerCase() === githubUsername.toLowerCase()) {
      await prisma.gitHubInstallation.upsert({
        where: { installationId: inst.id },
        update: {
          accountLogin: login,
          accountType: (inst.account as any)?.type || "User",
          userId,
        },
        create: {
          installationId: inst.id,
          accountLogin: login,
          accountType: (inst.account as any)?.type || "User",
          userId,
        },
      });
    }
  }

  // Also check org installations the user might have access to
  // (installations where accountType is Organization)
  // We already handle these above by matching username

  return prisma.gitHubInstallation.findMany({
    where: { userId },
  });
}

/**
 * List repos accessible through the user's GitHub App installations.
 */
export async function listRepos(userId: string) {
  const installations = await prisma.gitHubInstallation.findMany({
    where: { userId },
  });

  const app = getGitHubApp();
  const repos: any[] = [];

  for (const inst of installations) {
    try {
      const octokit = await app.getInstallationOctokit(inst.installationId);
      const { data } = await octokit.request("GET /installation/repositories", {
        per_page: 100,
      });
      repos.push(...data.repositories);
    } catch (e) {
      console.error(`Failed to fetch repos for installation ${inst.installationId}:`, e);
    }
  }

  return repos;
}

/**
 * Get contents of a repo path using the Git Tree API for flat listing.
 */
export async function getRepoContents(owner: string, repo: string, userId: string) {
  const installations = await prisma.gitHubInstallation.findMany({
    where: { userId },
  });

  const app = getGitHubApp();

  for (const inst of installations) {
    try {
      const octokit = await app.getInstallationOctokit(inst.installationId);

      // Get default branch
      const { data: repoData } = await octokit.request("GET /repos/{owner}/{repo}", {
        owner,
        repo,
      });

      // Get the tree recursively
      const { data: treeData } = await octokit.request(
        "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
        {
          owner,
          repo,
          tree_sha: repoData.default_branch,
          recursive: "1",
        },
      );

      // Filter for JSON and YAML files only
      const dataFiles = (treeData.tree || []).filter((item: any) => {
        if (item.type !== "blob") return false;
        const name = item.path?.toLowerCase() || "";
        return (
          name.endsWith(".json") ||
          name.endsWith(".yaml") ||
          name.endsWith(".yml")
        );
      });

      return dataFiles.map((item: any) => ({
        name: item.path!.split("/").pop(),
        path: item.path,
        type: "file",
        sha: item.sha,
        size: item.size,
      }));
    } catch (e) {
      continue;
    }
  }

  return [];
}

/**
 * Get a single file's content and metadata.
 */
export async function getFileContent(owner: string, repo: string, path: string, userId: string) {
  const installations = await prisma.gitHubInstallation.findMany({
    where: { userId },
  });

  const app = getGitHubApp();

  for (const inst of installations) {
    try {
      const octokit = await app.getInstallationOctokit(inst.installationId);
      const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path,
      });
      return data;
    } catch (e) {
      continue;
    }
  }

  return null;
}

/**
 * Commit an update to a file.
 */
export async function commitFileUpdate(
  owner: string,
  repo: string,
  path: string,
  content: string,
  sha: string,
  message: string,
  userId: string,
) {
  const installations = await prisma.gitHubInstallation.findMany({
    where: { userId },
  });

  const app = getGitHubApp();

  for (const inst of installations) {
    try {
      const octokit = await app.getInstallationOctokit(inst.installationId);
      const { data } = await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString("base64"),
        sha,
      });
      return data;
    } catch (e) {
      continue;
    }
  }

  throw new Error("Could not commit: no valid installation found");
}
