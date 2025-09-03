"use client";

import { Input } from "@/components/ui/input";

export function GroupFilters({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (v: string) => void;
}) {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        placeholder="Search groups..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
