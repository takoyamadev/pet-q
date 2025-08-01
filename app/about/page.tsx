import { Heart, Users, MessageCircle, Shield, Sparkles, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "PetQについて | PetQ（ペットキュー）",
  description: "PetQ（ペットキュー）は、ペット飼育者同士が気軽に情報交換できる匿名掲示板サービスです",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">PetQについて</h1>
      
      <div className="space-y-8">
        {/* サービス概要 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">サービス概要</h2>
          <p className="text-muted-foreground leading-relaxed">
            PetQ（ペットキュー）は、ペット飼育者同士が気軽に情報交換できる匿名掲示板サービスです。
            ペットに関する悩みや質問、日々の出来事を共有し、同じペット愛好家の仲間と交流することができます。
          </p>
        </section>

        {/* 特徴 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">PetQの特徴</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">匿名で安心</h3>
                  <p className="text-sm text-muted-foreground">
                    個人情報を明かすことなく、安心して相談や質問ができます
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Users className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">豊富なカテゴリー</h3>
                  <p className="text-sm text-muted-foreground">
                    犬、猫、小動物など、様々なペットカテゴリーに対応しています
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <MessageCircle className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">活発なコミュニティ</h3>
                  <p className="text-sm text-muted-foreground">
                    経験豊富な飼育者から初心者まで、幅広いユーザーが参加しています
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Sparkles className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">シンプルで使いやすい</h3>
                  <p className="text-sm text-muted-foreground">
                    直感的なインターフェースで、誰でも簡単に利用できます
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ミッション */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">私たちのミッション</h2>
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <Heart className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  すべてのペット飼育者が、安心して情報交換や相談ができる場を提供し、
                  ペットとの生活をより豊かで幸せなものにすることを目指しています。
                  ペットも飼い主も、みんなが笑顔になれるコミュニティを作ります。
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* こんな時に */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">こんな時にPetQを</h2>
          <div className="space-y-3">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm">ペットの健康や行動について気になることがある時</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm">おすすめのペット用品やフードを知りたい時</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm">しつけ方法や飼育のコツを相談したい時</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm">同じペットを飼っている仲間と交流したい時</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm">ペットとの日常を共有したい時</p>
              </div>
            </Card>
          </div>
        </section>

        {/* 利用について */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">ご利用にあたって</h2>
          <Card className="p-6">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>完全無料でご利用いただけます</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>会員登録は不要です（匿名投稿が可能）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>24時間365日いつでもアクセス可能です</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>スマートフォン、タブレット、PCなど様々なデバイスに対応</span>
              </li>
            </ul>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <p className="text-lg text-muted-foreground mb-6">
            さあ、PetQでペット仲間と繋がりましょう！
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            トップページへ戻る
          </a>
        </section>
      </div>
    </div>
  );
}