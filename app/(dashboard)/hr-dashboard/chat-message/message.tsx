/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Send,
  Search,
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
  Users,
} from "lucide-react";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
import { useGetApplicationsQuery } from "@/app/redux/features/application/application-api";
import {
  useCreateChatMessageMutation,
  useGetChatMessagesQuery,
} from "@/app/redux/features/chat-message/message";
import Image from "next/image";
import { socket } from "@/app/lib/soket";

/* ─────────────────────────── Types ─────────────────────────── */

type AttachmentType = "image" | "pdf" | "doc";

type Attachment = {
  file: File;
  type: AttachmentType;
  previewUrl?: string;
};

type SelectedUser = {
  applicationId: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  jobTitle?: string;
  status?: string;
};

type Message = {
  _id: string;
  senderId: any;
  applicationId?: string;
  receiverId: any;
  message: string;
  createdAt: string;
  attachments?: { url: string; type: AttachmentType; name: string }[];
};

/* ─────────────────────── Helper utils ─────────────────────── */

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

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
  let hash = 0;
  for (let i = 0; i < seed.length; i++)
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/* ──────────────────────── Avatar ────────────────────────────── */

function Avatar({
  name,
  avatarUrl,
  seed,
  size = 40,
  showDot,
}: {
  name: string;
  avatarUrl?: string;
  seed: string;
  size?: number;
  showDot?: boolean;
}) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            objectFit: "cover",
          }}
          width={size}
          height={size}
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
      {showDot && (
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

/* ──────────────────────── Skeleton ──────────────────────────── */

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
        className="skeleton"
        style={{ width: 42, height: 42, borderRadius: "50%", flexShrink: 0 }}
      />
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}
      >
        <div
          className="skeleton"
          style={{ height: 13, width: "60%", borderRadius: 6 }}
        />
        <div
          className="skeleton"
          style={{ height: 11, width: "80%", borderRadius: 6 }}
        />
      </div>
    </div>
  );
}

/* ──────────────────────── Main ──────────────────────────────── */

