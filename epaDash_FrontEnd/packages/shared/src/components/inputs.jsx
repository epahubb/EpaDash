import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "../utils";

/**
 * SearchInput — standalone search bar with optional clear button.
 *
 * <SearchInput
 *   value={q}
 *   onChange={(v) => setQ(v)}
 *   placeholder="Search orders…"
 * />
 */
const SearchInput = React.forwardRef(
  (
    {
      className,
      value,
      onChange,
      onClear,
      placeholder = "Search…",
      size = "md",
      ...props
    },
    ref
  ) => {
    const sizes = {
      sm: "h-8 pl-8 pr-8 text-xs",
      md: "h-10 pl-10 pr-10 text-sm",
      lg: "h-12 pl-12 pr-12 text-base",
    };
    const iconSizes = {
      sm: "h-3.5 w-3.5 left-2.5",
      md: "h-4 w-4 left-3",
      lg: "h-5 w-5 left-3.5",
    };

    const handleChange = (e) => {
      onChange?.(e.target.value);
    };

    const handleClear = () => {
      onChange?.("");
      onClear?.();
    };

    return (
      <div className={cn("relative", className)}>
        <Search
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none",
            iconSizes[size]
          )}
        />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border border-gray-300 bg-white text-gray-900",
            "placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
            "disabled:bg-gray-50 disabled:cursor-not-allowed",
            "transition-colors duration-150",
            sizes[size]
          )}
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

/**
 * Textarea — multi-line input with label + error support.
 */
const Textarea = React.forwardRef(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            "block w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 shadow-sm",
            "placeholder:text-gray-400 transition-colors duration-200 resize-y",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

/**
 * Checkbox — styled checkbox with label.
 */
const Checkbox = React.forwardRef(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className={cn("flex items-start gap-3", className)}>
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={cn(
            "mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600",
            "focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm text-gray-700 leading-snug cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

/**
 * RadioGroup — accessible radio button group.
 *
 * <RadioGroup
 *   name="role"
 *   value={role}
 *   onChange={setRole}
 *   options={[
 *     { value: "admin", label: "Admin" },
 *     { value: "merchant", label: "Merchant" },
 *   ]}
 * />
 */
function RadioGroup({ name, value, onChange, options = [], label, error, className }) {
  return (
    <fieldset className={cn("space-y-2", className)}>
      {label && (
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </legend>
      )}
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors duration-150",
            value === opt.value
              ? "border-emerald-500 bg-emerald-50/60"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange?.(opt.value)}
            className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500/20"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{opt.label}</p>
            {opt.description && (
              <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
            )}
          </div>
          {opt.icon && (
            <span className="text-gray-400 shrink-0">{opt.icon}</span>
          )}
        </label>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </fieldset>
  );
}

export { SearchInput, Textarea, Checkbox, RadioGroup };

