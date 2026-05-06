import { Progress } from "@/components/ui/progress";
import { rolesData } from "../data/analytics.data";

export default function RolesChart() {
  return (
    <div className="space-y-4">
      {rolesData.map((item: { role: string; percent: number }, i: number) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span>{item.role}</span>
            <span>{item.percent}%</span>
          </div>
          <Progress value={item.percent} />
        </div>
      ))}
    </div>
  );
}
