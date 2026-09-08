import { saveCategory } from "@/lib/actions";
import { CategoryForm } from "../_components/category-form";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const action = saveCategory.bind(null, null);
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">New category</h1>
      <p className="mt-1 font-serif text-ink-500">
        Categories group your posts and give each one a topic page.
      </p>
      <div className="mt-8">
        <CategoryForm action={action} error={error} />
      </div>
    </div>
  );
}
