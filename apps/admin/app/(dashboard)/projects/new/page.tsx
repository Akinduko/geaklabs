import { saveProject } from "@/lib/actions";
import { ProjectForm } from "../_components/project-form";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  const action = saveProject.bind(null, null);
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">New project</h1>
      <p className="mt-1 font-serif text-ink-500">Add something you&apos;ve built.</p>
      <div className="mt-8">
        <ProjectForm action={action} />
      </div>
    </div>
  );
}
