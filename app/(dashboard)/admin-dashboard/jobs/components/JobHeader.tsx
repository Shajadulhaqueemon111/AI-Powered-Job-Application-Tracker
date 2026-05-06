import { Button } from "@/components/ui/button";

export default function JobHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Jobs Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage all job postings and applications
        </p>
      </div>

      <Button>+ Create Job</Button>
    </div>
  );
}
