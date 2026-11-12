import React from "react";
import { cn } from "../utils";

/**
 * Card — a versatile surface container component.
 *
 * Usage:
 *   <Card>...</Card>
 *   <Card.Header><Card.Title>...</Card.Title></Card.Header>
 *   <Card.Body>...</Card.Body>
 *   <Card.Footer>...</Card.Footer>
 */

// ─── Root Card ────────────────────────────────────────────────────────────────
const Card = React.forwardRef(
  (
    {
      className,
      variant = "default",
      hoverable = false,
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-white border border-gray-200 shadow-sm",
      elevated: "bg-white border border-gray-100 shadow-md",
      outlined: "bg-white border border-gray-300",
      ghost: "bg-gray-50 border border-transparent",
      danger: "bg-red-50 border border-red-200",
      success: "bg-emerald-50 border border-emerald-200",
      warning: "bg-amber-50 border border-amber-200",
      info: "bg-blue-50 border border-blue-200",
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-5",
      lg: "p-6",
      xl: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-200",
          variants[variant],
          paddings[padding],
          hoverable &&
            "hover:shadow-md hover:border-gray-300 cursor-pointer active:scale-[0.995]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

// ─── Card.Header ──────────────────────────────────────────────────────────────
const CardHeader = React.forwardRef(
  ({ className, bordered = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between",
        bordered && "pb-4 mb-4 border-b border-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

// ─── Card.Title ───────────────────────────────────────────────────────────────
const CardTitle = React.forwardRef(
  ({ className, as: Tag = "h3", children, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(
        "text-base font-semibold text-gray-900 leading-snug",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
);
CardTitle.displayName = "CardTitle";

// ─── Card.Description ─────────────────────────────────────────────────────────
const CardDescription = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("mt-1 text-sm text-gray-500 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = "CardDescription";

// ─── Card.Body ────────────────────────────────────────────────────────────────
const CardBody = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props}>
      {children}
    </div>
  )
);
CardBody.displayName = "CardBody";

// ─── Card.Footer ──────────────────────────────────────────────────────────────
const CardFooter = React.forwardRef(
  ({ className, bordered = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3",
        bordered && "pt-4 mt-4 border-t border-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";

// ─── Stat Card ────────────────────────────────────────────────────────────────
/**
 * StatCard — purpose-built for KPI/metric tiles on dashboards.
 *
 * <StatCard
 *   icon={<TrendingUp />}
 *   iconColor="text-emerald-600"
 *   iconBg="bg-emerald-50"
 *   label="Total Revenue"
 *   value="GH₵12,340"
 *   trend={{ value: 12.5, label: "vs last month", positive: true }}
 * />
 */
function StatCard({
  icon,
  iconColor = "text-emerald-600",
  iconBg = "bg-emerald-50",
  label,
  value,
  trend,
  footer,
  className,
}) {
  return (
    <Card className={cn("flex flex-col gap-4", className)} padding="md">
      {/* Icon + Trend row */}
      <div className="flex items-start justify-between">
        {icon && (
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              iconBg,
              iconColor
            )}
          >
            {icon}
          </div>
        )}
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
              trend.positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            )}
          >
            {trend.positive ? "▲" : "▼"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {/* Value + Label */}
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-tight">
          {value}
        </p>
        <p className="mt-1 text-sm font-medium text-gray-500">{label}</p>
      </div>

      {/* Optional trend label / footer */}
      {(trend?.label || footer) && (
        <p className="text-xs text-gray-400 leading-relaxed">
          {trend?.label || footer}
        </p>
      )}
    </Card>
  );
}

// Attach sub-components to Card namespace
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, StatCard };

