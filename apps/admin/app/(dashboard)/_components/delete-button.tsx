"use client";

import { useTransition } from "react";

export function DeleteButton({
  id,
  action,
  label = "Delete this item?",
}: {
  id: string;
  action: (id: string) => Promise<void>;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(label)) startTransition(() => action(id));
      }}
      className="text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}
