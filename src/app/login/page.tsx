"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { signIn, signUp, sendMagicLink, type AuthState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialState: AuthState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Please wait…" : label}
    </Button>
  );
}

type Mode = "signin" | "signup" | "magic";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");

  const action =
    mode === "signin" ? signIn : mode === "signup" ? signUp : sendMagicLink;
  const [state, formAction] = useFormState(action, initialState);

  const titles: Record<Mode, { title: string; desc: string; cta: string }> = {
    signin: {
      title: "Welcome back",
      desc: "Log in to your ProposalOS workspace.",
      cta: "Log in",
    },
    signup: {
      title: "Create your account",
      desc: "Start turning RFPs into proposal-ready intelligence.",
      cta: "Sign up",
    },
    magic: {
      title: "Magic link",
      desc: "We'll email you a secure link to sign in.",
      cta: "Send magic link",
    },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            ProposalOS
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{titles[mode].title}</CardTitle>
            <CardDescription>{titles[mode].desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  required
                />
              </div>

              {mode !== "magic" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              {state.error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {state.error}
                </p>
              )}
              {state.message && (
                <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {state.message}
                </p>
              )}

              <SubmitButton label={titles[mode].cta} />
            </form>

            <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
              {mode !== "magic" && (
                <button
                  type="button"
                  onClick={() => setMode("magic")}
                  className="block w-full text-primary hover:underline"
                >
                  Use a magic link instead
                </button>
              )}
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="block w-full hover:underline"
                >
                  Don&apos;t have an account?{" "}
                  <span className="text-primary">Sign up</span>
                </button>
              )}
              {mode === "signup" && (
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="block w-full hover:underline"
                >
                  Already have an account?{" "}
                  <span className="text-primary">Log in</span>
                </button>
              )}
              {mode === "magic" && (
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="block w-full hover:underline"
                >
                  Back to <span className="text-primary">password login</span>
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
