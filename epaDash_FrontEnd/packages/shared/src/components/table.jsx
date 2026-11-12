import React from "react";
import { cn } from "../utils";

/**
 * Table — composable, accessible data table.
 *
 * <Table>
 *   <Table.Head>
 *     <Table.Row>
 *       <Table.Th>Name</Table.Th>
 *       <Table.Th align="right">Amount</Table.Th>
 *     </Table.Row>
 *   </Table.Head>
 *   <Table.Body>
 *     {rows.map(r => (
 *       <Table.Row key={r.id} hoverable>
 *         <Table.Td>{r.name}</Table.Td>
 *         <Table.Td align="right">{r.amount}</Table.Td>
 *       </Table.Row>
 *     ))}
 *   </Table.Body>
 * </Table>
 */

const Table = React.forwardRef(
  ({ className, children, stickyHeader = false, ...props }, ref) => (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table
        ref={ref}
        className={cn("w-full text-sm text-left border-collapse", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
);
Table.displayName = "Table";

const TableHead = React.forwardRef(({ className, children, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-gray-50 border-b border-gray-200", className)}
    {...props}
  >
    {children}
  </thead>
));
TableHead.displayName = "TableHead";

const TableBody = React.forwardRef(({ className, children, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-gray-100 bg-white", className)}
    {...props}
  >
    {children}
  </tbody>
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef(
  ({ className, hoverable = true, selected = false, onClick, children, ...props }, ref) => (
    <tr
      ref={ref}
      onClick={onClick}
      className={cn(
        "transition-colors duration-100",
        hoverable && "hover:bg-gray-50/70",
        selected && "bg-emerald-50/60",
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
);
TableRow.displayName = "TableRow";

const TableTh = React.forwardRef(
  ({ className, align = "left", children, sortable, sorted, sortDir, onSort, ...props }, ref) => {
    const alignClass = { left: "text-left", center: "text-center", right: "text-right" }[align];

    return (
      <th
        ref={ref}
        className={cn(
          "px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap",
          alignClass,
          sortable && "cursor-pointer select-none hover:text-gray-700",
          className
        )}
        onClick={sortable ? onSort : undefined}
        aria-sort={
          sorted ? (sortDir === "asc" ? "ascending" : "descending") : undefined
        }
        {...props}
      >
        <span className="inline-flex items-center gap-1">
          {children}
          {sortable && (
            <span className="text-gray-300">
              {sorted ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
            </span>
          )}
        </span>
      </th>
    );
  }
);
TableTh.displayName = "TableTh";

const TableTd = React.forwardRef(
  ({ className, align = "left", children, ...props }, ref) => {
    const alignClass = { left: "text-left", center: "text-center", right: "text-right" }[align];

    return (
      <td
        ref={ref}
        className={cn(
          "px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap",
          alignClass,
          className
        )}
        {...props}
      >
        {children}
      </td>
    );
  }
);
TableTd.displayName = "TableTd";

// Attach sub-components
Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Th = TableTh;
Table.Td = TableTd;

export { Table, TableHead, TableBody, TableRow, TableTh, TableTd };

