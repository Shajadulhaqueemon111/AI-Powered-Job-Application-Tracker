import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Billing & Subscription | Admin Dashboard",
  description:
    "Manage your subscription plan, invoices, and billing settings securely.",
};

// Dummy invoice data (real project এ backend থেকে আসবে)
const invoices = [
  {
    id: "INV-2026-0001",
    name: "Md Emon",
    email: "emon@gmail.com",
    amount: "$29.00",
    status: "Paid",
    date: "2026-05-01",
  },
  {
    id: "INV-2026-0002",
    name: "John Doe",
    email: "john@example.com",
    amount: "$29.00",
    status: "Paid",
    date: "2026-04-01",
  },
];

export default function BillingPage() {
  return (
    <main className="p-6 space-y-8 min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground">
          Manage your plans, invoices, and payment history.
        </p>
      </header>

      {/* Top Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge className="bg-indigo-600 text-white">Pro Plan</Badge>
            <p className="text-sm text-muted-foreground">
              Full access to all premium features.
            </p>
            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Billing Cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">Monthly</p>
            <p className="text-sm text-muted-foreground">
              Next payment: 25 May 2026
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm font-medium">Visa •••• 4242</p>
            <Button variant="outline" className="w-full">
              Update Card
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Invoice Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Invoice History</h2>

        <div className="rounded-xl border bg-white dark:bg-slate-900 shadow-md overflow-hidden">
          <table className="w-full text-sm">
            {/* Table Head */}
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="p-4 text-left">Invoice ID</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {invoices.map((inv, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <td className="p-4 font-medium">{inv.id}</td>
                  <td className="p-4">{inv.name}</td>
                  <td className="p-4 text-muted-foreground">{inv.email}</td>
                  <td className="p-4 font-medium">{inv.amount}</td>
                  <td className="p-4">
                    <Badge className="bg-green-500 text-white">
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="p-4">{inv.date}</td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant="outline">
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
