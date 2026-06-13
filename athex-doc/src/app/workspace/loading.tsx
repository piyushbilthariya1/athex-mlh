export default function Loading() {
  return (
    <div className="p-[var(--spacing-xl)] flex flex-col gap-[var(--spacing-lg)] animate-pulse w-full max-w-[1000px] mx-auto">
      <div className="h-10 bg-[var(--color-surface-soft)] w-1/3 rounded-[var(--radius-md)]" />
      <div className="h-[300px] bg-[var(--color-surface-soft)] w-full rounded-[var(--radius-lg)] border border-[var(--color-hairline-soft)]" />
    </div>
  );
}