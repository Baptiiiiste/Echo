import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFileContent } from "@/lib/github";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { owner, repo } = await params;
  const url = new URL(req.url);
  const path = url.searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  try {
    const content = await getFileContent(owner, repo, path, session.user.id);
    if (!content) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
  }
}
