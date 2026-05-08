// app/(dashboard)/user-dashboard/billing/BillingPage.tsx

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Crown,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Receipt,
  Zap,
  Check,
  Calendar,
  BarChart3,
  Brain,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Progress } from "@/components/ui/progress";

import { Switch } from "@/components/ui/switch";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    id: "INV-2026-001",
    date: "May 05, 2026",
    amount: "$19",
    status: "Paid",
  },
  {
    id: "INV-2026-002",
    date: "April 05, 2026",
    amount: "$19",
    status: "Paid",
  },
];

const features = [
  {
    title: "AI Resume Matcher",
    free: "5/day",
    pro: "Unlimited",
  },
  {
    title: "Analytics",
    free: "Basic",
    pro: "Advanced AI Analytics",
  },
  {
    title: "Resume Scan",
    free: "Limited",
    pro: "Deep AI Review",
  },
  {
    title: "Priority Alerts",
    free: "No",
    pro: "Yes",
  },
];

export default function BillingPage() {
  const [yearly, setYearly] = useState(false);

  const price = useMemo(() => {
    return yearly ? "$149/year" : "$19/month";
  }, [yearly]);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-blue-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-white">
      {/* TOP GLOW */}
      <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-500/20 blur-3xl" />

      <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative z-10 p-6 md:p-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
                <Crown className="text-white" />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                  Billing & Subscription
                </h1>

                <p className="text-zinc-500 mt-1">
                  Manage your premium AI career experience
                </p>
              </div>
            </div>
          </div>

          <Badge className="h-10 px-5 text-sm rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
            PRO MEMBER
          </Badge>
        </motion.div>

        {/* TOP GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* CURRENT PLAN */}
          <Card className="lg:col-span-2 rounded-3xl border-0 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-blue-500" />

                    <h2 className="text-2xl font-bold">Current Plan: Pro AI</h2>
                  </div>

                  <p className="text-zinc-500">
                    Unlock unlimited AI matching, analytics and premium career
                    tools.
                  </p>

                  <div className="flex items-center gap-3 mt-5">
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      Active
                    </Badge>

                    <div className="flex items-center gap-1 text-sm text-zinc-500">
                      <Calendar size={15} />
                      Renews on Jun 05, 2026
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 text-sm">Monthly</span>

                    <Switch checked={yearly} onCheckedChange={setYearly} />

                    <span className="text-zinc-500 text-sm">Yearly</span>
                  </div>

                  <motion.div
                    key={price}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black"
                  >
                    {price}
                  </motion.div>

                  <Button className="rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 text-white shadow-xl">
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI CREDITS */}
          <Card className="rounded-3xl border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm">AI Credits Remaining</p>

                  <h2 className="text-5xl font-black mt-3">86%</h2>
                </div>

                <div className="p-3 rounded-2xl bg-white/20">
                  <Zap />
                </div>
              </div>

              <Progress value={86} className="mt-6 h-3" />

              <p className="mt-4 text-sm text-white/80">
                430 / 500 AI requests used this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* PAYMENT METHODS */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* STRIPE */}
          <motion.div whileHover={{ y: -3 }}>
            <Card className="rounded-3xl border-0 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-blue-500" />

                      <h2 className="text-xl font-bold">Stripe Payment</h2>
                    </div>

                    <p className="text-zinc-500 mt-2">
                      Secure international payment gateway
                    </p>
                  </div>

                  <Badge className="bg-blue-500 text-white border-0">
                    Recommended
                  </Badge>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="text-green-500" size={16} />
                    Visa / Mastercard support
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Check className="text-green-500" size={16} />
                    Apple Pay & Google Pay
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Check className="text-green-500" size={16} />
                    Fast secure checkout
                  </div>
                </div>

                <Button className="w-full mt-6 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  Pay with Stripe
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* SSL */}
          <motion.div whileHover={{ y: -3 }}>
            <Card className="rounded-3xl border-0 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-green-500" />

                      <h2 className="text-xl font-bold">SSLCommerz</h2>
                    </div>

                    <p className="text-zinc-500 mt-2">
                      Bangladesh local payment gateway
                    </p>
                  </div>

                  <Badge className="bg-green-500 text-white border-0">
                    Local
                  </Badge>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="text-green-500" size={16} />
                    bKash / Nagad / Rocket
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Check className="text-green-500" size={16} />
                    Bank & card payments
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Check className="text-green-500" size={16} />
                    Fast mobile checkout
                  </div>
                </div>

                <Button className="w-full mt-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  Pay with SSLCommerz
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mt-6">
          {[
            {
              icon: Brain,
              label: "AI Matches",
              value: "1,284",
            },
            {
              icon: BarChart3,
              label: "Analytics Views",
              value: "842",
            },
            {
              icon: Receipt,
              label: "Invoices",
              value: "12",
            },
            {
              icon: Star,
              label: "Profile Score",
              value: "92%",
            },
          ].map((item, i) => (
            <motion.div whileHover={{ scale: 1.03 }} key={i}>
              <Card className="rounded-3xl border-0 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-zinc-500 text-sm">{item.label}</p>

                      <h2 className="text-3xl font-black mt-2">{item.value}</h2>
                    </div>

                    <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <item.icon />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FEATURES */}
        <Card className="mt-6 rounded-3xl border-0 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            <h2 className="text-2xl font-black mb-6">
              Premium Features Comparison
            </h2>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Free</TableHead>
                    <TableHead>Pro</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {features.map((feature, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {feature.title}
                      </TableCell>

                      <TableCell>{feature.free}</TableCell>

                      <TableCell className="text-blue-500 font-semibold">
                        {feature.pro}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* INVOICES */}
        <Card className="mt-6 rounded-3xl border-0 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Payment History</h2>

              <Button variant="outline" className="rounded-2xl">
                Download Invoices
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>

                      <TableCell>{invoice.date}</TableCell>

                      <TableCell>{invoice.amount}</TableCell>

                      <TableCell>
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          {invoice.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
