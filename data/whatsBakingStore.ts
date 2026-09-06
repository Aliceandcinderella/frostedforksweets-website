import { get, put } from "@vercel/blob";

export type BakingPost = {
  id: string;
  title: string;
  date: string;
  summary: string;
  body: string[];
  image?: string;
  imageAlt?: string;
};

const POSTS_PATH = "whats-baking/posts.json";

export async function readWhatsBakingPosts(): Promise<BakingPost[]> {
  try {
    const result = await get(POSTS_PATH, {
      access: "public",
      useCache: false,
    });

    if (!result) {
      return [];
    }

    const response = new Response(result.stream);

    if (!response.ok) {
      return [];
    }

    const parsed = (await response.json()) as BakingPost[];

    return parsed.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export async function writeWhatsBakingPosts(
  posts: BakingPost[]
): Promise<void> {
  await put(
    POSTS_PATH,
    JSON.stringify(posts, null, 2),
    {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    }
  );
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
