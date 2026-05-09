import { ReactNode, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown, Inbox } from "lucide-react";
import { Button } from "./button";

export type Column<T> = {
  key: string;
  header: ReactNode;
  accessor: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number | Date | null | undefined;
  className?: string;
  width?: string;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  loading?: boolean;
  empty?: ReactNode;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  className?: string;
};

export function ReusableTable<T>({
  data,
  columns,
  rowKey,
  loading,
  empty,
  pageSize = 10,
  onRowClick,
  className,
}: Props<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card/40 overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            {columns.map((c) => (
              <TableHead
                key={c.key}
                style={c.width ? { width: c.width } : undefined}
                className={cn("text-xs uppercase tracking-wider", c.className)}
              >
                {c.sortValue ? (
                  <button
                    onClick={() => toggleSort(c.key)}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    {c.header}
                    {sortKey === c.key ? (
                      sortDir === "asc" ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </button>
                ) : (
                  c.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((c) => (
                  <TableCell key={c.key}>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : pageData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                {empty ?? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Inbox className="w-6 h-6" />
                    <span className="text-sm">No results</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ) : (
            pageData.map((row) => (
              <TableRow
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? "cursor-pointer" : undefined}
              >
                {columns.map((c) => (
                  <TableCell key={c.key} className={c.className}>
                    {c.accessor(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {!loading && sorted.length > pageSize && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 text-xs text-muted-foreground">
          <span>
            Page {page} of {totalPages} · {sorted.length} rows
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}