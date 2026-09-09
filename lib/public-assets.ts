import { existsSync } from "node:fs";
import path from "node:path";

export function publicAssetExists(src: string | undefined) {
  if (!src?.startsWith("/")) {
    return false;
  }

  const assetPath = path.normalize(src).replace(/^(\.\.(\/|\\|$))+/, "");

  return existsSync(path.join(process.cwd(), "public", assetPath));
}
