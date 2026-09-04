"use client";

import { useState } from "react";

/**
 * Uploads an image to /api/upload (Vercel Blob) and stores the returned URL
 * in a hidden input so the parent form submits it. Falls back gracefully if
 * Blob isn't configured (local dev without a token).
 */
export function ImageUpload({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");

  async function handleFile(file: File) {
    setStatus("uploading");
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });
      if (!res.ok) throw new Error("upload failed");
      const data = (await res.json()) as { url: string };
      onChange(data.url);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={value} />
      <div className="flex items-center gap-4">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="cover preview"
            className="h-16 w-24 rounded-lg border border-ink-200 object-cover"
          />
        ) : (
          <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-dashed border-ink-300 text-xs text-ink-400">
            none
          </div>
        )}
        <div>
          <label className="cursor-pointer rounded-lg border border-ink-300 px-3 py-1.5 font-display text-sm text-ink-700 hover:bg-ink-50">
            {status === "uploading" ? "Uploading…" : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="ml-3 font-display text-sm text-ink-400 hover:text-ink-900"
            >
              Remove
            </button>
          )}
          {status === "error" && (
            <p className="mt-1 font-display text-xs text-red-500">
              Upload failed — paste an image URL below instead.
            </p>
          )}
        </div>
      </div>
      <input
        type="url"
        placeholder="…or paste an image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      />
    </div>
  );
}
