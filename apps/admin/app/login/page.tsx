"use client";

import { useActionState } from "react";
import { GeakMark } from "@geaklabs/ui";
import { login, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-ink-200 bg-paper p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <GeakMark gradient className="h-9 w-9" />
          <h1 className="mt-4 font-display text-xl font-semibold text-ink-900">
            GEAK LABS Studio
          </h1>
          <p className="mt-1 font-serif text-sm text-ink-500">Sign in to manage content.</p>
        </div>

        <form action={formAction} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="font-display text-sm font-medium text-ink-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1.5 w-full rounded-lg border border-ink-200 bg-paper px-3.5 py-2.5 font-sans text-sm text-ink-900 focus:border-ink-900 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-display text-sm font-medium text-ink-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-lg border border-ink-200 bg-paper px-3.5 py-2.5 font-sans text-sm text-ink-900 focus:border-ink-900 focus:outline-none"
            />
          </div>

          {state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 font-display text-sm text-red-600">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-ink-900 py-2.5 font-display text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
