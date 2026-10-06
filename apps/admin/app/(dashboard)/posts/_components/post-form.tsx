"use client";

import { useState } from "react";
import { RichEditor } from "../../_components/rich-editor";
import { ImageUpload } from "../../_components/image-upload";
import type { Post, Category, ContentSection } from "@geaklabs/db";

const SECTION_LABELS: Record<ContentSection, string> = {
  professional: "Professional",
  faith: "Faith",
};

export function PostForm({
  post,
  categories,
  action,
  error,
}: {
  post?: Post;
  categories: Category[];
  action: (fd: FormData) => void;
  error?: string;
}) {
  const [coverUrl, setCoverUrl] = useState(post?.coverImageUrl ?? "");
  const [section, setSection] = useState<ContentSection>(post?.section ?? "professional");
  // The topic picker only offers categories from the chosen section, so a faith post
  // can't be filed under "Engineering" by accident. The server checks this too.
  const topics = categories.filter((c) => c.section === section);
  const categoryStillValid = topics.some((c) => c.id === post?.categoryId);

  return (
    <form action={action} className="space-y-6">
      {error === "section" && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 font-display text-sm text-red-600">
          That topic belongs to the other section. Pick a topic from the post’s own section, or none.
        </p>
      )}
      <fieldset>
        <legend className="mb-1.5 block font-display text-sm font-medium text-ink-700">Section</legend>
        <div className="flex gap-6 pt-1">
          {(Object.keys(SECTION_LABELS) as ContentSection[]).map((s) => (
            <label key={s} className="flex items-center gap-2 font-display text-sm text-ink-700">
              <input
                type="radio"
                name="section"
                value={s}
                checked={section === s}
                onChange={() => setSection(s)}
                className="h-4 w-4"
              />
              {SECTION_LABELS[s]}
            </label>
          ))}
        </div>
        <p className="mt-1.5 font-display text-xs text-ink-400">
          Professional posts appear under /articles; faith posts under /faith. Each has its own feed.
        </p>
      </fieldset>

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
          <select
            key={section}
            name="categoryId"
            defaultValue={categoryStillValid ? (post?.categoryId ?? "") : ""}
            className="input"
          >
            <option value="">— none —</option>
            {topics.map((c) => (
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
      <p className="-mt-3 font-display text-xs text-ink-400">
        Optional. Posts without a cover get generated artwork on the site.
      </p>
      {coverUrl && (
        <Field label="Cover image description (alt text)">
          <input
            name="coverImageAlt"
            defaultValue={post?.coverImageAlt ?? ""}
            className="input"
            placeholder="What the picture shows, for screen readers and search"
          />
        </Field>
      )}

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