export default function HRChatPage() {
  const [dark, setDark] = useState(true);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [sending, setSending] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // selectedUser ref — socket handler-এ stale closure এড়াতে
  const selectedUserRef = useRef<SelectedUser | null>(null);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const debouncedSearch = useDebounce(search, 400);

  /* ── Auth / HR identity ── */
  const { data: meData } = useGetMeQuery();
  const hrId = meData?.data?.user?._id;
  const hrName: string = meData?.data?.user?.name ?? "HR";

  /* ── Applications list ── */
  const { data: appData, isLoading: appLoading } = useGetApplicationsQuery(
    { hrId, search: debouncedSearch || undefined, page },
    { skip: !hrId },
  );

  const rawAppData =
    appData?.data?.data ??
    appData?.data?.applications ??
    appData?.data ??
    appData ??
    [];
  const applications: any[] = Array.isArray(rawAppData) ? rawAppData : [];

  /* ── Messages for selected conversation (initial DB load) ── */
  const { data: msgData, refetch } = useGetChatMessagesQuery(
    selectedUser?.applicationId,
    { skip: !selectedUser },
  );

  const [sendMessage] = useCreateChatMessageMutation();

  /* ── DB থেকে initial messages load হলে localMessages সেট করো ── */
  useEffect(() => {
    if (!msgData) return;
    const incoming: Message[] = Array.isArray(msgData.data)
      ? msgData.data
      : (msgData.data?.messages ?? msgData.data?.data ?? []);
    setLocalMessages(incoming);
  }, [msgData]);

  /* ── Conversation change হলে localMessages clear করো ── */
  useEffect(() => {
    setLocalMessages([]);
  }, [selectedUser?.applicationId]);

  /* ══════════════════════════════════════════════════
     SOCKET.IO — real-time setup (FIX: একবার mount-এ listener বসাও)
  ══════════════════════════════════════════════════ */

  useEffect(() => {
    if (!hrId) return;

    // HR নিজের userId দিয়ে register করো
    socket.emit("register", hrId);

    const handleNewMessage = (newMsg: Message) => {
      const current = selectedUserRef.current;
      // বর্তমান চ্যাটের মেসেজ না হলে ignore
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
  }, [hrId]); // ✅ শুধু hrId-এর উপর depend করো, selectedUser নয়

  /* ── Room join/leave ── */
  useEffect(() => {
    if (!selectedUser?.applicationId) return;
    socket.emit("joinRoom", selectedUser.applicationId);
    return () => {
      socket.emit("leaveRoom", selectedUser.applicationId);
    };
  }, [selectedUser?.applicationId]);

  /* ── Send message ── */
  const handleSend = useCallback(async () => {
    if ((!text.trim() && !attachment) || !selectedUser) return;
    setSending(true);

    const optimisticId = `temp_${Date.now()}`;
    const optimisticMsg: Message = {
      _id: optimisticId,
      senderId: hrId,
      receiverId: selectedUser.userId,
      applicationId: selectedUser.applicationId,
      message: text,
      createdAt: new Date().toISOString(),
      attachments: [],
    };

    // Optimistic UI — নিজের message সাথে সাথে দেখাও
    setLocalMessages((prev) => [...prev, optimisticMsg]);

    try {
      const result = await sendMessage({
        receiverId: selectedUser.userId,
        applicationId: selectedUser.applicationId,
        message: text,
        ...(attachment ? { file: attachment.file } : {}),
      }).unwrap();

      // সার্ভার থেকে আসা real message দিয়ে optimistic message replace করো
      const sentMsg =
        result?.data?.message ?? result?.data ?? result?.message ?? result;

      if (sentMsg?._id) {
        setLocalMessages((prev) =>
          prev.map((m) => (m._id === optimisticId ? sentMsg : m)),
        );
      }

      setText("");
      setAttachment(null);
      refetch();
    } catch (error) {
      console.error("Failed to send message:", error);
      // Error হলে optimistic message সরিয়ে দাও
      setLocalMessages((prev) => prev.filter((m) => m._id !== optimisticId));
    } finally {
      setSending(false);
    }
  }, [text, attachment, selectedUser, sendMessage, hrId]);

  /* ── Auto-scroll ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  /* ── Auto-resize textarea ── */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [text]);

  function toSelectedUser(app: any): SelectedUser {
    return {
      applicationId: app?._id,
      userId: app?.userId ?? "",
      name: app?.fullName ?? app?.name ?? "Applicant",
      email: app?.email ?? "",
      avatar: app?.avatar ?? app?.profilePicture ?? undefined,
      jobTitle: app?.jobId?.title ?? app?.jobTitle ?? "",
    };
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = detectFileType(file);
    const previewUrl = type === "image" ? URL.createObjectURL(file) : undefined;
    setAttachment({ file, type, previewUrl });
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOutgoing = (msg: Message) => {
    if (!hrId) return true;
    const sid =
      typeof msg.senderId === "object"
        ? (msg.senderId?._id ?? msg.senderId?.id ?? "")
        : String(msg.senderId ?? "");
    return sid === hrId;
  };

  /* theme tokens */
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
        "--bubble-in": "#1e2a42",
        "--bubble-out": "#3b82f6",
        "--bubble-out-text": "#ffffff",
        "--bubble-in-text": "#e2e8f0",
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
        "--bubble-in": "#f1f5f9",
        "--bubble-out": "#3b82f6",
        "--bubble-out-text": "#ffffff",
        "--bubble-in-text": "#1e293b",
        "--input-bg": "#f8fafc",
        "--scrollbar": "#e2e8f0",
        "--skeleton": "#e9edf2",
      };

  return (
    <div style={theme as React.CSSProperties} className="hr-chat-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .hr-chat-root {
          font-family: 'DM Sans', sans-serif;
          height: 100dvh; display: flex;
          background: var(--bg-primary); color: var(--text-primary);
          overflow: hidden; transition: background 0.25s, color 0.25s;
        }

        .hrc-sidebar {
          width: 320px; min-width: 280px;
          border-right: 1px solid var(--border-strong);
          display: flex; flex-direction: column;
          background: var(--bg-secondary); transition: background 0.25s;
        }
        .hrc-sidebar-header {
          padding: 18px 18px 12px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 10px;
        }
        .hrc-sidebar-title { font-size: 16px; font-weight: 600; color: var(--text-primary); letter-spacing: -0.02em; flex: 1; }
        .hrc-count { font-size: 11px; background: var(--accent-light); color: var(--accent); padding: 2px 8px; border-radius: 20px; font-weight: 600; }
        .hrc-icon-btn {
          width: 34px; height: 34px; border-radius: 9px;
          border: 1px solid var(--border-strong); background: transparent;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary); transition: background 0.15s, color 0.15s; flex-shrink: 0;
        }
        .hrc-icon-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

        .hrc-search-wrap { padding: 10px 14px; position: relative; }
        .hrc-search-input {
          width: 100%; height: 36px;
          background: var(--bg-tertiary); border: 1px solid var(--border-strong);
          border-radius: 10px; padding: 0 12px 0 36px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: var(--text-primary); outline: none; box-sizing: border-box;
          transition: border 0.15s, background 0.25s;
        }
        .hrc-search-input::placeholder { color: var(--text-muted); }
        .hrc-search-input:focus { border-color: var(--accent); background: var(--bg-primary); }
        .hrc-search-icon { position: absolute; left: 26px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }

        .hrc-list { flex: 1; overflow-y: auto; padding: 4px 8px 8px; }
        .hrc-list::-webkit-scrollbar { width: 3px; }
        .hrc-list::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 4px; }

        .hrc-section-label { font-size: 10px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: var(--text-muted); padding: 8px 12px 4px; }

        .hrc-item {
          display: flex; align-items: center; gap: 11px;
          padding: 9px 11px; border-radius: 11px;
          cursor: pointer; transition: background 0.15s;
          margin-bottom: 2px; border: 1px solid transparent;
        }
        .hrc-item:hover { background: var(--bg-hover); }
        .hrc-item.active { background: var(--bg-active); border-color: rgba(59,130,246,0.25); }

        .hrc-item-info { flex: 1; min-width: 0; }
        .hrc-item-name { font-size: 13.5px; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hrc-item-sub { font-size: 11.5px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
        .hrc-item-job { font-size: 10.5px; color: var(--accent); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; font-weight: 500; }

        .hrc-no-result { text-align: center; padding: 32px 16px; color: var(--text-muted); font-size: 13px; }

        .hrc-chat { flex: 1; display: flex; flex-direction: column; min-width: 0; background: var(--bg-primary); transition: background 0.25s; }

        .hrc-chat-header {
          padding: 0 20px; height: 66px;
          border-bottom: 1px solid var(--border-strong);
          display: flex; align-items: center; gap: 12px;
          background: var(--bg-primary); flex-shrink: 0;
        }
        .hrc-chat-hinfo { flex: 1; min-width: 0; }
        .hrc-chat-hname { font-size: 15px; font-weight: 600; color: var(--text-primary); letter-spacing: -0.01em; }
        .hrc-chat-hsub { font-size: 12px; color: var(--text-secondary); margin-top: 1px; }
        .hrc-chat-hactions { display: flex; align-items: center; gap: 4px; }

        .hrc-messages {
          flex: 1; overflow-y: auto;
          padding: 20px 24px 12px;
          display: flex; flex-direction: column; gap: 3px;
        }
        .hrc-messages::-webkit-scrollbar { width: 3px; }
        .hrc-messages::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 4px; }

        .hrc-date-divider { display: flex; align-items: center; gap: 10px; margin: 12px 0; }
        .hrc-date-line { flex: 1; height: 1px; background: var(--border); }
        .hrc-date-label { font-size: 11px; color: var(--text-muted); font-weight: 500; padding: 0 4px; }

        .hrc-msg-row { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 6px; }
        .hrc-msg-row.out { flex-direction: row-reverse; }

        .hrc-msg-content { display: flex; flex-direction: column; max-width: 62%; }
        .hrc-msg-row.out .hrc-msg-content { align-items: flex-end; }
        .hrc-msg-row.in  .hrc-msg-content { align-items: flex-start; }

        .hrc-bubble {
          padding: 10px 14px; border-radius: 18px;
          font-size: 14px; line-height: 1.6; word-break: break-word;
          display: inline-block; max-width: 100%;
        }
        .hrc-bubble.out { background: var(--bubble-out); color: var(--bubble-out-text); border-bottom-right-radius: 5px; }
        .hrc-bubble.in  { background: var(--bubble-in);  color: var(--bubble-in-text);  border-bottom-left-radius: 5px; }
        .hrc-msg-time { font-size: 10.5px; color: var(--text-muted); margin-top: 4px; padding: 0 4px; display: block; }

        /* Optimistic message styling */
        .hrc-msg-row.optimistic .hrc-bubble { opacity: 0.7; }

        .hrc-att-thumb { width: 170px; border-radius: 10px; overflow: hidden; margin-bottom: 6px; }
        .hrc-att-thumb img { width: 100%; display: block; }
        .hrc-att-doc { display: flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.13); padding: 7px 10px; border-radius: 8px; margin-bottom: 5px; font-size: 12px; }

        .hrc-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
        .hrc-empty-icon { width: 68px; height: 68px; border-radius: 20px; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; }
        .hrc-empty-title { font-size: 15px; font-weight: 500; color: var(--text-secondary); }
        .hrc-empty-sub { font-size: 13px; text-align: center; max-width: 220px; line-height: 1.5; color: var(--text-muted); }

        .hrc-input-area { padding: 10px 18px 18px; background: var(--bg-primary); border-top: 1px solid var(--border); flex-shrink: 0; }
        .hrc-att-preview { display: flex; align-items: center; gap: 10px; background: var(--accent-light); border: 1px solid var(--accent); border-radius: 10px; padding: 7px 11px; margin-bottom: 8px; }
        .hrc-att-preview-name { font-size: 13px; font-weight: 500; color: var(--accent); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hrc-att-preview-img { width: 38px; height: 38px; border-radius: 6px; object-fit: cover; }
        .hrc-att-remove { width: 22px; height: 22px; border-radius: 6px; border: none; background: transparent; cursor: pointer; color: var(--accent); display: flex; align-items: center; justify-content: center; padding: 0; transition: background 0.15s; }
        .hrc-att-remove:hover { background: var(--accent-light); }
        .hrc-input-row { display: flex; align-items: flex-end; gap: 8px; background: var(--input-bg); border: 1px solid var(--border-strong); border-radius: 15px; padding: 7px 7px 7px 13px; transition: border 0.15s; }
        .hrc-input-row:focus-within { border-color: var(--accent); }
        .hrc-textarea { flex: 1; background: transparent; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-primary); resize: none; line-height: 1.55; padding: 3px 0; min-height: 22px; max-height: 120px; }
        .hrc-textarea::placeholder { color: var(--text-muted); }
        .hrc-send-btn { width: 36px; height: 36px; border-radius: 11px; border: none; background: var(--accent); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: opacity 0.15s, transform 0.1s; }
        .hrc-send-btn:hover { opacity: 0.88; }
        .hrc-send-btn:active { transform: scale(0.93); }
        .hrc-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .hrc-attach-btn { width: 30px; height: 30px; border-radius: 8px; border: none; background: transparent; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center; padding: 0; flex-shrink: 0; transition: color 0.15s, background 0.15s; }
        .hrc-attach-btn:hover { color: var(--accent); background: var(--accent-light); }

        .skeleton { background: var(--skeleton); animation: shimmer 1.4s infinite; background: linear-gradient(90deg, var(--skeleton) 25%, var(--bg-hover) 50%, var(--skeleton) 75%); background-size: 200% 100%; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @media (max-width: 768px) {
          .hrc-sidebar { width: 100%; min-width: unset; position: absolute; inset: 0; z-index: 10; border-right: none; }
          .hrc-sidebar.hrc-hidden { display: none; }
          .hrc-back-btn { display: flex !important; }
          .hrc-bubble { max-width: 80%; }
        }
        .hrc-back-btn { display: none; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--border-strong); background: transparent; cursor: pointer; color: var(--text-secondary); }
        .hrc-back-btn:hover { background: var(--bg-hover); }
      `}</style>

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className={`hrc-sidebar ${selectedUser ? "hrc-hidden" : ""}`}>
        <div className="hrc-sidebar-header">
          <span className="hrc-sidebar-title">Candidates</span>
          {applications.length > 0 && (
            <span className="hrc-count">{applications.length}</span>
          )}
          <button
            className="hrc-icon-btn"
            onClick={() => setDark((d) => !d)}
            title="Toggle theme"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        <div className="hrc-search-wrap">
          <Search size={14} className="hrc-search-icon" />
          <input
            className="hrc-search-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="hrc-list">
          {appLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonItem key={i} />)
          ) : applications.length === 0 ? (
            <div className="hrc-no-result">
              <Users size={28} style={{ marginBottom: 8, opacity: 0.35 }} />
              <div>No applicants found</div>
            </div>
          ) : (
            <>
              <div className="hrc-section-label">
                Interview Queue · {applications.length}
              </div>
              {applications.map((app: any) => {
                const su = toSelectedUser(app);
                const isActive =
                  selectedUser?.applicationId === su.applicationId;
                return (
                  <div
                    key={su.applicationId}
                    className={`hrc-item ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedUser(su)}
                  >
                    <Avatar
                      name={su.name}
                      avatarUrl={su.avatar}
                      seed={su.userId || su.applicationId}
                      size={42}
                    />
                    <div className="hrc-item-info">
                      <div className="hrc-item-name">{su.name}</div>
                      <div className="hrc-item-sub">{su.email}</div>
                      {su.jobTitle && (
                        <div className="hrc-item-job">↳ {su.jobTitle}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </aside>

      {/* ══════════ CHAT ══════════ */}
      <main className="hrc-chat">
        {selectedUser ? (
          <>
            <div className="hrc-chat-header">
              <button
                className="hrc-back-btn"
                onClick={() => setSelectedUser(null)}
                title="Back"
              >
                ←
              </button>
              <Avatar
                name={selectedUser.name}
                avatarUrl={selectedUser.avatar}
                seed={selectedUser.userId || selectedUser.applicationId}
                size={42}
                showDot
              />
              <div className="hrc-chat-hinfo">
                <div className="hrc-chat-hname">{selectedUser.name}</div>
                <div className="hrc-chat-hsub">
                  {selectedUser.email}
                  {selectedUser.jobTitle && ` · ${selectedUser.jobTitle}`}
                </div>
              </div>
              <div className="hrc-chat-hactions">
                <button className="hrc-icon-btn" title="Voice call">
                  <Phone size={15} />
                </button>
                <button className="hrc-icon-btn" title="Video call">
                  <Video size={15} />
                </button>
                <button
                  className="hrc-icon-btn"
                  onClick={() => setDark((d) => !d)}
                  title="Theme"
                >
                  {dark ? <Sun size={15} /> : <Moon size={15} />}
                </button>
                <button className="hrc-icon-btn" title="More">
                  <MoreVertical size={15} />
                </button>
              </div>
            </div>

            <div className="hrc-messages">
              {localMessages.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: 13,
                    marginTop: 20,
                  }}
                >
                  No messages yet — start the conversation!
                </div>
              )}
              <div className="hrc-date-divider">
                <div className="hrc-date-line" />
                <span className="hrc-date-label">Today</span>
                <div className="hrc-date-line" />
              </div>

              {localMessages.map((msg) => {
                const out = isOutgoing(msg);
                const isOptimistic = msg._id.startsWith("temp_");
                return (
                  <div
                    key={msg._id}
                    className={`hrc-msg-row ${out ? "out" : "in"} ${isOptimistic ? "optimistic" : ""}`}
                  >
                    {!out && (
                      <Avatar
                        name={selectedUser.name}
                        avatarUrl={selectedUser.avatar}
                        seed={selectedUser.userId}
                        size={26}
                      />
                    )}
                    <div className="hrc-msg-content">
                      <div className={`hrc-bubble ${out ? "out" : "in"}`}>
                        {msg.attachments?.map((att, j) =>
                          att.type === "image" ? (
                            <div key={j} className="hrc-att-thumb">
                              <Image
                                src={att.url}
                                alt={att.name}
                                width={170}
                                height={120}
                                style={{ width: "100%", height: "auto" }}
                              />
                            </div>
                          ) : (
                            <div key={j} className="hrc-att-doc">
                              {getAttachmentIcon(att.type)}
                              <span>{att.name}</span>
                            </div>
                          ),
                        )}
                        {msg.message}
                      </div>
                      <span className="hrc-msg-time">
                        {isOptimistic ? "Sending…" : formatTime(msg.createdAt)}
                      </span>
                    </div>
                    {out && (
                      <Avatar name={hrName} seed={hrId ?? "hr"} size={26} />
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="hrc-input-area">
              {attachment && (
                <div className="hrc-att-preview">
                  {attachment.previewUrl ? (
                    <Image
                      src={attachment.previewUrl}
                      className="hrc-att-preview-img"
                      alt="preview"
                      width={38}
                      height={38}
                      style={{
                        width: 38,
                        height: 38,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    getAttachmentIcon(attachment.type)
                  )}
                  <span className="hrc-att-preview-name">
                    {attachment.file.name}
                  </span>
                  <button
                    className="hrc-att-remove"
                    onClick={() => setAttachment(null)}
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
              <div className="hrc-input-row">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <button
                  className="hrc-attach-btn"
                  title="Attach file"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={17} />
                </button>
                <textarea
                  ref={textareaRef}
                  className="hrc-textarea"
                  placeholder="Type a message… (Enter to send)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button
                  className="hrc-send-btn"
                  onClick={handleSend}
                  disabled={sending || (!text.trim() && !attachment)}
                  title="Send"
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
          <div className="hrc-empty">
            <div className="hrc-empty-icon">
              <svg
                width="32"
                height="32"
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
            <span className="hrc-empty-title">No conversation selected</span>
            <span className="hrc-empty-sub">
              Select a candidate from the list to begin chatting.
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
