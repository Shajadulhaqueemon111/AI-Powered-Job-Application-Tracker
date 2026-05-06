import { Card, CardContent } from "@/components/ui/card";

const data = [
  { title: "User Reports", value: 120 },
  { title: "Job Reports", value: 45 },
  { title: "AI Abuse", value: 32 },
  { title: "Resolved", value: 98 },
];

export default function ReportCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {data.map((item, i) => (
        <Card
          key={i}
          className="bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg"
        >
          <CardContent className="p-5">
            <p className="text-sm text-gray-300">{item.title}</p>
            <h2 className="text-2xl font-bold">{item.value}</h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
