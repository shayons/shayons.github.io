import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUpRight, Github } from "lucide-react";
import { useState } from "react";
import {
  EVENT_TYPE_LABELS,
  formatDate,
  isUpcoming,
  type Talk,
} from "@/lib/content";
import { cn } from "@/lib/utils";

const columns: ColumnDef<Talk>[] = [
  {
    accessorKey: "title",
    header: "Session",
    cell: ({ row }) => {
      const talk = row.original;
      return (
        <div className="min-w-52 py-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium leading-snug text-fg">{talk.title}</p>
            {isUpcoming(talk.date) ? (
              <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                Upcoming
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-subtle">
            {talk.sessionId ? `${talk.sessionId} · ` : ""}
            {talk.location ?? talk.event}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "event",
    header: "Event",
    cell: ({ getValue }) => (
      <span className="text-muted">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "eventType",
    header: "Type",
    cell: ({ getValue }) => (
      <span className="text-muted">
        {EVENT_TYPE_LABELS[getValue() as Talk["eventType"]]}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => (
      <time dateTime={String(getValue())} className="whitespace-nowrap text-muted">
        {formatDate(String(getValue()))}
      </time>
    ),
  },
  {
    id: "links",
    header: "",
    enableSorting: false,
    cell: ({ row }) => {
      const talk = row.original;
      const github = talk.blogUrl?.includes("github.com");
      return (
        <div className="flex items-center justify-end gap-2">
          {talk.pageUrl ? (
            <a
              href={talk.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-1 text-sm font-medium text-fg hover:text-accent"
            >
              Session
              <ArrowUpRight className="size-3.5" />
            </a>
          ) : null}
          {talk.videoUrl ? (
            <a
              href={talk.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-1 text-sm font-medium text-fg hover:text-accent"
            >
              Watch
              <ArrowUpRight className="size-3.5" />
            </a>
          ) : null}
          {talk.blogUrl ? (
            <a
              href={talk.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-10 items-center justify-center text-muted hover:text-fg"
              aria-label={github ? "GitHub" : "Notes"}
            >
              {github ? (
                <Github className="size-4" />
              ) : (
                <ArrowUpRight className="size-4" />
              )}
            </a>
          ) : null}
        </div>
      );
    },
  },
];

export function TalksTable({
  data,
  globalFilter,
  onGlobalFilterChange,
}: {
  data: Talk[];
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange,
    globalFilterFn: (row, _id, filter) => {
      const talk = row.original;
      const q = String(filter).toLowerCase().trim();
      if (!q) return true;
      return [talk.title, talk.event, talk.sessionId, talk.location, ...talk.tags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border text-xs font-medium uppercase tracking-wider text-subtle">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => {
                const sortable = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                const hideMd = header.column.id === "event";
                return (
                  <th
                    key={header.id}
                    className={cn("px-4 py-3 font-medium", hideMd && "hidden md:table-cell")}
                  >
                    {header.isPlaceholder ? null : sortable ? (
                      <button
                        type="button"
                        className="inline-flex h-8 items-center gap-1 hover:text-fg"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <ArrowUpDown
                          className={cn(
                            "size-3",
                            sorted ? "text-fg" : "text-subtle",
                          )}
                        />
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-16 text-center text-muted">
                No sessions match that filter.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-0 hover:bg-surface-2/60"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "px-4 py-3 align-middle",
                      cell.column.id === "event" && "hidden md:table-cell",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
