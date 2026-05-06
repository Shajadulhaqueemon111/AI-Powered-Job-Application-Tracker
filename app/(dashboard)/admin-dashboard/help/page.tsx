import type { Metadata } from "next";
import HelpPage from "./help";

export const metadata: Metadata = {
  title: "Help Center | Admin Dashboard",
  description:
    "Find answers, guides, and support articles for using the admin dashboard system.",
  keywords: [
    "help center",
    "support",
    "FAQ",
    "admin dashboard help",
    "system guide",
  ],
};

export default function HelpPages() {
  return (
    <div>
      <HelpPage />
    </div>
  );
}
