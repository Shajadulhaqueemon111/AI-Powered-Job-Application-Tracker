import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Search, MessageSquare } from "lucide-react";

const faqs = [
  {
    q: "How do I reset my password?",
    a: "Go to Settings → Security → Reset Password and follow the instructions.",
  },
  {
    q: "How to view system logs?",
    a: "Navigate to Admin Dashboard → System Logs section.",
  },
  {
    q: "How do I manage user roles?",
    a: "Go to Settings → Roles to assign permissions.",
  },
  {
    q: "Why is my data not updating?",
    a: "Try refreshing the page or check API connection status.",
  },
];

export default function HelpPage() {
  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <HelpCircle className="mx-auto w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers, guides, and support for your dashboard
        </p>
      </div>

      {/* SEARCH */}
      <div className="max-w-xl mx-auto flex gap-2">
        <Input placeholder="Search help articles..." />
        <Button>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* CATEGORY CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5 hover:border-primary transition">
          <h2 className="font-semibold">Getting Started</h2>
          <p className="text-sm text-muted-foreground">
            Learn basic dashboard usage
          </p>
        </Card>

        <Card className="p-5 hover:border-primary transition">
          <h2 className="font-semibold">Account & Security</h2>
          <p className="text-sm text-muted-foreground">
            Password, 2FA, login issues
          </p>
        </Card>

        <Card className="p-5 hover:border-primary transition">
          <h2 className="font-semibold">System & Logs</h2>
          <p className="text-sm text-muted-foreground">
            Audit trail and system monitoring
          </p>
        </Card>
      </div>

      {/* FAQ SECTION */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Card key={i} className="p-4">
              <p className="font-medium">{faq.q}</p>
              <p className="text-sm text-muted-foreground mt-1">{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* SUPPORT */}
      <Card className="p-6 text-center space-y-3">
        <MessageSquare className="mx-auto w-8 h-8 text-primary" />
        <h3 className="font-semibold">Still need help?</h3>
        <p className="text-sm text-muted-foreground">
          Contact our support team for assistance
        </p>
        <Button>Contact Support</Button>
      </Card>
    </div>
  );
}
