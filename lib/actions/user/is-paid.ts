import "server-only";

import { prisma } from "@/lib/prisma";

export type UserPlan = "free" | "pro";

const FREE_COMMIT_LIMIT = 10;
const FREE_COMMIT_WINDOW_DAYS = 30;

/**
 * Returns the user's current plan: "free" or "pro".
 */
export async function getUserPlan(userId: string): Promise<UserPlan> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!user) return "free";

  const hasActiveSubscription = Boolean(
    user.stripePriceId &&
      user.stripeCurrentPeriodEnd &&
      user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now(),
  );

  return hasActiveSubscription ? "pro" : "free";
}

/**
 * Check if user has an active paid subscription.
 */
export async function isUserPaid(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return plan === "pro";
}

/**
 * Get the number of commits made in the last 30 days.
 */
export async function getUserCommitCount(userId: string): Promise<number> {
  const since = new Date();
  since.setDate(since.getDate() - FREE_COMMIT_WINDOW_DAYS);

  return prisma.gitHubCommit.count({
    where: {
      userId,
      createdAt: { gte: since },
    },
  });
}

/**
 * Record a commit for rate limiting.
 */
export async function recordCommit(
  userId: string,
  repo: string,
  filePath: string,
) {
  return prisma.gitHubCommit.create({
    data: { userId, repo, filePath },
  });
}

/**
 * Check if a user can commit to a given repo.
 * - Free: public repos only, max 10 commits per 30 days
 * - Pro: everything, unlimited
 */
export async function canUserCommit(
  userId: string,
  isPrivateRepo: boolean,
): Promise<{ allowed: boolean; plan: UserPlan; reason?: string; commitsUsed?: number; commitsLimit?: number }> {
  const plan = await getUserPlan(userId);

  if (plan === "pro") {
    return { allowed: true, plan };
  }

  // Free plan: no private repos
  if (isPrivateRepo) {
    return {
      allowed: false,
      plan,
      reason: "Upgrade to Pro to commit to private repositories.",
    };
  }

  // Free plan: check commit limit
  const commitsUsed = await getUserCommitCount(userId);
  if (commitsUsed >= FREE_COMMIT_LIMIT) {
    return {
      allowed: false,
      plan,
      commitsUsed,
      commitsLimit: FREE_COMMIT_LIMIT,
      reason: `You've reached the free limit of ${FREE_COMMIT_LIMIT} commits per 30 days. Upgrade to Pro for unlimited commits.`,
    };
  }

  return {
    allowed: true,
    plan,
    commitsUsed,
    commitsLimit: FREE_COMMIT_LIMIT,
  };
}
