/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Send,
  Paperclip,
  FileText,
  Image as ImageIcon,
  File,
  X,
  Moon,
  Sun,
  Loader2,
  Phone,
  Video,
  MoreVertical,
  Briefcase,
} from "lucide-react";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
import { useGetApplicationsQuery } from "@/app/redux/features/application/application-api";
import {
  useCreateChatMessageMutation,
  useGetChatMessagesQuery,
} from "@/app/redux/features/chat-message/message";
import Image from "next/image";
import { socket } from "@/app/lib/soket"; // ✅ socket import যোগ করা হয়েছে

/* ───────────────────────── Types ───────────────────────────── */

type AttachmentType = "image" | "pdf" | "doc";

type Attachment = {
  file: File;
  type: AttachmentType;
  previewUrl?: string;
};

type Conversation = {
  applicationId: string;
  hrId: string | { _id: string };
  hrName: string;
  hrEmail: string;
  hrAvatar?: string;
  companyName?: string;
  companyLogo?: string;
  jobTitle?: string;
};

type Message = {
  _id: string;
  senderId: any;
  applicationId?: string; // ✅ applicationId যোগ করা হয়েছে
  receiverId: any;
  message: string;
  createdAt: string;
  attachments?: { url: string; type: AttachmentType; name: string }[];
};

/* ───────────────────────── Hooks ───────────────────────────── */

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ───────────────────────── Utils ───────────────────────────── */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getAttachmentIcon(type: AttachmentType) {
  if (type === "image") return <ImageIcon size={14} />;
  if (type === "pdf") return <FileText size={14} />;
  return <File size={14} />;
}

function detectFileType(file: File): AttachmentType {
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";
  return "doc";
}

const AVATAR_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#06b6d4",
  "#84cc16",
];
function avatarColor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

/* ───────────────────────── Avatar ──────────────────────────── */

function Avatar({
  name,
  src,
  seed,
  size = 40,
  dot,
}: {
  name: string;
  src?: string;
  seed: string;
  size?: number;
  dot?: boolean;
}) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {src ? (
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            width: size,
            height: size,
          }}
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: avatarColor(seed),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.36,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: "0.02em",
            flexShrink: 0,
          }}
        >
          {getInitials(name)}
        </div>
      )}
      {dot && (
        <span
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: size * 0.27,
            height: size * 0.27,
            borderRadius: "50%",
            background: "#22c55e",
            border: "2px solid var(--bg-primary)",
          }}
        />
      )}
    </div>
  );
}

/* ───────────────────────── Skeleton ────────────────────────── */

function SkeletonItem() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 12,
        marginBottom: 4,
      }}
    >
      <div
        className="uc-skeleton"
        style={{ width: 46, height: 46, borderRadius: "50%", flexShrink: 0 }}
      />
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}
      >
        <div
          className="uc-skeleton"
          style={{ height: 13, width: "55%", borderRadius: 6 }}
        />
        <div
          className="uc-skeleton"
          style={{ height: 11, width: "75%", borderRadius: 6 }}
        />
        <div
          className="uc-skeleton"
          style={{ height: 10, width: "40%", borderRadius: 6 }}
        />
      </div>
    </div>
  );
}

/* ───────────────────────── Company Logo ────────────────────── */

