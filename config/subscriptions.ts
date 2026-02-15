import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Free",
    description: "Get started for free",
    benefits: [
      "Browse all connected repos",
      "Visual JSON & YAML editor",
      "Commit to public repos",
      "10 commits per 30 days",
    ],
    limitations: [
      "Cannot commit to private repos",
      "Limited to 10 commits / 30 days",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Pro",
    description: "Unlimited access",
    benefits: [
      "Everything in Free",
      "Commit to private repos",
      "Unlimited commits",
      "Priority support",
    ],
    limitations: [],
    prices: {
      monthly: 10,
      yearly: 96,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
];

export const plansColumns = [
  "free",
  "pro",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Browse repositories",
    free: true,
    pro: true,
  },
  {
    feature: "Visual editor",
    free: true,
    pro: true,
  },
  {
    feature: "Commit to public repos",
    free: "10 / 30 days",
    pro: "Unlimited",
  },
  {
    feature: "Commit to private repos",
    free: false,
    pro: true,
  },
];
