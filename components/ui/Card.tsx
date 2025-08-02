"use client";

import { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
  id?: string;
}

export function Card({
  children,
  className = "",
  onClick,
  style,
  id,
}: CardProps) {
  return (
    <div
      id={id}
      style={style}
      className={`bg-surface rounded-[var(--radius)] border border-border p-4 ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
