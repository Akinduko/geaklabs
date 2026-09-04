import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, experiences } from "@geaklabs/db";
import { saveExperience } from "@/lib/actions";
import { ExperienceForm } from "../_components/experience-form";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [experience] = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  if (!experience) notFound();

  const action = saveExperience.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Edit experience</h1>
      <p className="mt-1 font-serif text-ink-500">
        {experience.role} · {experience.company}
      </p>
      <div className="mt-8">
        <ExperienceForm experience={experience} action={action} />
      </div>
    </div>
  );
}
