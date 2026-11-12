import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, File as FileIcon } from "lucide-react";
import { cn } from "../utils";

/**
 * Avatar — user/entity avatar with fallback initials.
 *
 * <Avatar src={user.avatarUrl} name={user.name} size="lg" />
 */
function Avatar({ src, name, size = "md", className, ring = false }) {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    xs: "h-6 w-6 text-[9px]",
    sm: "h-8 w-8 text-[10px]",
    md: "h-10 w-10 text-xs",
    lg: "h-12 w-12 text-sm",
    xl: "h-16 w-16 text-base",
    "2xl": "h-20 w-20 text-lg",
  };

  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const showImage = src && !imgError;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0",
        "bg-emerald-100 text-emerald-800 font-semibold",
        ring && "ring-2 ring-white ring-offset-1",
        sizes[size],
        className
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={name || "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}

/**
 * AvatarGroup — stack multiple avatars with overflow count.
 *
 * <AvatarGroup users={users} max={4} size="sm" />
 */
function AvatarGroup({ users = [], max = 4, size = "sm" }) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((u, i) => (
        <Avatar
          key={u.id ?? i}
          src={u.avatarUrl}
          name={u.name}
          size={size}
          ring
          title={u.name}
        />
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            "relative inline-flex items-center justify-center rounded-full",
            "bg-gray-100 text-gray-700 font-semibold text-xs",
            "ring-2 ring-white",
            size === "sm" ? "h-8 w-8" : "h-10 w-10"
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

/**
 * FileUpload — drag-and-drop file input.
 *
 * <FileUpload
 *   accept="image/*"
 *   onFilesSelected={(files) => handleUpload(files)}
 *   label="Upload Menu Photo"
 *   hint="PNG, JPG, WEBP up to 5MB"
 * />
 */
function FileUpload({
  accept,
  multiple = false,
  onFilesSelected,
  label = "Upload a file",
  hint,
  disabled = false,
  className,
}) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = (files) => {
    if (!files?.length) return;
    onFilesSelected?.(multiple ? Array.from(files) : files[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full",
        "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer",
        "transition-colors duration-150",
        isDragOver && !disabled
          ? "border-emerald-500 bg-emerald-50"
          : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={onDrop}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
      aria-label={label}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Upload className="h-8 w-8 text-gray-400 mb-2" />
      <p className="text-sm font-medium text-gray-700">{label}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export { Avatar, AvatarGroup, FileUpload };

