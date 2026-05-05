import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova Ltd",
    type: "Full Time",
    status: "Active",
    location: "Dhaka, Bangladesh",
    applicants: 24,
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "CloudSync",
    type: "Remote",
    status: "Paused",
    location: "Remote",
    applicants: 12,
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Pixel Studio",
    type: "Contract",
    status: "Active",
    location: "USA",
    applicants: 40,
  },
];

export default function JobsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jobs Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all job postings and applications
          </p>
        </div>

        <Button>+ Create Job</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex gap-3">
          <Input placeholder="Search jobs..." />
          <Button variant="outline">Filter</Button>
          <Button variant="secondary">Reset</Button>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">128</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">94</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">1,240</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Listings</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>{job.location}</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        job.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {job.status}
                    </Badge>
                  </TableCell>

                  <TableCell>{job.applicants}</TableCell>

                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
