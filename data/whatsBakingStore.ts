import { promises as fs } from "node:fs";
import path from "node:path";

export type BakingPost = {
  id: string;
  title: string;
  date: string;
  summary: string;
  body: string[];
  image?: string;
  imageAlt?: string;
};

export const WHATS_BAKING_POSTS_PATH = path.join(
  process.cwd(),
  "data",
  "whatsBakingPosts.json"
);

export async function readWhatsBakingPosts(): Promise<BakingPost[]> {
  try {
    const raw = await fs.readFile(WHATS_BAKING_POSTS_PATH, "utf8");
    const parsed = JSON.parse(raw) as BakingPost[];
    return parsed.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export async function writeWhatsBakingPosts(posts: BakingPost[]): Promise<void> {
  await fs.mkdir(path.dirname(WHATS_BAKING_POSTS_PATH), { recursive: true });
  await fs.writeFile(WHATS_BAKING_POSTS_PATH, `${JSON.stringify(posts, null, 2)}\n`);
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
