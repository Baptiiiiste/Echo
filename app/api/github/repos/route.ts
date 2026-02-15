import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listRepos, syncUserInstallations } from "@/lib/github";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Auto-sync installations if user has GitHub connected
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { githubUsername: true },
  });

  if (user?.githubUsername) {
    try {
      await syncUserInstallations(userId, user.githubUsername);
    } catch (e) {
      console.error("Failed to sync installations:", e);
    }
  }

  // Even without githubUsername, the user may have installations saved
  // via the GitHub App callback (e.g. signed in with Google).
  try {
    const repos = await listRepos(userId);
    return NextResponse.json(repos);
  } catch (error) {
    console.error("Error listing repos:", error);
    return NextResponse.json({ error: "Failed to list repos" }, { status: 500 });
  }
}
