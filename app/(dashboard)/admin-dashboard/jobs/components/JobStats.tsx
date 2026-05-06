import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JobStats() {
  return (
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
  );
}
