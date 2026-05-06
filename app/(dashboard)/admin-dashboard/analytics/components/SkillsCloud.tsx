import { Badge } from "@/components/ui/badge";
import { skillsData } from "../data/analytics.data";

export default function SkillsCloud() {
  return (
    <div className="flex flex-wrap gap-2">
      {skillsData.map((skill, i) => (
        <Badge key={i}>{skill}</Badge>
      ))}
    </div>
  );
}
