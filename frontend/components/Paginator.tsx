"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { LIMIT } from "@/lib/constants";

type Props = {
  totalCount: number;
  limit?: number;
};

const Paginator = ({ totalCount, limit = LIMIT }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const router = useRouter();
  const totalPages = Math.ceil(totalCount / limit);

  const navigateToPage = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePrevious = () => {
    const prevPage = currentPage > 1 ? currentPage - 1 : 1;
    navigateToPage(prevPage);
  };

  const handleNext = () => {
    const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;
    navigateToPage(nextPage);
  };

  const getPageNumbers = () => {
    const range = 3;
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Pagination className="md:justify-end">
      <PaginationContent>
        <Button variant={"ghost"} disabled={currentPage === 1}>
          <PaginationItem className="bg-white rounded-xl">
            <PaginationPrevious onClick={handlePrevious} />
          </PaginationItem>
        </Button>

        {getPageNumbers().map((pageNumber) => (
          <Button
            variant={"ghost"}
            disabled={currentPage === pageNumber}
            key={pageNumber}
          >
            <PaginationItem
              className={cn(
                "bg-white rounded-xl",
                currentPage === pageNumber && "bg-black/90 text-white",
              )}
            >
              <PaginationLink onClick={() => navigateToPage(pageNumber)}>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          </Button>
        ))}
        <Button variant={"ghost"} disabled={currentPage === totalPages}>
          <PaginationItem className="rounded-xl bg-white">
            <PaginationNext onClick={handleNext} />
          </PaginationItem>
        </Button>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginator;
