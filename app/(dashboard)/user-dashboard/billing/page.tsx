// app/(dashboard)/user-dashboard/billing/page.tsx

import type { Metadata } from "next";
import BillingPage from "./billingpage";

export const metadata: Metadata = {
  title: "Billing & Subscription | ApplyAI",
  description:
    "Manage your AI subscription, payment methods, invoices and premium features.",
};

export default function Page() {
  return <BillingPage />;
}
