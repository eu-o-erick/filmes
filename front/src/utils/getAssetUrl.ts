import { STATIC_BASE_URL } from "@/constants";

export function getAssetUrl(relativePath: string): string {
  return `${STATIC_BASE_URL}/movies/${encodeURIComponent(relativePath)}`;
}
