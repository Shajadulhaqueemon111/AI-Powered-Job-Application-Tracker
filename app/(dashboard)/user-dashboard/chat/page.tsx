import type { Metadata } from "next";
import ChatPage from "./chat";

// 🔥 SEO / Metadata
export const metadata: Metadata = {
  title: "AI Career Chat | Dashboard",
  description:
    "Chat with your AI career assistant to get job suggestions, resume tips, and skill improvement guidance.",
  keywords: [
    "AI chat",
    "career assistant",
    "job help",
    "resume AI",
    "job dashboard chat",
  ],
  openGraph: {
    title: "AI Career Chat",
    description: "Your real-time AI job assistant inside dashboard",
    type: "website",
  },
};

export default function Page() {
  return <ChatPage />;
}
