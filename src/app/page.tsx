import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SessionCard } from "@/components/SessionCard";
import { getSessionsWithStories } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { SiteFooter } from "@/components/SiteFooter";

export default async function Home() {
  const sessions = await getSessionsWithStories();
  const user = await getCurrentUser();

  return (
    <>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">MC Archive</h1>
          {user ? (
            <Link href="/sessions/new">
              <Button className="bg-mc-green hover:bg-mc-green/90 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />새 세션 만들기
              </Button>
            </Link>
          ) : (
            <Link href="/login?callbackUrl=%2Fsessions%2Fnew">
              <Button className="bg-mc-green hover:bg-mc-green/90 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />새 세션 만들기
              </Button>
            </Link>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12 border-2 border-mc-gray/30 rounded-lg bg-mc-gray/5">
            <h2 className="text-xl font-semibold mb-4">세션이 없습니다</h2>
            <p className="text-muted-foreground mb-6">
              새 세션을 만들어 마인크래프트 이미지를 업로드하세요
            </p>
            {user ? (
              <Link href="/sessions/new">
                <Button className="bg-mc-green hover:bg-mc-green/90 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" />새 세션 만들기
                </Button>
              </Link>
            ) : (
              <Link href="/login?callbackUrl=%2Fsessions%2Fnew">
                <Button className="bg-mc-green hover:bg-mc-green/90 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" />새 세션 만들기
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  );
}
