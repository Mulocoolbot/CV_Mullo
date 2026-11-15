export function getAssetPath(src: string, customBasePath?: string): string {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  const basePath =
    customBasePath !== undefined
      ? customBasePath
      : process.env.NEXT_PUBLIC_BASE_PATH || "";
  const normalizedSrc = src.startsWith("/") ? src : `/${src}`;
  if (
    basePath &&
    (normalizedSrc === basePath || normalizedSrc.startsWith(`${basePath}/`))
  ) {
    return normalizedSrc;
  }
  return `${basePath}${normalizedSrc}`;
}
