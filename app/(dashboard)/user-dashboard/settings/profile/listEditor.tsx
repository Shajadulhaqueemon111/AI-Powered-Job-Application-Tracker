"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Pencil, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Generic "list of cards" editor used by Work Experience, Education,
 * Projects, and Certifications. Each section passes:
 *  - items: the current array from the user object
 *  - renderSummary: how a saved item looks collapsed
 *  - renderForm: the editable fields for add/edit mode
 *  - onAdd / onUpdate / onDelete: wired to the real RTK Query mutations
 *
 * This keeps add/edit/delete UX (and loading/error states) consistent
 * across every list-type section instead of re-implementing it 4x.
 */

export type ListEditorItem = { id: string };

interface ListEditorProps<T extends ListEditorItem> {
  items: T[];
  emptyDraft: Omit<T, "id">;
  renderSummary: (item: T) => React.ReactNode;
  renderForm: (
    draft: Omit<T, "id"> | T,
    setDraft: (next: Omit<T, "id"> | T) => void,
  ) => React.ReactNode;
  onAdd: (item: Omit<T, "id">) => Promise<unknown>;
  onUpdate: (item: T) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  addLabel: string;
  emptyStateText: string;
}

export function ListEditor<T extends ListEditorItem>({
  items,
  emptyDraft,
  renderSummary,
  renderForm,
  onAdd,
  onUpdate,
  onDelete,
  addLabel,
  emptyStateText,
}: ListEditorProps<T>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<Omit<T, "id"> | T>(emptyDraft);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startAdd = () => {
    setDraft(emptyDraft);
    setIsAdding(true);
    setEditingId(null);
  };

  const startEdit = (item: T) => {
    setDraft(item);
    setEditingId(item.id);
    setIsAdding(false);
  };

  const cancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setDraft(emptyDraft);
  };

  const saveNew = async () => {
    setSavingId("new");
    try {
      await onAdd(draft as Omit<T, "id">);
      cancel();
    } finally {
      setSavingId(null);
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSavingId(editingId);
    try {
      await onUpdate(draft as T);
      cancel();
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && !isAdding && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
          {emptyStateText}
        </p>
      )}

      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-5"
          >
            {editingId === item.id ? (
              <div className="space-y-3">
                {renderForm(draft, setDraft)}
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={saveEdit}
                    disabled={savingId === item.id}
                    className="rounded-lg"
                  >
                    {savingId === item.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Check className="size-4" />
                    )}
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={cancel}
                    className="rounded-lg"
                  >
                    <X className="size-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">{renderSummary(item)}</div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-blue-500 hover:bg-blue-500/10 transition"
                    aria-label="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    disabled={deletingId === item.id}
                    className="p-2 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition disabled:opacity-50"
                    aria-label="Delete"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="size-[15px] animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-dashed border-blue-300 dark:border-zinc-700 p-5 space-y-3"
        >
          {renderForm(draft, setDraft)}
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              onClick={saveNew}
              disabled={savingId === "new"}
              className="rounded-lg"
            >
              {savingId === "new" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={cancel}
              className="rounded-lg"
            >
              <X className="size-4" />
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {!isAdding && (
        <Button
          variant="outline"
          onClick={startAdd}
          className="w-full rounded-xl border-dashed"
        >
          <Plus className="size-4" />
          {addLabel}
        </Button>
      )}
    </div>
  );
}
