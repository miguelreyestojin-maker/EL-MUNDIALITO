import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="glass w-full max-w-sm space-y-4 rounded-2xl bg-dark-pitch p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="display text-3xl">{title}</h2>
        {children}
      </div>
    </div>
  );
}
