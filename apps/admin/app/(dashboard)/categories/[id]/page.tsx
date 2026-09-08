import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, categories } from "@geaklabs/db";
import { saveCategory } from "@/lib/actions";
import { CategoryForm } from "../_components/category-form";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  if (!category) notFound();

  const action = saveCategory.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Edit category</h1>
      <p className="mt-1 font-serif text-ink-500">{category.name}</p>
      <div className="mt-8">
        <CategoryForm category={category} action={action} error={error} />
      </div>
    </div>
  );
}
