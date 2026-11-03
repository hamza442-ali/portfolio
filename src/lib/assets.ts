import { existsSync } from "node:fs";
import { join } from "node:path";
import type { ProjectImage } from "@/content/types";
import { imageMeta, type ImageMeta } from "@/content/images.generated";

/**
 * Server-only: true if a `/public`-relative path exists on disk at build time.
 * Lets content reference images that Ali has not supplied yet without
 * rendering broken <img> tags.
 */
export function publicFileExists(publicPath: string | undefined | null): publicPath is string {
  if (!publicPath) return false;
  return existsSync(join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}

/** Width, height and blur placeholder for an optimised image, or null if it was never indexed. */
export function getImageMeta(publicPath: string | undefined | null): ImageMeta | null {
  if (!publicPath) return null;
  return imageMeta[publicPath] ?? null;
}

export type ResolvedImage = ProjectImage & ImageMeta;

/** Keeps only screenshots that exist on disk and were indexed by `npm run images`. */
export function resolveImages(images: ProjectImage[] | undefined): ResolvedImage[] {
  if (!images) return [];
  const out: ResolvedImage[] = [];
  for (const image of images) {
    const meta = getImageMeta(image.src);
    if (meta && publicFileExists(image.src)) out.push({ ...image, ...meta });
  }
  return out;
}
