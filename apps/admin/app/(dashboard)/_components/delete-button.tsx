"use client";

import { useState, useTransition } from "react";

/**
 * An action may either return nothing (delete always succeeds) or a refusal
 * with a message — used where deleting would damage related content.
 */
type DeleteResult = void | { ok: boolean; message?: string };

export function DeleteButton({
  id,
  action,
  label = "Delete this item?",
  disabled = false,
  disabledHint,
}: {
  id: string;
  action: (id: string) => Promise<DeleteResult>;
  label?: string;
  disabled?: boolean;
  disabledHint?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (disabled) {
    return (
      <span className="text-ink-300" title={disabledHint}>
        Delete
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      {error && <span className="font-display text-xs text-red-600">{error}</span>}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          if (confirm(label)) {
            startTransition(async () => {
              const result = await action(id);
              if (result && !result.ok) setError(result.message ?? "Could not delete this.");
            });
          }
        }}
        className="text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
      >
        {pending ? "…" : "Delete"}
      </button>
    </span>
  );
}
