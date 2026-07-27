"use client";

import { useEffect, useMemo, useState } from "react";

type UserAvatarProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackText?: string;
};

function normalizeAvatarUrl(value?: string | null) {
  if (!value) return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" && typeof window !== "undefined" && window.location.protocol === "https:") {
      parsed.protocol = "https:";
    }
    return parsed.toString();
  } catch {
    return trimmed;
  }
}

export default function UserAvatar({
  src,
  alt,
  className = "h-full w-full object-cover",
  fallbackClassName = "flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-white",
  fallbackText,
}: UserAvatarProps) {
  const [imageSrc, setImageSrc] = useState<string>(normalizeAvatarUrl(src));
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageSrc(normalizeAvatarUrl(src));
    setImageError(false);
  }, [src]);

  const initials = useMemo(() => {
    const value = fallbackText || alt || "U";
    const parts = value.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [alt, fallbackText]);

  if (!imageSrc || imageError) {
    return <div className={fallbackClassName}>{initials}</div>;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
