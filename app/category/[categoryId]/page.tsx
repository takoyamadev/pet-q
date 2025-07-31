import { notFound } from "next/navigation";
import { getCategoryById, getSubCategories } from "@/lib/api/categories";
import { getThreads } from "@/lib/api/threads";
import { ThreadList } from "@/components/thread/ThreadList";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const category = await getCategoryById(categoryId);

  if (!category) {
    return {
      title: "カテゴリが見つかりません | PetQ（ペットキュー）",
    };
  }

  return {
    title: `${category.name}の相談・質問 | PetQ（ペットキュー）`,
    description: `${category.name}に関する飼育相談、健康、しつけなどの情報交換ができる掲示板です。`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ sub?: string }>;
}) {
  const { categoryId } = await params;
  const { sub: subCategoryId } = await searchParams;

  const category = await getCategoryById(categoryId);
  if (!category) {
    notFound();
  }

  const subCategories = await getSubCategories(categoryId);
  const threads = await getThreads(categoryId, subCategoryId);

  const selectedSubCategory = subCategoryId
    ? subCategories.find((sc) => sc.id === subCategoryId)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* カテゴリヘッダー */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground">
          {category.name}に関する相談や情報交換ができます
        </p>
      </div>

      {/* サブカテゴリタブ */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href={`/category/${categoryId}`}>
          <Card
            className={`px-4 py-2 cursor-pointer hover:border-primary transition-colors ${!subCategoryId ? "border-primary bg-primary/5" : ""}`}
          >
            すべて
          </Card>
        </Link>
        {subCategories.map((subCategory) => (
          <Link
            key={subCategory.id}
            href={`/category/${categoryId}?sub=${subCategory.id}`}
          >
            <Card
              className={`px-4 py-2 cursor-pointer hover:border-primary transition-colors ${subCategoryId === subCategory.id ? "border-primary bg-primary/5" : ""}`}
            >
              {subCategory.name}
            </Card>
          </Link>
        ))}
      </div>

      {/* スレッド一覧 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {selectedSubCategory
            ? `${selectedSubCategory.name}のスレッド`
            : "すべてのスレッド"}
        </h2>
        <ThreadList threads={threads} showCategory={false} />
      </div>

      {/* ページネーション（TODO: 実装） */}
    </div>
  );
}
