import fs from "fs";
import path from "path";
import { HomeView } from "@/views/home-view";

function getBackgrounds(folder: string): string[] {
  try {
    const dir = path.join(process.cwd(), "public", folder);
    if (!fs.existsSync(dir)) return [];
    const validExts = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"]);
    return fs
      .readdirSync(dir)
      .filter((file) => validExts.has(path.extname(file).toLowerCase()))
      .map((file) => `${folder}/${file}`);
  } catch {
    return [];
  }
}

export default function Page() {
  const whiteBanners = [...getBackgrounds("white"), ...getBackgrounds("whit")];
  const darkBanners = getBackgrounds("dark");

  return <HomeView initialWhiteBanners={whiteBanners} initialDarkBanners={darkBanners} />;
}
