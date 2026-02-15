"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function UpgradeCard() {
  const [isPro, setIsPro] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/github/subscription")
      .then((r) => r.json())
      .then((data) => setIsPro(data?.plan === "pro"))
      .catch(() => setIsPro(false));
  }, []);

  if (isPro === null || isPro) return null;

  return (
    <Card className="md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none">
      <CardHeader className="md:max-xl:px-4">
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Unlock all features and get unlimited access to our support team.
        </CardDescription>
      </CardHeader>
      <CardContent className="md:max-xl:px-4">
        <Link href="/billing">
          <Button size="sm" className="w-full">
            Upgrade
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
