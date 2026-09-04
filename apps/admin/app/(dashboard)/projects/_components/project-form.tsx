"use client";

import { useState } from "react";
import { RichEditor } from "../../_components/rich-editor";
import { ImageUpload } from "../../_components/image-upload";
import type { Project } from "@geaklabs/db";

export function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (fd: FormData) => void;
}) {
  const [coverUrl, setCoverUrl] = useState(project?.coverImageUrl ?? "");

  return (
    <form action={action} className="space-y-6">
      <Field label="Title">
        <input name="title" defaultValue={project?.title} required className="input" />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Slug (optional)">
          <input name="slug" defaultValue={project?.slug} className="input" placeholder="auto" />
        </Field>
        <Field label="Your role">
          <input
            name="role"
            defaultValue={project?.role ?? ""}
            className="input"
            placeholder="Founder / Engineering"
          />
        </Field>
      </div>

      <Field label="Summary (one line for listings)">
        <textarea name="summary" defaultValue={project?.summary ?? ""} rows={2} className="input" />
      </Field>

      <Field label="Cover image">
        <ImageUpload name="coverImageUrl" value={coverUrl} onChange={setCoverUrl} />
      </Field>

      <Field label="Description">
        <RichEditor name="descriptionHtml" initialHtml={project?.descriptionHtml ?? ""} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Tech stack (comma separated)">
          <input
            name="techStack"
            defaultValue={project?.techStack?.join(", ")}
            className="input"
            placeholder="Next.js, Postgres, AWS"
          />
        </Field>
        <Field label="Sort order (lower = first)">
          <input
            name="sortOrder"
            type="number"
            defaultValue={project?.sortOrder ?? 0}
            className="input"
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Live URL">
          <input name="liveUrl" defaultValue={project?.liveUrl ?? ""} className="input" />
        </Field>
        <Field label="Repo URL">
          <input name="repoUrl" defaultValue={project?.repoUrl ?? ""} className="input" />
        </Field>
      </div>

      <div className="flex items-center gap-6">
        <Checkbox name="featured" label="Featured" defaultChecked={project?.featured} />
        <Checkbox
          name="published"
          label="Published"
          defaultChecked={project ? project.status === "published" : true}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-ink-200 pt-6">
        <button
          type="submit"
          className="rounded-lg bg-ink-900 px-5 py-2.5 font-display text-sm font-semibold text-paper hover:opacity-90"
        >
          Save project
        </button>
        <a href="/projects" className="font-display text-sm text-ink-500 hover:text-ink-900">
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
