import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, projects } from "@geaklabs/db";
import { saveProject } from "@/lib/actions";
import { ProjectForm } from "../_components/project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!project) notFound();

  const action = saveProject.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Edit project</h1>
      <p className="mt-1 font-serif text-ink-500">{project.title}</p>
      <div className="mt-8">
        <ProjectForm project={project} action={action} />
      </div>
    </div>
  );
}
