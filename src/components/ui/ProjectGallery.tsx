"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, Maximize2, Workflow, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { ResolvedImage } from "@/lib/assets";
import { cn } from "@/lib/utils";
import { ProjectFrame } from "./ProjectFrame";

export interface DiagramSlideInput {
  node: ReactNode;
  alt: string;
  caption?: string;
}

type Slide =
  | ({ kind: "image" } & ResolvedImage)
  | ({ kind: "diagram"; src: string; width: number; height: number } & DiagramSlideInput);

interface ProjectGalleryProps {
  title: string;
  subtitle?: string;
  accent: [string, string];
  images: ResolvedImage[];
  /** Vector architecture drawing, shown as the last slide (or the only one). */
  diagram?: DiagramSlideInput;
  /** `featured` shows thumbnails and a caption; `card` is just the cover with a counter. */
  variant: "featured" | "card";
  /** `sizes` for the cover image. */
  sizes: string;
  className?: string;
}

/** Diagrams are drawn in a 16:9 viewBox. */
const DIAGRAM_W = 1200;
const DIAGRAM_H = 675;

/**
 * Screenshot and diagram gallery inside a browser-window frame. Click the cover
 * (or press Enter on it) to open a full-size lightbox with keyboard navigation.
 */
export function ProjectGallery({ title, subtitle, accent, images, diagram, variant, sizes, className }: ProjectGalleryProps) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const baseId = useId();

  const slides: Slide[] = images.map((img) => ({ kind: "image", ...img }));
  if (diagram) slides.push({ kind: "diagram", src: `diagram:${title}`, width: DIAGRAM_W, height: DIAGRAM_H, ...diagram });

  const current = slides[index] ?? slides[0];
  const cover = slides[0];
  const many = slides.length > 1;

  if (!cover) return <ProjectFrame title={title} subtitle={subtitle} accent={accent} size={variant === "featured" ? "lg" : "sm"} className={className} />;

  function onTabKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + slides.length) % slides.length;
    setIndex(next);
    document.getElementById(`${baseId}-thumb-${next}`)?.focus();
  }

  const onlyDiagram = slides.length === 1 && cover.kind === "diagram";
  const counter = (
    <span className="ml-2 inline-flex items-center gap-1 font-mono text-[10px] text-muted-2">
      {onlyDiagram ? <Workflow className="size-3" aria-hidden /> : <Images className="size-3" aria-hidden />}
      {onlyDiagram ? "architecture" : variant === "card" ? slides.length : `${index + 1}/${slides.length}`}
    </span>
  );

  return (
    <figure className={cn("min-w-0 max-w-full", className)}>
      <ProjectFrame title={title} subtitle={subtitle} accent={accent} size={variant === "featured" ? "lg" : "sm"} chrome={counter}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open ${title} ${current.kind === "diagram" ? "architecture diagram" : `screenshot ${index + 1} of ${slides.length}`} full size`}
          className="group/shot relative block w-full overflow-hidden bg-surface-2 bg-cover bg-top text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
          // The tiny blur placeholder is painted as a plain CSS background: cheaper than
          // next/image's SVG-filter placeholder and it stays visible while a new slide loads.
          style={{
            aspectRatio: `${cover.width} / ${cover.height}`,
            backgroundImage: current.kind === "image" ? `url(${current.blurDataURL})` : undefined,
          }}
        >
          {current.kind === "image" ? (
            <Image key={current.src} src={current.src} alt={current.alt} fill sizes={sizes} className="object-cover object-top" />
          ) : (
            <div className="absolute inset-0" role="img" aria-label={current.alt}>
              {current.node}
            </div>
          )}
          <span
            aria-hidden
            className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover/shot:opacity-100 group-focus-visible/shot:opacity-100"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-xs font-medium text-fg backdrop-blur">
              <Maximize2 className="size-3.5" /> View Full Size
            </span>
          </span>
        </button>
      </ProjectFrame>

      {variant === "featured" && (
        <>
          {many && (
            <div role="tablist" aria-label={`${title} screenshots`} onKeyDown={onTabKey} className="mt-3 flex w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  id={`${baseId}-thumb-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={i === index}
                  aria-label={slide.caption ?? slide.alt}
                  tabIndex={i === index ? 0 : -1}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border transition-[border-color,opacity] duration-300 sm:h-16 sm:w-28",
                    i === index ? "border-accent/70 opacity-100" : "border-border opacity-55 hover:opacity-90",
                  )}
                >
                  {slide.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element -- fixed 7rem thumbnails; skipping next/image keeps hydration cheap
                    <img src={thumbUrl(slide.src)} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover object-top" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center gap-1 bg-surface-2 font-mono text-[10px] text-muted">
                      <Workflow className="size-3.5" aria-hidden /> diagram
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          <figcaption className="mt-2 flex items-baseline justify-between gap-3 text-sm text-muted" aria-live="polite">
            <span>{current.caption ?? current.alt}</span>
            {many && (
              <span className="shrink-0 font-mono text-xs text-muted-2">
                {index + 1} / {slides.length}
              </span>
            )}
          </figcaption>
        </>
      )}

      <Lightbox open={open} onClose={() => setOpen(false)} title={title} slides={slides} index={index} onIndexChange={setIndex} />
    </figure>
  );
}

