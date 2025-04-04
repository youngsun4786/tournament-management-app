import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "~/lib/components/ui/button";
import { Input } from "~/lib/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/lib/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  teams: string[];
  positions: string[];
}

export function DataTable<TData, TValue>({
  data,
  columns,
  teams,
  positions,
}: DataTableProps<TData, TValue>) {
  // States for filters and sorting
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize TanStack table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      columnFilters,
      globalFilter: searchValue,
    },
    onGlobalFilterChange: setSearchValue,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchTerm = filterValue.toLowerCase();
      // Search in player name
      const playerName = String(row.getValue("name") || "").toLowerCase();
      // Search in team name
      const teamName = String(row.getValue("team_name") || "").toLowerCase();
      return playerName.includes(searchTerm) || teamName.includes(searchTerm);
    },
  });

  // Calculate total pages
  const totalPages = Math.ceil(
    table.getFilteredRowModel().rows.length /
      table.getState().pagination.pageSize
  );

  return (
    <div className="w-full">
      {/* Filter bar */}
      <div className="bg-gray-50 p-6 mb-4 rounded-lg">
        <div className="flex flex-wrap gap-4">
          {/* Team filter */}
          <Select
            onValueChange={(value) =>
              table
                .getColumn("team_name")
                ?.setFilterValue(value === "All Teams" ? undefined : value)
            }
            defaultValue="All Teams"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="CCBC" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Teams">All Teams</SelectItem>
              {teams.map((team, idx) => (
                <SelectItem key={`${team}-${idx}`} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Position filter */}
          <Select
            onValueChange={(value) =>
              table
                .getColumn("position")
                ?.setFilterValue(value === "All Position" ? undefined : value)
            }
            defaultValue="All Position"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Position">All Position</SelectItem>
              {positions.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search input */}
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Search Players"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1"
            />
            <Button
              className="bg-gray-900"
              onClick={() => {
                // Re-focus the search input after search
                const searchInput = document.querySelector(
                  'input[placeholder="Search by player or team name..."]'
                ) as HTMLInputElement;
                searchInput?.focus();
              }}
            >
              <Search className="h-4 w-4" />
              <span className="ml-2">Search</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Registration status title */}
      <div className="flex justify-end items-center mb-4">
        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Page</span>
          <Select
            value={String(currentPage)}
            onValueChange={(value) => {
              const page = parseInt(value);
              table.setPageIndex(page - 1);
              setCurrentPage(page);
            }}
          >
            <SelectTrigger className="gap-1 w-[60px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages || 1 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm">of {totalPages || 1}</span>
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              table.previousPage();
              setCurrentPage((prev) => Math.max(prev - 1, 1));
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanNextPage()}
            onClick={() => {
              table.nextPage();
              setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1));
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Players table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <TableHead className="text-center" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
