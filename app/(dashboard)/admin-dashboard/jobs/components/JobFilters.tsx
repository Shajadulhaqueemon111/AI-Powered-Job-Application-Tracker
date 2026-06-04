"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function JobFilters({
  search,
  onSearch,
  onReset,
}: {
  search: string;
  onSearch: (value: string) => void;
  onReset: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex gap-3">
        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />

        <Button variant="outline">Filter</Button>

        <Button
          variant="secondary"
          onClick={() => {
            onReset();
          }}
        >
          Reset
        </Button>
      </CardContent>
    </Card>
  );
}
