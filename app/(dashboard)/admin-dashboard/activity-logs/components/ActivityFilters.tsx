import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ActivityFilters() {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <Input placeholder="Search user / action..." />

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter Action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="login">Login</SelectItem>
          <SelectItem value="job">Job Activity</SelectItem>
          <SelectItem value="ai">AI Usage</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="success">Success</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="danger">Danger</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
