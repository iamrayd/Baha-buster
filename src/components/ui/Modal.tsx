"use client";

import { cn } from "@/src/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Modal({ open, onClose, children, className, title }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative bg-white w-full max-w-lg mx-4 z-10 animate-scale-in overflow-hidden",
          className
        )}
        style={{
          borderRadius: "var(--radius-modal)",
          boxShadow: "var(--shadow-elevated)",
        }}
      >
        {title && (
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ background: "var(--color-primary-dark)" }}
          >
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}