function CompanyBadge({
  logo,
  name,
  size = 32,
}: {
  logo?: string;
  name?: string;
  size?: number;
}) {
  if (logo) {
    return (
      <Image
        src={logo}
        alt={name ?? "Company"}
        width={size}
        height={size}
        style={{
          borderRadius: 8,
          objectFit: "contain",
          background: "#fff",
          border: "1px solid var(--border)",
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        background: "var(--accent-light)",
        color: "var(--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 700,
      }}
    >
      {(name ?? "C")[0]}
    </div>
  );
}

/* ───────────────────────── Main Component ──────────────────── */

export default function UserChatPage() {
  const [dark, setDark] = useState(false);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [sending, setSending] = useState(false);

  // ✅ localMessages state — socket real-time update এখানে হবে
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ✅ selectedConv ref — socket handler-এ stale closure এড়াতে
  const selectedConvRef = useRef<Conversation | null>(null);
  useEffect(() => {
    selectedConvRef.current = selectedConv;
  }, [selectedConv]);

  /* Auth */
  const { data: meData } = useGetMeQuery();
  const userId = meData?.data?.user?._id;
  const userName: string = meData?.data?.user?.name ?? "Me";
  const userAvatar: string | undefined = meData?.data?.user?.avatar;

  /* Applications */
  const { data: appData, isLoading: appLoading } = useGetApplicationsQuery({
    userId,
  });
  const rawApps =
    appData?.data?.data ??
    appData?.data?.applications ??
    appData?.data ??
    appData ??
    [];
  const applications: any[] = Array.isArray(rawApps) ? rawApps : [];

  function toConversation(app: any): Conversation {
    const job = app?.jobId ?? {};
    const company = job?.company ?? {};
    console.log(app);
    console.log(job);
    console.log("hrId =", job?.hrId);
    console.log("createdBy =", job?.createdBy);
    console.log("companyId =", company?._id);
    return {
      applicationId: app?._id,
      hrId: job?.hrId ?? job?.createdBy ?? company?._id ?? "",
      hrName: company?.name ?? job?.hrName ?? "HR Team",
      hrEmail: job?.hrEmail ?? company?.email ?? "",
      hrAvatar: company?.logo,
      companyName: company?.name,
      companyLogo: company?.logo,
      jobTitle: job?.title ?? app?.jobTitle ?? "",
    };
  }

  /* Messages — initial DB load */
  const { data: msgData } = useGetChatMessagesQuery(
    selectedConv?.applicationId,
    { skip: !selectedConv },
  );

  const [sendMessage] = useCreateChatMessageMutation();

  // ✅ DB থেকে messages load হলে localMessages সেট করো
  useEffect(() => {
    if (!msgData) return;
    const incoming: Message[] = Array.isArray(msgData.data)
      ? msgData.data
      : (msgData.data?.messages ?? msgData.data?.data ?? []);
    setLocalMessages(incoming);
  }, [msgData]);

  // ✅ Conversation পরিবর্তন হলে localMessages clear করো
  useEffect(() => {
    setLocalMessages([]);
  }, [selectedConv?.applicationId]);

  /* ══════════════════════════════════════════════════
     SOCKET.IO — real-time setup
  ══════════════════════════════════════════════════ */

  useEffect(() => {
    if (!userId) return;

    socket.on("connect", () => {
      socket.emit("register", userId);
      if (selectedConv?.applicationId) {
        socket.emit("joinRoom", selectedConv.applicationId);
      }
    });

    const handleNewMessage = (newMsg: Message) => {
      const current = selectedConvRef.current;

      if (
        !current ||
        String(newMsg.applicationId) !== String(current.applicationId)
      ) {
        return;
      }
      setLocalMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev; // duplicate এড়াও
        return [...prev, newMsg];
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [userId]); // ✅ শুধু userId-এর উপর depend করো

  // ✅ Room join/leave
  useEffect(() => {
    if (!selectedConv?.applicationId) return;
    socket.emit("joinRoom", selectedConv.applicationId);
    return () => {
      socket.emit("leaveRoom", selectedConv.applicationId);
    };
  }, [selectedConv?.applicationId]);

  /* Scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  /* Auto-resize textarea */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [text]);

  const isOutgoing = (msg: Message) => {
    if (!userId) return false;
    const sid =
      typeof msg.senderId === "object" ? msg.senderId?._id : msg.senderId;
    return sid === userId;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = detectFileType(file);
    const previewUrl = type === "image" ? URL.createObjectURL(file) : undefined;
    setAttachment({ file, type, previewUrl });
    e.target.value = "";
  };

  /* ✅ Send — with optimistic update */
  const handleSend = useCallback(async () => {
    if ((!text.trim() && !attachment) || !selectedConv) return;
    setSending(true);

    const optimisticId = `temp_${Date.now()}`;
    const optimisticMsg: Message = {
      _id: optimisticId,
      senderId: userId,
      receiverId: selectedConv.hrId,
      applicationId: selectedConv.applicationId,
      message: text,
      createdAt: new Date().toISOString(),
      attachments: [],
    };

    // নিজের message সাথে সাথে দেখাও
    setLocalMessages((prev) => [...prev, optimisticMsg]);

    try {
      const result = await sendMessage({
        receiverId:
          typeof selectedConv.hrId === "object"
            ? selectedConv.hrId._id
            : selectedConv.hrId,

        applicationId: selectedConv.applicationId,
        message: text,
        ...(attachment ? { file: attachment.file } : {}),
      }).unwrap();

      // সার্ভার থেকে real message দিয়ে replace করো
      const sentMsg =
        result?.data?.message ?? result?.data ?? result?.message ?? result;
      if (sentMsg?._id) {
        setLocalMessages((prev) =>
          prev.map((m) => (m._id === optimisticId ? sentMsg : m)),
        );
      }

      setText("");
      setAttachment(null);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Error হলে optimistic message সরিয়ে দাও
      setLocalMessages((prev) => prev.filter((m) => m._id !== optimisticId));
    } finally {
      setSending(false);
    }
  }, [text, attachment, selectedConv, sendMessage, userId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // localMessages থেকে date-grouped messages তৈরি করো (DB messages নয়)
  const groupedMessages = localMessages.reduce(
    (acc: Record<string, Message[]>, msg) => {
      const label = msg._id.startsWith("temp_")
        ? "Today"
        : formatDate(msg.createdAt);
      if (!acc[label]) acc[label] = [];
      acc[label].push(msg);
      return acc;
    },
    {},
  );

  /* Theme */
  const theme = dark
    ? {
        "--bg-primary": "#0f1117",
        "--bg-secondary": "#161b27",
        "--bg-tertiary": "#1e2536",
        "--bg-hover": "#232b3e",
        "--bg-active": "#2a3350",
        "--text-primary": "#f1f5f9",
        "--text-secondary": "#94a3b8",
        "--text-muted": "#64748b",
        "--border": "rgba(255,255,255,0.07)",
        "--border-strong": "rgba(255,255,255,0.12)",
        "--accent": "#3b82f6",
        "--accent-light": "rgba(59,130,246,0.15)",
        "--bubble-me": "#3b82f6",
        "--bubble-me-text": "#ffffff",
        "--bubble-hr": "#1e2a42",
        "--bubble-hr-text": "#e2e8f0",
        "--input-bg": "#1e2536",
        "--scrollbar": "#2a3350",
        "--skeleton": "#1e2536",
      }
    : {
        "--bg-primary": "#ffffff",
        "--bg-secondary": "#f8fafc",
        "--bg-tertiary": "#f1f5f9",
        "--bg-hover": "#f0f4ff",
        "--bg-active": "#e0eaff",
        "--text-primary": "#0f172a",
        "--text-secondary": "#475569",
        "--text-muted": "#94a3b8",
        "--border": "rgba(0,0,0,0.07)",
        "--border-strong": "rgba(0,0,0,0.13)",
        "--accent": "#3b82f6",
        "--accent-light": "rgba(59,130,246,0.10)",
        "--bubble-me": "#3b82f6",
        "--bubble-me-text": "#ffffff",
        "--bubble-hr": "#f1f5f9",
        "--bubble-hr-text": "#1e293b",
        "--input-bg": "#f8fafc",
        "--scrollbar": "#e2e8f0",
        "--skeleton": "#e9edf2",
      };

  return (
    <div style={theme as React.CSSProperties} className="uc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .uc-root {
          font-family: 'DM Sans', sans-serif;
          height: 100dvh; display: flex;
          background: var(--bg-primary); color: var(--text-primary);
          overflow: hidden; transition: background 0.25s, color 0.25s;
        }

        .uc-sidebar {
          width: 330px; min-width: 290px;
          border-right: 1px solid var(--border-strong);
          display: flex; flex-direction: column;
          background: var(--bg-secondary); transition: background 0.25s;
        }
        .uc-sidebar-header { padding: 18px 18px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
        .uc-sidebar-title { font-size: 16px; font-weight: 600; color: var(--text-primary); letter-spacing: -0.02em; flex: 1; }
        .uc-badge { font-size: 11px; background: var(--accent-light); color: var(--accent); padding: 2px 9px; border-radius: 20px; font-weight: 600; }
        .uc-icon-btn { width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--border-strong); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: background 0.15s, color 0.15s; flex-shrink: 0; }
        .uc-icon-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

        .uc-list { flex: 1; overflow-y: auto; padding: 6px 8px 8px; }
        .uc-list::-webkit-scrollbar { width: 3px; }
        .uc-list::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 4px; }

        .uc-section-label { font-size: 10px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: var(--text-muted); padding: 8px 12px 4px; }

        .uc-conv-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 12px; cursor: pointer; transition: background 0.15s; margin-bottom: 3px; border: 1px solid transparent; }
        .uc-conv-item:hover { background: var(--bg-hover); }
        .uc-conv-item.active { background: var(--bg-active); border-color: rgba(59,130,246,0.25); }

        .uc-conv-logo { flex-shrink: 0; }
        .uc-conv-info { flex: 1; min-width: 0; }
        .uc-conv-company { font-size: 13.5px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .uc-conv-job { font-size: 11.5px; color: var(--accent); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
        .uc-conv-status { font-size: 10.5px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }

        .uc-no-result { text-align: center; padding: 40px 16px; color: var(--text-muted); font-size: 13px; display: flex; flex-direction: column; align-items: center; gap: 8px; }

        .uc-chat { flex: 1; display: flex; flex-direction: column; min-width: 0; background: var(--bg-primary); }

        .uc-chat-header { padding: 0 20px; height: 68px; border-bottom: 1px solid var(--border-strong); display: flex; align-items: center; gap: 12px; background: var(--bg-primary); flex-shrink: 0; }
        .uc-chat-hinfo { flex: 1; min-width: 0; }
        .uc-chat-hname { font-size: 15px; font-weight: 600; color: var(--text-primary); letter-spacing: -0.01em; }
        .uc-chat-hsub { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
        .uc-chat-hactions { display: flex; align-items: center; gap: 4px; }

        .uc-messages { flex: 1; overflow-y: auto; padding: 20px 24px 12px; display: flex; flex-direction: column; gap: 2px; }
        .uc-messages::-webkit-scrollbar { width: 3px; }
        .uc-messages::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 4px; }

        .uc-date-divider { display: flex; align-items: center; gap: 10px; margin: 14px 0 10px; }
        .uc-date-line { flex: 1; height: 1px; background: var(--border); }
        .uc-date-label { font-size: 11px; color: var(--text-muted); font-weight: 500; padding: 0 6px; white-space: nowrap; }

        .uc-msg-row { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 6px; }
        .uc-msg-row.me { flex-direction: row-reverse; }

        .uc-msg-content { display: flex; flex-direction: column; max-width: 62%; }
        .uc-msg-row.me .uc-msg-content { align-items: flex-end; }
        .uc-msg-row.hr .uc-msg-content { align-items: flex-start; }

        .uc-sender-name { font-size: 11px; font-weight: 500; color: var(--text-muted); margin-bottom: 3px; padding: 0 4px; }

        .uc-bubble { padding: 10px 14px; border-radius: 18px; font-size: 14px; line-height: 1.6; word-break: break-word; display: inline-block; max-width: 100%; }
        .uc-bubble.me { background: var(--bubble-me); color: var(--bubble-me-text); border-bottom-right-radius: 5px; }
        .uc-bubble.hr { background: var(--bubble-hr); color: var(--bubble-hr-text); border-bottom-left-radius: 5px; }

        /* Optimistic message */
        .uc-msg-row.optimistic .uc-bubble { opacity: 0.7; }

        .uc-msg-meta { display: flex; align-items: center; gap: 4px; margin-top: 4px; padding: 0 4px; }
        .uc-msg-row.me .uc-msg-meta { flex-direction: row-reverse; }
        .uc-msg-time { font-size: 10.5px; color: var(--text-muted); }

        .uc-att-thumb { width: 180px; border-radius: 10px; overflow: hidden; margin-bottom: 6px; cursor: pointer; }
        .uc-att-thumb img { width: 100%; display: block; }
        .uc-att-doc { display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.08); padding: 8px 10px; border-radius: 8px; margin-bottom: 6px; font-size: 12px; cursor: pointer; }
        .uc-bubble.me .uc-att-doc { background: rgba(255,255,255,0.18); }

        .uc-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
        .uc-empty-icon { width: 72px; height: 72px; border-radius: 22px; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; }
        .uc-empty-title { font-size: 15px; font-weight: 500; color: var(--text-secondary); }
        .uc-empty-sub { font-size: 13px; text-align: center; max-width: 240px; line-height: 1.55; color: var(--text-muted); }

        .uc-input-area { padding: 10px 18px 18px; background: var(--bg-primary); border-top: 1px solid var(--border); flex-shrink: 0; }
        .uc-att-preview { display: flex; align-items: center; gap: 10px; background: var(--accent-light); border: 1px solid var(--accent); border-radius: 10px; padding: 7px 12px; margin-bottom: 8px; }
        .uc-att-preview-name { font-size: 13px; font-weight: 500; color: var(--accent); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .uc-att-preview-img { width: 36px; height: 36px; border-radius: 6px; object-fit: cover; }
        .uc-att-remove { width: 22px; height: 22px; border-radius: 6px; border: none; background: transparent; cursor: pointer; color: var(--accent); display: flex; align-items: center; justify-content: center; padding: 0; }
        .uc-att-remove:hover { background: var(--accent-light); }
        .uc-input-row { display: flex; align-items: flex-end; gap: 8px; background: var(--input-bg); border: 1px solid var(--border-strong); border-radius: 15px; padding: 7px 7px 7px 13px; transition: border 0.15s; }
        .uc-input-row:focus-within { border-color: var(--accent); }
        .uc-textarea { flex: 1; background: transparent; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-primary); resize: none; line-height: 1.55; padding: 3px 0; min-height: 22px; max-height: 120px; }
        .uc-textarea::placeholder { color: var(--text-muted); }
        .uc-send-btn { width: 36px; height: 36px; border-radius: 11px; border: none; background: var(--accent); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: opacity 0.15s, transform 0.1s; }
        .uc-send-btn:hover { opacity: 0.88; }
        .uc-send-btn:active { transform: scale(0.93); }
        .uc-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .uc-attach-btn { width: 30px; height: 30px; border-radius: 8px; border: none; background: transparent; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center; padding: 0; flex-shrink: 0; transition: color 0.15s, background 0.15s; }
        .uc-attach-btn:hover { color: var(--accent); background: var(--accent-light); }

        .uc-skeleton { background: linear-gradient(90deg, var(--skeleton) 25%, var(--bg-hover) 50%, var(--skeleton) 75%); background-size: 200% 100%; animation: uc-shimmer 1.4s infinite; }
        @keyframes uc-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @media (max-width: 768px) {
          .uc-sidebar { width: 100%; min-width: unset; position: absolute; inset: 0; z-index: 10; border-right: none; }
          .uc-sidebar.uc-hidden { display: none; }
          .uc-back-btn { display: flex !important; }
          .uc-msg-content { max-width: 82%; }
        }
        .uc-back-btn { display: none; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--border-strong); background: transparent; cursor: pointer; color: var(--text-secondary); }
        .uc-back-btn:hover { background: var(--bg-hover); }
      `}</style>

      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside className={`uc-sidebar ${selectedConv ? "uc-hidden" : ""}`}>
        <div className="uc-sidebar-header">
          <span className="uc-sidebar-title">My Applications</span>
          {applications.length > 0 && (
            <span className="uc-badge">{applications.length}</span>
          )}
          <button
            className="uc-icon-btn"
            onClick={() => setDark((d) => !d)}
            title="Toggle theme"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        <div className="uc-list">
          {appLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonItem key={i} />)
          ) : applications.length === 0 ? (
            <div className="uc-no-result">
              <Briefcase size={28} style={{ opacity: 0.3 }} />
              <div>No applications yet</div>
              <div style={{ fontSize: 12 }}>
                Apply for jobs to start conversations with HR
              </div>
            </div>
          ) : (
            <>
              <div className="uc-section-label">
                Active Conversations · {applications.length}
              </div>
              {applications.map((app: any) => {
                const conv = toConversation(app);
                const isActive =
                  selectedConv?.applicationId === conv.applicationId;
                return (
                  <div
                    key={conv.applicationId}
                    className={`uc-conv-item ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedConv(conv)}
                  >
                    <div className="uc-conv-logo">
                      <CompanyBadge
                        logo={conv.companyLogo}
                        name={conv.companyName}
                        size={44}
                      />
                    </div>
                    <div className="uc-conv-info">
                      <div className="uc-conv-company">
                        {conv.companyName ?? "Company"}
                      </div>
                      <div className="uc-conv-job">↳ {conv.jobTitle}</div>
                      <div className="uc-conv-status">
                        {app?.status ?? "Applied"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </aside>

      {/* ═══════════ CHAT ═══════════ */}
      <main className="uc-chat">
        {selectedConv ? (
          <>
            <div className="uc-chat-header">
              <button
                className="uc-back-btn"
                onClick={() => setSelectedConv(null)}
                title="Back"
              >
                ←
              </button>
              <CompanyBadge
                logo={selectedConv.companyLogo}
                name={selectedConv.companyName}
                size={44}
              />
              <div className="uc-chat-hinfo">
                <div className="uc-chat-hname">
                  {selectedConv.companyName ?? "HR Team"}
                </div>
                <div className="uc-chat-hsub">
                  {selectedConv.jobTitle && `${selectedConv.jobTitle} · `}HR
                  Recruiter
                </div>
              </div>
              <div className="uc-chat-hactions">
                <button className="uc-icon-btn" title="Voice call">
                  <Phone size={15} />
                </button>
                <button className="uc-icon-btn" title="Video call">
                  <Video size={15} />
                </button>
                <button
                  className="uc-icon-btn"
                  onClick={() => setDark((d) => !d)}
                  title="Theme"
                >
                  {dark ? <Sun size={15} /> : <Moon size={15} />}
                </button>
                <button className="uc-icon-btn" title="More">
                  <MoreVertical size={15} />
                </button>
              </div>
            </div>

            <div className="uc-messages">
              {localMessages.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: 13,
                    margin: "24px 0",
                  }}
                >
                  No messages yet. Say hello! 👋
                </div>
              )}

              {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
                <div key={dateLabel}>
                  <div className="uc-date-divider">
                    <div className="uc-date-line" />
                    <span className="uc-date-label">{dateLabel}</span>
                    <div className="uc-date-line" />
                  </div>
                  {msgs.map((msg) => {
                    const out = isOutgoing(msg);
                    const isOptimistic = msg._id.startsWith("temp_");
                    return (
                      <div
                        key={msg._id}
                        className={`uc-msg-row ${out ? "me" : "hr"} ${isOptimistic ? "optimistic" : ""}`}
                      >
                        {!out ? (
                          <CompanyBadge
                            logo={selectedConv.companyLogo}
                            name={selectedConv.companyName}
                            size={28}
                          />
                        ) : (
                          <Avatar
                            name={userName}
                            src={userAvatar}
                            seed={userId ?? "me"}
                            size={28}
                          />
                        )}
                        <div className="uc-msg-content">
                          <span className="uc-sender-name">
                            {out ? "You" : (selectedConv.companyName ?? "HR")}
                          </span>
                          <div className={`uc-bubble ${out ? "me" : "hr"}`}>
                            {msg.attachments?.map((att, j) =>
                              att.type === "image" ? (
                                <div key={j} className="uc-att-thumb">
                                  <Image
                                    src={att.url}
                                    alt={att.name}
                                    width={180}
                                    height={120}
                                    style={{ width: "100%", height: "auto" }}
                                  />
                                </div>
                              ) : (
                                <div key={j} className="uc-att-doc">
                                  {getAttachmentIcon(att.type)}
                                  <span>{att.name}</span>
                                </div>
                              ),
                            )}
                            {msg.message}
                          </div>
                          <div className="uc-msg-meta">
                            <span className="uc-msg-time">
                              {isOptimistic
                                ? "Sending…"
                                : formatTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="uc-input-area">
              {attachment && (
                <div className="uc-att-preview">
                  {attachment.previewUrl ? (
                    <Image
                      src={attachment.previewUrl}
                      alt="preview"
                      width={36}
                      height={36}
                      className="uc-att-preview-img"
                      style={{
                        width: 36,
                        height: 36,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    getAttachmentIcon(attachment.type)
                  )}
                  <span className="uc-att-preview-name">
                    {attachment.file.name}
                  </span>
                  <button
                    className="uc-att-remove"
                    onClick={() => setAttachment(null)}
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
              <div className="uc-input-row">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <button
                  className="uc-attach-btn"
                  title="Attach"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={17} />
                </button>
                <textarea
                  ref={textareaRef}
                  className="uc-textarea"
                  placeholder="Reply to HR… (Enter to send)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button
                  className="uc-send-btn"
                  onClick={handleSend}
                  disabled={sending || (!text.trim() && !attachment)}
                >
                  {sending ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="uc-empty">
            <div className="uc-empty-icon">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <span className="uc-empty-title">No conversation selected</span>
            <span className="uc-empty-sub">
              Select a company from the sidebar to view and reply to HR
              messages.
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
