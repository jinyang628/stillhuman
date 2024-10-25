"use client";

import React from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/shared/theme/toggle";
import FeedbackButton from "@/components/shared/header/feedback/button";
import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeaderButtons() {
  return (
    <div className="flex justify-end items-center space-x-2">
      <ThemeToggle />
      <FeedbackButton />
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </SignedOut>
    </div>
  );
}
