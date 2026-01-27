import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  delta = 2, // how many pages on each side
}) => {
  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getVisiblePages();

  return (
    <div className="flex justify-center mt-10">
      <Pagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              className={
                currentPage === 1
                  ? "pointer-events-none  opacity-50"
                  : "cursor-pointer  hover:bg-blue-900"
              }
              onClick={() => onPageChange(currentPage - 1)}
            />
          </PaginationItem>

          {/* First page */}
          {pages[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(1)}
                  className="cursor-pointer "
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {pages[0] > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {/* Page window */}
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
                className="cursor-pointer transition-colors duration-200 hover:bg-blue-950 hover:text-white"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Last page */}
          {pages[pages.length - 1] < totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(totalPages)}
                  className="cursor-pointer"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              onClick={() => onPageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControls;
