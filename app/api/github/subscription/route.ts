import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserPlan, getUserCommitCount, isUserPaid } from "@/lib/actions/user/is-paid";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const plan = await getUserPlan(userId);
  const isPaid = await isUserPaid(userId);
  const commitsUsed = await getUserCommitCount(userId);

  return NextResponse.json({
    plan,
    isPaid,
    canCommitPublic: true,
    canCommitPrivate: isPaid,
    commitsUsed,
    commitsLimit: isPaid ? null : 10,
  });
}
