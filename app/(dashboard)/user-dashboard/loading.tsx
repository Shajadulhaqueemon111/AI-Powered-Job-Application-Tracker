export default function Loading() {
  return (
    <div className="p-6 space-y-3 animate-pulse">
      <div className="h-6 w-40 bg-muted rounded" />
      <div className="h-4 w-72 bg-muted rounded" />
      <div className="h-40 w-full bg-muted rounded-xl" />
    </div>
  );
}
