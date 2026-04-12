"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocationCardProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "call" | "partial-call" | "result";
}

function getLabel(toolName: string, args: Record<string, unknown>): { action: string; file: string } {
  const lastName = (p: string) => p?.split("/").filter(Boolean).pop() ?? p;

  if (toolName === "str_replace_editor") {
    const path = args.path as string;
    const file = lastName(path);
    switch (args.command) {
      case "create":     return { action: "Creating", file };
      case "str_replace":
      case "insert":     return { action: "Editing", file };
      case "view":       return { action: "Reading", file };
      case "undo_edit":  return { action: "Undoing edit on", file };
    }
  }

  if (toolName === "file_manager") {
    const path = args.path as string;
    if (args.command === "rename") {
      const newPath = args.new_path as string;
      return { action: "Renaming", file: `${lastName(path)} → ${lastName(newPath)}` };
    }
    if (args.command === "delete") {
      return { action: "Deleting", file: lastName(path) };
    }
  }

  return { action: toolName, file: "" };
}

export function ToolInvocationCard({ toolName, args, state }: ToolInvocationCardProps) {
  const done = state === "result";
  const { action, file } = getLabel(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      <span className="text-neutral-600">{action}</span>
      {file && <span className="font-mono text-neutral-800 font-medium">{file}</span>}
    </div>
  );
}
