import { ArticlePage, articleMetadata, type ArticleParams } from "../../_components/article-page";

export const revalidate = 60;

export function generateMetadata(props: ArticleParams) {
  return articleMetadata(props, "journal");
}

export default function JournalEntryPage(props: ArticleParams) {
  return <ArticlePage {...props} section="journal" />;
}
