import { getLibrary, getTrackStyle } from "@/content/libraries";
import type { LessonTrack } from "@/content/schema";
import { cn } from "@/lib/cn";

export function LibraryBadge({
  track,
  className,
}: {
  track: LessonTrack;
  className?: string;
}) {
  const library = getLibrary(track);
  const label = library?.name ?? "Start here";
  const style = getTrackStyle(track);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em]",
        style.border,
        style.soft,
        style.text,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", style.bar)} />
      {label}
    </span>
  );
}
