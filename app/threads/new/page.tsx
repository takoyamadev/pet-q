import { ThreadForm } from "@/components/thread/ThreadForm";
import { getCategories } from "@/lib/api/categories";

export const metadata = {
  title: "スレッド作成 | PetQ（ペットキュー）",
  description: "ペットに関する相談や質問を投稿できます",
};

export default async function NewThreadPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">スレッド作成</h1>

      <div className="mb-6 p-4 bg-secondary/10 rounded-lg">
        <h2 className="font-semibold mb-2">投稿時の注意事項</h2>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>個人情報（名前、住所、電話番号など）の投稿は避けてください</li>
          <li>営利目的の宣伝や広告は禁止です</li>
          <li>動物虐待や違法行為に関する内容は投稿できません</li>
          <li>医療に関する内容は参考程度に留め、必ず獣医師にご相談ください</li>
        </ul>
      </div>

      <ThreadForm categories={categories} />
    </div>
  );
}
