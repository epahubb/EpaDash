import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../utils";

/**
 * Dropdown — composable dropdown menu triggered by any element.
 *
 * <Dropdown>
 *   <Dropdown.Trigger>
 *     <Button>Options</Button>
 *   </Dropdown.Trigger>
 *   <Dropdown.Menu align="right">
 *     <Dropdown.Item icon={<Pencil />} onClick={handleEdit}>Edit</Dropdown.Item>
 *     <Dropdown.Separator />
 *     <Dropdown.Item icon={<Trash2 />} danger onClick={handleDelete}>Delete</Dropdown.Item>
 *   </Dropdown.Menu>
 * </Dropdown>
 */

const DropdownContext = React.createContext(null);

function Dropdown({ children, className }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function DropdownTrigger({ children }) {
  const ctx = React.useContext(DropdownContext);
  return React.cloneElement(React.Children.only(children), {
    onClick: (e) => {
      e.stopPropagation();
      ctx.setOpen((v) => !v);
      children.props.onClick?.(e);
    },
    "aria-expanded": ctx.open,
    "aria-haspopup": true,
  });
}

function DropdownMenu({
  children,
  align = "left",
  className,
  minWidth = "min-w-[160px]",
}) {
  const ctx = React.useContext(DropdownContext);
  if (!ctx.open) return null;

  const alignClass = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  }[align];

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 py-1 bg-white rounded-xl border border-gray-200 shadow-lg",
        "animate-in fade-in zoom-in-95 duration-150",
        alignClass,
        minWidth,
        className
      )}
      role="menu"
    >
      {children}
    </div>
  );
}

function DropdownItem({
  children,
  icon,
  danger = false,
  disabled = false,
  selected = false,
  onClick,
  className,
}) {
  const ctx = React.useContext(DropdownContext);

  const handleClick = (e) => {
    if (disabled) return;
    onClick?.(e);
    ctx.setOpen(false);
  };

  return (
    <button
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left transition-colors duration-100",
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed",
        selected && "font-semibold",
        className
      )}
    >
      {icon && (
        <span className={cn("h-4 w-4 shrink-0", danger ? "text-red-500" : "text-gray-400")}>
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
      {selected && <Check className="h-4 w-4 ml-auto text-emerald-600" />}
    </button>
  );
}

function DropdownLabel({ children, className }) {
  return (
    <p className={cn("px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider", className)}>
      {children}
    </p>
  );
}

function DropdownSeparator({ className }) {
  return <div className={cn("my-1 border-t border-gray-100", className)} />;
}

// Attach sub-components
Dropdown.Trigger = DropdownTrigger;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;
Dropdown.Label = DropdownLabel;
Dropdown.Separator = DropdownSeparator;

export {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
};

