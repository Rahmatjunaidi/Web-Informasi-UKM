import { GlassCard } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataTableColumn<TData> = {
  key: keyof TData | string;
  header: string;
  className?: string;
  cell?: (row: TData) => React.ReactNode;
};

type DataTableProps<TData> = {
  columns: DataTableColumn<TData>[];
  data: TData[];
  emptyText?: string;
  className?: string;
};

export function DataTable<TData extends Record<string, unknown>>({
  className,
  columns,
  data,
  emptyText = "Belum ada data.",
}: DataTableProps<TData>) {
  return (
    <GlassCard className={cn("overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-white/55 hover:bg-white/55">
            {columns.map((column) => (
              <TableHead className={column.className} key={String(column.key)}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell className={column.className} key={String(column.key)}>
                    {column.cell ? column.cell(row) : String(row[column.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center text-muted-foreground" colSpan={columns.length}>
                {emptyText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </GlassCard>
  );
}
