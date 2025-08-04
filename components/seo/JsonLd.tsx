import Script from "next/script";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PetQ（ペットキュー）",
    alternateName: "PetQ",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://pet-q.tkym-dev.workers.dev",
    description: "ペット飼育者同士が気軽に情報交換できる匿名掲示板",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || "https://pet-q.tkym-dev.workers.dev"}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

interface Thread {
  id: string;
  title: string;
  content: string;
  created_at: string | Date;
  updated_at?: string | Date;
  response_count?: number;
  view_count?: number;
}

interface Response {
  content: string;
  created_at: string | Date;
}

export function ThreadJsonLd({
  thread,
  responses,
}: {
  thread: Thread;
  responses: Response[];
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pet-q.tkym-dev.workers.dev";
  
  const data = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: thread.title,
    text: thread.content,
    url: `${baseUrl}/thread/${thread.id}`,
    datePublished: typeof thread.created_at === 'string' ? thread.created_at : thread.created_at.toISOString(),
    dateModified: thread.updated_at 
      ? (typeof thread.updated_at === 'string' ? thread.updated_at : thread.updated_at.toISOString())
      : (typeof thread.created_at === 'string' ? thread.created_at : thread.created_at.toISOString()),
    author: {
      "@type": "Person",
      name: "匿名ユーザー",
    },
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: thread.response_count || 0,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ViewAction",
        userInteractionCount: thread.view_count || 0,
      },
    ],
    comment: responses.map((response) => ({
      "@type": "Comment",
      text: response.content,
      datePublished: typeof response.created_at === 'string' ? response.created_at : response.created_at.toISOString(),
      author: {
        "@type": "Person",
        name: "匿名ユーザー",
      },
    })),
  };

  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; url?: string }>;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pet-q.tkym-dev.workers.dev";
  
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? `${baseUrl}${item.url}` : undefined,
    })),
  };

  return <JsonLd data={data} />;
}