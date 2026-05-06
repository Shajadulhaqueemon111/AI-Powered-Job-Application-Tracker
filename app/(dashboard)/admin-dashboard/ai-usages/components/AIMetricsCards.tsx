import { Card, CardContent } from "@/components/ui/card";

const data = [
  { title: "Total Requests", value: "24,120", color: "from-blue-500" },
  { title: "Token Usage", value: "1.2M", color: "from-purple-500" },
  { title: "Estimated Cost", value: "$142.50", color: "from-green-500" },
  { title: "Active Users", value: "1,340", color: "from-pink-500" },
];

export default function AIMetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {data.map((item, i) => (
        <Card
          key={i}
          className={`relative overflow-hidden text-white bg-gradient-to-br ${item.color} to-slate-900 shadow-lg`}
        >
          <CardContent className="p-5">
            <p className="text-sm opacity-80">{item.title}</p>
            <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
