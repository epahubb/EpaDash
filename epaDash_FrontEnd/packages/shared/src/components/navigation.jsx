import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils";

/**
 * Breadcrumb — auto or manual breadcrumb navigation.
 *
 * Manual:
 * <Breadcrumb>
 *   <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
 *   <Breadcrumb.Item href="/orders">Orders</Breadcrumb.Item>
 *   <Breadcrumb.Item active>Order #1234</Breadcrumb.Item>
 * </Breadcrumb>
 */

function Breadcrumb({ children, className }) {
  const items = React.Children.toArray(children);
  return (
    <nav className={cn("flex items-center", className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 flex-wrap">
        {items.map((child, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight
                className="h-3.5 w-3.5 text-gray-400 shrink-0"
                aria-hidden="true"
              />
            )}
            {child}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function BreadcrumbItem({ children, href, active = false, className }) {
  const baseClass = cn(
    "text-sm font-medium transition-colors duration-150",
    active
      ? "text-gray-900 cursor-default"
      : "text-gray-500 hover:text-gray-700",
    className
  );

  if (href && !active) {
    return (
      <Link to={href} className={baseClass}>
        {children}
      </Link>
    );
  }
  return (
    <span className={baseClass} aria-current={active ? "page" : undefined}>
      {children}
    </span>
  );
}

Breadcrumb.Item = BreadcrumbItem;

/**
 * PageHeader — standardised page header with title, breadcrumb, description, and action slot.
 *
 * <PageHeader
 *   title="Orders"
 *   description="Manage all customer orders"
 *   breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Orders" }]}
 * >
 *   <Button leftIcon={<Plus />}>New Order</Button>
 * </PageHeader>
 */
function PageHeader({
  title,
  description,
  breadcrumbs,
  children,
  back,
  className,
}) {
  return (
    <div className={cn("mb-6", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-3">
          {breadcrumbs.map((crumb, i) => (
            <BreadcrumbItem
              key={i}
              href={crumb.href}
              active={i === breadcrumbs.length - 1}
            >
              {crumb.label}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-3 shrink-0">{children}</div>
        )}
      </div>
    </div>
  );
}

export { Breadcrumb, BreadcrumbItem, PageHeader };

