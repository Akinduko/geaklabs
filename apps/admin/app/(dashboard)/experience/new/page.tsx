import { saveExperience } from "@/lib/actions";
import { ExperienceForm } from "../_components/experience-form";

export const dynamic = "force-dynamic";

export default function NewExperiencePage() {
  const action = saveExperience.bind(null, null);
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">New experience</h1>
      <p className="mt-1 font-serif text-ink-500">Add a role to your timeline.</p>
      <div className="mt-8">
        <ExperienceForm action={action} />
      </div>
    </div>
  );
}
