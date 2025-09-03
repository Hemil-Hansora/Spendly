"use client";

import { GroupCard } from "./GroupCard";

interface Group {
  id: number;
  name: string;
  emoji: string;
  code: string;
  balance: number;
}

export function GroupList({
  groups,
  onSelect,
}: {
  groups: Group[];
  onSelect: (id: number) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <GroupCard key={g.id} {...g} onClick={onSelect} />
      ))}
    </div>
  );
}
