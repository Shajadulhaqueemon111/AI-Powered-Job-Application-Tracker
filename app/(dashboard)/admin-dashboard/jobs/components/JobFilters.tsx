import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function JobFilters() {
  return (
    <Card>
      <CardContent className="p-4 flex gap-3">
        <Input placeholder="Search jobs..." />
        <Button variant="outline">Filter</Button>
        <Button variant="secondary">Reset</Button>
      </CardContent>
    </Card>
  );
}
