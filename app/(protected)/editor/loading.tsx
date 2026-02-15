export default function EditorLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-gh-canvas-subtle" />
      <div className="h-4 w-96 animate-pulse rounded bg-gh-canvas-subtle" />
      <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-lg border border-gh-border bg-gh-canvas-subtle" />
        ))}
      </div>
    </div>
  );
}
