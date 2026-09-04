import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, services } from "@geaklabs/db";
import { saveService } from "@/lib/actions";
import { ServiceForm } from "../_components/service-form";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [service] = await db.select().from(services).where(eq(services.id, id)).limit(1);
  if (!service) notFound();

  const action = saveService.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Edit item</h1>
      <p className="mt-1 font-serif text-ink-500">{service.title}</p>
      <div className="mt-8">
        <ServiceForm service={service} action={action} />
      </div>
    </div>
  );
}
