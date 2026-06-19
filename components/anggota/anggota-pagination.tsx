import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnggotaPaginationProps = { page: number; pageCount: number; search: string; ukmId: string; membershipStatus: string };

export function AnggotaPagination({ page, pageCount, search, ukmId, membershipStatus }: AnggotaPaginationProps) {
  if (pageCount <= 1) return null;
  const pages = getVisiblePages(page, pageCount);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">Halaman {page} dari {pageCount}</p>
      <div className="flex flex-wrap items-center gap-2">
        <PaginationButton disabled={page <= 1} href={buildHref(page - 1, search, ukmId, membershipStatus)} label="Sebelumnya">
          <ChevronLeft />
        </PaginationButton>
        {pages.map((item) => (
          <Button asChild={item !== page} disabled={item === page} key={item} size="sm" variant={item === page ? "default" : "outline"}>
            {item === page ? <span>{item}</span> : <Link href={buildHref(item, search, ukmId, membershipStatus)}>{item}</Link>}
          </Button>
        ))}
        <PaginationButton disabled={page >= pageCount} href={buildHref(page + 1, search, ukmId, membershipStatus)} label="Berikutnya">
          <ChevronRight />
        </PaginationButton>
      </div>
    </div>
  );
}

function PaginationButton({ children, disabled, href, label }: { children: React.ReactNode; disabled: boolean; href: string; label: string }) {
  return (
    <Button asChild={!disabled} className={cn("px-3", disabled && "pointer-events-none")} disabled={disabled} size="sm" variant="outline">
      {disabled ? (
        <span>
          {children}
          {label}
        </span>
      ) : (
        <Link href={href}>
          {children}
          {label}
        </Link>
      )}
    </Button>
  );
}

function buildHref(page: number, search: string, ukmId: string, membershipStatus: string) {
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  if (ukmId) params.set("ukmId", ukmId);
  if (membershipStatus) params.set("membershipStatus", membershipStatus);
  params.set("page", String(page));
  return `/dashboard/anggota?${params.toString()}`;
}

function getVisiblePages(page: number, pageCount: number) {
  const start = Math.max(1, page - 2);
  const end = Math.min(pageCount, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
