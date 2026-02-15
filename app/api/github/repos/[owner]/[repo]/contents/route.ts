import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRepoContents } from "@/lib/github";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { owner, repo } = await params;

  try {
    const contents = await getRepoContents(owner, repo, session.user.id);
    return NextResponse.json(contents);
  } catch (error) {
    console.error("Error fetching contents:", error);
    return NextResponse.json({ error: "Failed to fetch contents" }, { status: 500 });
  }
}
