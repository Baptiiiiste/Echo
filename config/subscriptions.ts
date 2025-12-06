import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Free",
    description: "The free plan to get you started",
    benefits: [
      "No benefits, but it's free!",
    ],
    limitations: [
      "All the limitations you can think of.",
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
    title: "Starter",
    description: "Unlock Advanced Features",
    benefits: [
      "Some benefits to get you going",
    ],
    limitations: [
      "Some limitations to keep you in check.",
    ],
    prices: {
      monthly: 3,
      yearly: 30,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_STARTER_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Pro",
    description: "For Power Users",
    benefits: [
      "All the benefits we can offer",
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
  "starter",
  "pro",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Access to the dashboard",
    free: true,
    starter: true,
    pro: true,
    tooltip: "All plans include an access to the dashboard.",
  },
];
