import { div } from "framer-motion/client";
import SystemLogs from "./systemLogs";

export const metadata = {
  title: "System Logs | Admin Dashboard",
  description: "Monitor all system logs",
};

export default function Page() {
  return (
    <div className="p-6">
      <SystemLogs />
    </div>
  );
}
