import React from "react";
import { cn } from "../utils";

/**
 * Badge — status indicator pill for orders, users, items, etc.
 *
 * <Badge variant="success">Delivered</Badge>
 * <Badge variant="warning" size="sm" dot>Pending</Badge>
 */
const Badge = React.forwardRef(
  (
    { className, variant = "default", size = "md", dot = false, children, ...props },
    ref
  ) => {
    const variants = {
      default: "bg-gray-100 text-gray-700 ring-gray-600/10",
      success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
      danger: "bg-red-50 text-red-700 ring-red-600/20",
      info: "bg-blue-50 text-blue-700 ring-blue-600/20",
      purple: "bg-purple-50 text-purple-700 ring-purple-600/20",
      indigo: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
      orange: "bg-orange-50 text-orange-700 ring-orange-600/20",
    };

    const dotColors = {
      default: "bg-gray-500",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      danger: "bg-red-500",
      info: "bg-blue-500",
      purple: "bg-purple-500",
      indigo: "bg-indigo-500",
      orange: "bg-orange-500",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-[10px] gap-1",
      md: "px-2.5 py-0.5 text-xs gap-1.5",
      lg: "px-3 py-1 text-sm gap-2",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full ring-1 ring-inset",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn("inline-block h-1.5 w-1.5 rounded-full shrink-0", dotColors[variant])}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

/**
 * StatusBadge — maps known order/delivery/account status strings to colours.
 *
 * <StatusBadge status="delivered" />
 */
const STATUS_MAP = {
  // Order statuses
  pending: { variant: "warning", label: "Pending" },
  confirmed: { variant: "info", label: "Confirmed" },
  preparing: { variant: "indigo", label: "Preparing" },
  ready_for_pickup: { variant: "purple", label: "Ready for Pickup" },
  out_for_delivery: { variant: "orange", label: "Out for Delivery" },
  delivered: { variant: "success", label: "Delivered" },
  cancelled: { variant: "danger", label: "Cancelled" },
  rejected: { variant: "danger", label: "Rejected" },
  // User / merchant statuses
  active: { variant: "success", label: "Active" },
  inactive: { variant: "default", label: "Inactive" },
  suspended: { variant: "danger", label: "Suspended" },
  pending_verification: { variant: "warning", label: "Pending Verification" },
  verified: { variant: "success", label: "Verified" },
  // Payment
  paid: { variant: "success", label: "Paid" },
  unpaid: { variant: "warning", label: "Unpaid" },
  refunded: { variant: "info", label: "Refunded" },
  failed: { variant: "danger", label: "Failed" },
  // Online
  online: { variant: "success", label: "Online" },
  offline: { variant: "default", label: "Offline" },
  busy: { variant: "warning", label: "Busy" },
};

function StatusBadge({ status, className, size = "md" }) {
  const normalized = (status || "").toLowerCase().replace(/ /g, "_");
  const config = STATUS_MAP[normalized] ?? { variant: "default", label: status };
  return (
    <Badge variant={config.variant} size={size} dot className={className}>
      {config.label}
    </Badge>
  );
}

export { Badge, StatusBadge, STATUS_MAP };

