import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, posts, getAllCategories } from "@geaklabs/db";
import { savePost } from "@/lib/actions";
import { PostForm } from "../_components/post-form";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!post) notFound();

  const categories = await getAllCategories();
  const action = savePost.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Edit post</h1>
      <p className="mt-1 font-serif text-ink-500">{post.title}</p>
      <div className="mt-8">
        <PostForm post={post} categories={categories} action={action} error={error} />
      </div>
    </div>
  );
}
