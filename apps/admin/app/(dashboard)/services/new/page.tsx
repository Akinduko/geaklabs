import { saveService } from "@/lib/actions";
import { ServiceForm } from "../_components/service-form";

export const dynamic = "force-dynamic";

export default function NewServicePage() {
  const action = saveService.bind(null, null);
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">New item</h1>
      <p className="mt-1 font-serif text-ink-500">Add a line to the &ldquo;What I do&rdquo; list.</p>
      <div className="mt-8">
        <ServiceForm action={action} />
      </div>
    </div>
  );
}
