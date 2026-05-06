import NotificationDropdown from "./all-notification/all-notification";

export const Metadata = {
  title: "Notifications | Admin Dashboard",
  description:
    "View all system notifications, updates, and alerts in the admin panel.",
  keywords: ["notifications", "admin", "alerts", "system updates"],
};

export default function NotificationPage() {
  return (
    <div className="p-6 space-y-6">
      {/* DROPDOWN COMPONENT */}
      <div className="flex justify-start">
        <NotificationDropdown />
      </div>
    </div>
  );
}
