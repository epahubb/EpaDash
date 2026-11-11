import React from "react";
import { cn } from "../utils";
import { Loader2 } from "lucide-react";
const Button = React.forwardRef(
  ({
    className,
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
      primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-emerald-500",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm"
    };
    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2"
    };
    return <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}{children}{!isLoading && rightIcon}</button>;
  }
);
Button.displayName = "Button";
const TextInput = React.forwardRef(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;
    return <div className="w-full">{label && <label
      htmlFor={inputId}
      className="block text-sm font-medium text-gray-700 mb-1.5"
    >{label}</label>}<input
      ref={ref}
      id={inputId}
      className={cn(
        "block w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-0",
        error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20",
        "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
        className
      )}
      aria-invalid={!!error}
      aria-describedby={error ? `${inputId}-error` : void 0}
      {...props}
    />{error && <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600">{error}</p>}{helperText && !error && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}</div>;
  }
);
TextInput.displayName = "TextInput";
const SelectInput = React.forwardRef(({ className, label, error, options, placeholder, id, ...props }, ref) => {
  const selectId = id || props.name;
  return <div className="w-full">{label && <label
    htmlFor={selectId}
    className="block text-sm font-medium text-gray-700 mb-1.5"
  >{label}</label>}<select
    ref={ref}
    id={selectId}
    className={cn(
      "block w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition-colors duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-0",
      error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20",
      "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
      className
    )}
    aria-invalid={!!error}
    {...props}
  >{placeholder && <option value="" disabled>{placeholder}</option>}{options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>{error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}</div>;
});
SelectInput.displayName = "SelectInput";
function FormField({ children, className }) {
  return <div className={cn("space-y-1.5", className)}>{children}</div>;
}
function LoadingSpinner({
  size = "md",
  className,
  text
}) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };
  return <div
    className={cn(
      "flex flex-col items-center justify-center gap-3",
      className
    )}
  ><Loader2 className={cn("animate-spin text-emerald-600", sizes[size])} />{text && <p className="text-sm text-gray-500">{text}</p>}</div>;
}
function ErrorDisplay({
  title = "Something went wrong",
  message,
  onRetry,
  className
}) {
  return <div
    className={cn(
      "flex flex-col items-center justify-center py-12 text-center",
      className
    )}
  ><div className="rounded-full bg-red-50 p-3 mb-4"><svg
    className="h-6 w-6 text-red-600"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
  ><path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
  /></svg></div><h3 className="text-lg font-semibold text-gray-900">{title}</h3><p className="mt-1 text-sm text-gray-500 max-w-sm">{message}</p>{onRetry && <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try Again
        </Button>}</div>;
}
function EmptyState({
  icon,
  title,
  description,
  action,
  className
}) {
  return <div
    className={cn(
      "flex flex-col items-center justify-center py-16 text-center",
      className
    )}
  >{icon && <div className="rounded-full bg-gray-100 p-4 mb-4">{icon}</div>}<h3 className="text-lg font-semibold text-gray-900">{title}</h3>{description && <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>}{action && <div className="mt-6">{action}</div>}</div>;
}
export * from "./notification-container";
export * from "./full-page-loader";
export * from "./error-boundary";
export {
  Button,
  EmptyState,
  ErrorDisplay,
  FormField,
  LoadingSpinner,
  SelectInput,
  TextInput
};
