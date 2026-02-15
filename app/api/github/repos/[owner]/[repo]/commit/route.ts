import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { commitFileUpdate } from "@/lib/github";
import { canUserCommit, recordCommit } from "@/lib/actions/user/is-paid";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { owner, repo } = await params;
  const body = await req.json();
  const { path, content, sha, message, isPrivate } = body;

  if (!path || !content || !sha) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check plan-based commit restrictions
  const check = await canUserCommit(session.user.id, isPrivate ?? false);
  if (!check.allowed) {
    return NextResponse.json(
      {
        error: check.reason,
        plan: check.plan,
        commitsUsed: check.commitsUsed,
        commitsLimit: check.commitsLimit,
      },
      { status: 403 },
    );
  }

  try {
    const result = await commitFileUpdate(
      owner,
      repo,
      path,
      content,
      sha,
      message || `Update ${path} via GitData Edit`,
      session.user.id,
    );

    // Record the commit for rate limiting
    await recordCommit(session.user.id, `${owner}/${repo}`, path);

    const newCommitsUsed = (check.commitsUsed ?? 0) + 1;

    return NextResponse.json({
      success: true,
      commit: result,
      commitsUsed: newCommitsUsed,
      commitsLimit: check.commitsLimit,
    });
  } catch (error: any) {
    console.error("Error committing:", error);
    return NextResponse.json(
      { error: error.message || "Failed to commit" },
      { status: 500 },
    );
  }
}
