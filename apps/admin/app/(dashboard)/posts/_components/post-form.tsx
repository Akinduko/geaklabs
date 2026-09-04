"use client";

import { useState } from "react";
import { RichEditor } from "../../_components/rich-editor";
import { ImageUpload } from "../../_components/image-upload";
import type { Post, Category } from "@geaklabs/db";

export function PostForm({
  post,
  categories,
  action,
}: {
  post?: Post;
  categories: Category[];
  action: (fd: FormData) => void;
}) {
  const [coverUrl, setCoverUrl] = useState(post?.coverImageUrl ?? "");

  return (
    <form action={action} className="space-y-6">
      <Field label="Title">
        <input
          name="title"
          defaultValue={post?.title}
          required
          className="input"
          placeholder="The manager's real job…"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Slug (optional — auto from title)">
          <input name="slug" defaultValue={post?.slug} className="input" placeholder="auto" />
        </Field>
        <Field label="Topic">
          <select name="categoryId" defaultValue={post?.categoryId ?? ""} className="input">
            <option value="">— none —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Excerpt (the dek shown in listings)">
        <textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} className="input" />
      </Field>

      <Field label="Cover image">
        <ImageUpload name="coverImageUrl" value={coverUrl} onChange={setCoverUrl} />
      </Field>

      <Field label="Body">
        <RichEditor name="contentHtml" initialHtml={post?.contentHtml ?? ""} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Tags (comma separated)">
          <input
            name="tags"
            defaultValue={post?.tags?.join(", ")}
            className="input"
            placeholder="teams, clarity"
          />
        </Field>
        <div className="flex items-end gap-6 pb-2">
          <Checkbox name="featured" label="Featured" defaultChecked={post?.featured} />
          <Checkbox
            name="published"
            label="Published"
            defaultChecked={post?.status === "published"}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-ink-200 pt-6">
        <button
          type="submit"
          className="rounded-lg bg-ink-900 px-5 py-2.5 font-display text-sm font-semibold text-paper hover:opacity-90"
        >
          Save post
        </button>
        <a href="/posts" className="font-display text-sm text-ink-500 hover:text-ink-900">
          Cancel
        </a>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-sm font-medium text-ink-700">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 font-display text-sm text-ink-700">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4" />
      {label}
    </label>
  );
}
