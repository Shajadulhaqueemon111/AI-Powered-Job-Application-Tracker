/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { Construction, Bell, BellCheck, ArrowLeft } from "lucide-react";

const UpcomingBilling = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-[80vh] flex flex-col justify-center items-center">
      {/* মেইন কার্ড */}
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-xl p-8 text-center relative overflow-hidden">
        {/* ব্যাকগ্রাউন্ডে হালকা গ্লো ইফেক্ট */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-70 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-70 pointer-events-none"></div>

        {/* ইন্টারঅ্যাক্টিভ অ্যানিমেটেড আইকন */}
        <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-6 relative group cursor-pointer transition-transform duration-300 hover:scale-110">
          <Construction size={40} className="animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
        </div>

        {/* টেক্সট কন্টেন্ট */}
        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide rounded-full uppercase mb-3">
          Coming Soon
        </span>

        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight sm:text-3xl">
          Upcoming Billing Feature
        </h1>

        <p className="mt-4 text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
          I'm actively building this section! Soon you'll be able to manage your
          upcoming bill details, view payment breakdowns, and track auto-debits
          all in one place.
        </p>

        {/* প্রোগ্রেস ইন্ডিকেটর */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="flex justify-between text-xs font-medium text-slate-400 mb-1.5">
            <span>Development Progress</span>
            <span>65%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[65%] rounded-full transition-all duration-500"></div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50">
          {!isSubscribed ? (
            <button
              onClick={() => setIsSubscribed(true)}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-100 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <Bell size={16} /> Notify Me
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl border border-emerald-100 animate-fade-in">
              <BellCheck size={16} className="text-emerald-600" /> You'll be
              notified!
            </div>
          )}
        </div>
      </div>

      {/* ড্যাশবোর্ডে ফিরে যাওয়ার লিংক */}
      <button className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
    </div>
  );
};

export default UpcomingBilling;
