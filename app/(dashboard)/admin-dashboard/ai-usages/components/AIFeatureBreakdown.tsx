import { Progress } from "@/components/ui/progress";

const features = [
  { name: "Resume Generator", value: 80 },
  { name: "Job Matching AI", value: 65 },
  { name: "Cover Letter AI", value: 90 },
  { name: "Chat Assistant", value: 70 },
];

export default function AIFeatureBreakdown() {
  return (
    <div className="bg-card rounded-xl p-4 border shadow-sm space-y-4">
      <h2 className="font-semibold">AI Feature Usage</h2>

      {features.map((f, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span>{f.name}</span>
            <span>{f.value}%</span>
          </div>
          <Progress value={f.value} />
        </div>
      ))}
    </div>
  );
}
