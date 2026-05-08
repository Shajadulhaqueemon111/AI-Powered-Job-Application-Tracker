"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Image as ImageIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Message = {
  id: number;
  sender: "user" | "ai";
  text?: string;
  image?: string;
  time: string;
  seen?: boolean;
};

export default function ChatPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hi 👋 I am your AI Career Assistant",
      time: new Date().toLocaleTimeString(),
      seen: true,
    },
  ]);

  const [input, setInput] = useState("");

  // delete modal
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // SEND TEXT
  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString(),
      seen: false,
    };

    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "Got it 👍 AI processing...",
          time: new Date().toLocaleTimeString(),
          seen: true,
        },
      ]);
    }, 800);

    setInput("");
  };

  // IMAGE (optional kept simple)
  const handleImage = (file: File | undefined) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "user",
          image: reader.result as string,
          time: new Date().toLocaleTimeString(),
          seen: false,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  // DELETE MESSAGE
  const confirmDelete = () => {
    if (!deleteId) return;
    setMessages((prev) => prev.filter((m) => m.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-zinc-50 via-white to-blue-50 dark:from-zinc-900 dark:to-zinc-950 text-black dark:text-white">
      {/* HEADER */}
      <div className="p-4 border-b bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl">
        <h1 className="text-xl font-bold">🤖 AI Career Chat</h1>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* AI */}
            {msg.sender === "ai" && (
              <Avatar>
                <AvatarFallback className="bg-blue-500 text-white">
                  <Bot size={14} />
                </AvatarFallback>
              </Avatar>
            )}

            {/* MESSAGE BOX */}
            <div className="relative group max-w-[70%]">
              <div
                className={`px-4 py-2 rounded-2xl text-sm shadow-md ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-white dark:bg-zinc-800 rounded-bl-sm"
                }`}
              >
                {msg.text && <p>{msg.text}</p>}
                {msg.image && (
                  <img src={msg.image} className="rounded-xl mt-2" />
                )}

                {/* TIME + SEEN */}
                <div className="text-[10px] mt-1 opacity-70 flex justify-between">
                  <span>{msg.time}</span>
                  {msg.sender === "user" && (
                    <span>{msg.seen ? "Seen ✓✓" : "Sent ✓"}</span>
                  )}
                </div>
              </div>

              {/* DELETE BUTTON */}
              {msg.sender === "user" && (
                <button
                  onClick={() => setDeleteId(msg.id)}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition bg-red-500 text-white p-1 rounded-full"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>

            {/* USER */}
            {msg.sender === "user" && (
              <Avatar>
                <AvatarFallback className="bg-zinc-700 text-white">
                  <User size={14} />
                </AvatarFallback>
              </Avatar>
            )}
          </motion.div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-4 border-t flex gap-2 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl">
        <Button variant="outline" onClick={() => fileRef.current?.click()}>
          <ImageIcon size={16} />
        </Button>

        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          hidden
          onChange={(e) => handleImage(e.target.files?.[0])}
        />

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <Button onClick={handleSend} className="bg-blue-500 text-white">
          <Send size={16} />
        </Button>
      </div>

      {/* DELETE CONFIRM MODAL */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this message?
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>

            <Button onClick={confirmDelete} className="bg-red-500 text-white">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
