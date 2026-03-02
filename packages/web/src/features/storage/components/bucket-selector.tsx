import { Bucket } from "iconsax-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useStorageBucketList } from "../hooks/use-storage-explorer";

interface BucketSelectorProps {
  credentialId: string;
  value: string;
  onChange: (bucket: string) => void;
}

export function BucketSelector({
  credentialId,
  value,
  onChange,
}: BucketSelectorProps) {
  const { data, isLoading } = useStorageBucketList(credentialId);
  const buckets = data?.data ?? [];

  if (isLoading) {
    return <Skeleton className="h-10 w-64" />;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-64">
        <div className="flex items-center gap-2">
          <Bucket size={14} color="currentColor" className="text-muted-foreground" />
          <SelectValue placeholder="Select a bucket" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {buckets.map((b) => (
          <SelectItem key={b.name} value={b.name}>
            {b.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
