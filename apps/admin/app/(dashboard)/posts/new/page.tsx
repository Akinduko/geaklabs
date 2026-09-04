import { getAllCategories } from "@geaklabs/db";
import { savePost } from "@/lib/actions";
import { PostForm } from "../_components/post-form";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const categories = await getAllCategories();
  const action = savePost.bind(null, null);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">New post</h1>
      <p className="mt-1 font-serif text-ink-500">Write an essay for the Review.</p>
      <div className="mt-8">
        <PostForm categories={categories} action={action} />
      </div>
    </div>
  );
}
