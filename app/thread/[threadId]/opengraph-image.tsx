import { ImageResponse } from "next/og";
import { getThreadById } from "@/lib/api/threads";

export const runtime = "edge";

export const alt = "PetQ スレッド";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const thread = await getThreadById(threadId);
  
  if (!thread) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <div style={{ fontSize: 80, fontWeight: "bold", marginBottom: 20 }}>PetQ</div>
          <div style={{ fontSize: 32 }}>スレッドが見つかりません</div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

  const title = thread.title.length > 50 
    ? thread.title.substring(0, 47) + "..." 
    : thread.title;
    
  const content = thread.content.length > 120 
    ? thread.content.substring(0, 117) + "..." 
    : thread.content;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 60,
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            style={{ marginRight: 15 }}
          >
            <path
              d="M4.5 6.5C4.5 5.39543 5.39543 4.5 6.5 4.5C7.60457 4.5 8.5 5.39543 8.5 6.5V8.5C8.5 9.60457 7.60457 10.5 6.5 10.5C5.39543 10.5 4.5 9.60457 4.5 8.5V6.5Z"
              fill="white"
            />
            <path
              d="M15.5 6.5C15.5 5.39543 16.3954 4.5 17.5 4.5C18.6046 4.5 19.5 5.39543 19.5 6.5V8.5C19.5 9.60457 18.6046 10.5 17.5 10.5C16.3954 10.5 15.5 9.60457 15.5 8.5V6.5Z"
              fill="white"
            />
            <path
              d="M4.5 15.5C4.5 13.5 6 11.5 8.5 11.5H15.5C18 11.5 19.5 13.5 19.5 15.5C19.5 17.5 18 19.5 15.5 19.5H8.5C6 19.5 4.5 17.5 4.5 15.5Z"
              fill="white"
            />
          </svg>
          <div style={{ fontSize: 50, fontWeight: "bold" }}>PetQ</div>
        </div>
        
        <div style={{ 
          fontSize: 40, 
          fontWeight: "bold", 
          marginBottom: 20,
          lineHeight: 1.3,
        }}>
          {title}
        </div>
        
        <div style={{ 
          fontSize: 24, 
          opacity: 0.9,
          lineHeight: 1.5,
          marginBottom: 30,
        }}>
          {content}
        </div>
        
        <div style={{ 
          display: "flex",
          gap: 30,
          fontSize: 20,
          opacity: 0.8,
        }}>
          <div>💬 {thread.response_count || 0} レス</div>
          <div>👁 {thread.view_count || 0} ビュー</div>
        </div>
        
        <div style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          fontSize: 20,
          opacity: 0.7,
        }}>
          pet-q.tkym-dev.workers.dev
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}