"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface TacticalEditorProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
}

export function TacticalEditor({
  value,
  onChange,
  placeholder,
  className,
}: TacticalEditorProps) {
  return (
    <div className={cn("grid gap-4 lg:grid-cols-2", className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Markdown</label>
          <span className="text-xs text-white/40">{value.length} karakter</span>
        </div>
        <textarea
          name="content"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={16}
          placeholder={placeholder}
          className="w-full min-h-[360px] resize-y rounded-lg border border-white/10 bg-[#0b0d17] px-4 py-3 text-sm text-white shadow-inner shadow-black/40 focus:border-primary/50 focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Canlı Önizleme</label>
        <div className="min-h-[360px] max-h-[480px] overflow-y-auto rounded-lg border border-white/10 bg-black/40 p-4 shadow-[0_0_25px_rgba(var(--primary-rgb),0.1)] lg:max-h-[560px]">
          {value.trim().length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Önizleme için Markdown girin.
            </p>
          ) : (
            <div className="prose prose-invert prose-cyber max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
