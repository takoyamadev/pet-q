"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ToastContainer, type ToastMessage } from "@/components/ui/Toast";

interface ToastContextType {
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
    options?: {
      title?: string;
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => void;
  showSuccess: (message: string, options?: { title?: string; duration?: number }) => void;
  showError: (message: string, options?: { title?: string; duration?: number }) => void;
  showWarning: (message: string, options?: { title?: string; duration?: number }) => void;
  showInfo: (message: string, options?: { title?: string; duration?: number }) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);

  const showToast = useCallback((
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
    options?: {
      title?: string;
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    const id = generateId();
    const defaultDuration = type === "error" ? 8000 : 5000; // エラーは少し長く表示

    const toast: ToastMessage = {
      id,
      type,
      message,
      title: options?.title,
      duration: options?.duration ?? defaultDuration,
      action: options?.action,
    };

    setToasts(prev => [...prev, toast]);
  }, [generateId]);

  const showSuccess = useCallback((
    message: string,
    options?: { title?: string; duration?: number }
  ) => {
    showToast(message, "success", options);
  }, [showToast]);

  const showError = useCallback((
    message: string,
    options?: { title?: string; duration?: number }
  ) => {
    showToast(message, "error", options);
  }, [showToast]);

  const showWarning = useCallback((
    message: string,
    options?: { title?: string; duration?: number }
  ) => {
    showToast(message, "warning", options);
  }, [showToast]);

  const showInfo = useCallback((
    message: string,
    options?: { title?: string; duration?: number }
  ) => {
    showToast(message, "info", options);
  }, [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}