/** Thumbnail through the built-in optimizer at a fixed small width. */
function thumbUrl(src: string) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=256&q=75`;
}

interface LightboxProps {
  open: boolean;
  onClose: () => void;
  title: string;
  slides: Slide[];
  index: number;
  onIndexChange: (i: number) => void;
}

function Lightbox({ open, onClose, title, slides, index, onIndexChange }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const many = slides.length > 1;
  const slide = slides[index] ?? slides[0];

  const step = useCallback(
    (delta: number) => onIndexChange((index + delta + slides.length) % slides.length),
    [index, slides.length, onIndexChange],
  );

  // Sync the native <dialog> with React state and keep the page from scrolling behind it.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    return () => {
      if (open) document.documentElement.style.overflow = "";
    };
  }, [open]);

  function onKeyDown(e: KeyboardEvent<HTMLDialogElement>) {
    if (!many) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  }

  const frame = "rounded-xl border border-border shadow-[0_30px_100px_-30px_rgba(0,0,0,0.9)]";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={`${title} screenshots`}
      data-lenis-prevent
      className="lightbox m-auto max-h-none max-w-none bg-transparent p-0 text-fg backdrop:bg-bg/90 backdrop:backdrop-blur-sm open:flex"
    >
      {open && slide && (
        <div className="relative flex max-h-[100svh] w-[100vw] flex-col items-center justify-center gap-3 p-4 sm:p-8" onClick={(e) => e.stopPropagation()}>
          <div className="relative flex w-full items-center justify-center">
            {slide.kind === "image" ? (
              <Image
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                sizes="100vw"
                placeholder="blur"
                blurDataURL={slide.blurDataURL}
                className={cn("h-auto max-h-[78svh] w-auto max-w-full object-contain", frame)}
              />
            ) : (
              <div
                role="img"
                aria-label={slide.alt}
                className={cn("w-full overflow-hidden", frame)}
                style={{ maxWidth: `min(100%, calc(78svh * ${slide.width} / ${slide.height}))`, aspectRatio: `${slide.width} / ${slide.height}` }}
              >
                {slide.node}
              </div>
            )}
          </div>
          <div className="flex w-full max-w-4xl items-center justify-between gap-4">
            <p className="text-sm text-muted">
              <span className="font-medium text-fg">{title}</span>
              {slide.caption && <span className="text-muted"> · {slide.caption}</span>}
            </p>
            {many && (
              <span className="shrink-0 font-mono text-xs text-muted-2" aria-live="polite">
                {index + 1} / {slides.length}
              </span>
            )}
          </div>

          {many && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous screenshot"
                className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/70 text-fg backdrop-blur transition-colors hover:bg-white/10 sm:left-6"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next screenshot"
                className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/70 text-fg backdrop-blur transition-colors hover:bg-white/10 sm:right-6"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full border border-border bg-bg/70 text-fg backdrop-blur transition-colors hover:bg-white/10 sm:right-6 sm:top-6"
          >
            <X className="size-5" />
          </button>
        </div>
      )}
    </dialog>
  );
}
