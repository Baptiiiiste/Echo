import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { syncUserInstallations, saveInstallationById } from "@/lib/github";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const installationId = url.searchParams.get("installation_id");

  if (installationId) {
    // Directly save the installation from the callback — this works
    // regardless of whether the user signed in via GitHub or Google.
    try {
      await saveInstallationById(session.user.id, Number(installationId));
    } catch (e) {
      console.error("Failed to save installation from callback:", e);
    }
  } else {
    // Fallback: try to sync by username if available
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { githubUsername: true },
    });

    if (user?.githubUsername) {
      try {
        await syncUserInstallations(session.user.id, user.githubUsername);
      } catch (e) {
        console.error("Failed to sync installations:", e);
      }
    }
  }

  // Redirect to editor
  return NextResponse.redirect(new URL("/editor", req.url));
}
