"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto text-center animate-fade-in">
        <div className="space-y-6">
          <div className="text-6xl font-bold text-primary">404</div>
          <div>
            <h1 className="text-2xl font-bold mb-2">ページが見つかりません</h1>
            <p className="text-muted-foreground">
              お探しのページは存在しないか、移動された可能性があります。
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="flex items-center gap-2">
                <Home size={20} />
                トップページに戻る
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
