import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  readWhatsBakingPosts,
  slugifyTitle,
  writeWhatsBakingPosts,
  type BakingPost,
} from "@/data/whatsBakingStore";

export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function clean(value: FormDataEntryValue | null, max = 4000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const password = process.env.WHATS_BAKING_ADMIN_PASSWORD;
  if (!password) {
    return NextResponse.json({ error: "What's Baking admin is not configured" }, { status: 503 });
  }

  const form = await request.formData();
  if (clean(form.get("password"), 200) !== password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const title = clean(form.get("title"), 160);
  const date = clean(form.get("date"), 40) || new Date().toISOString().slice(0, 10);
  const summary = clean(form.get("summary"), 500);
  const bodyText = clean(form.get("body"), 12_000);

  if (!title || !summary || !bodyText) {
    return NextResponse.json({ error: "Title, summary, and post body are required" }, { status: 400 });
  }

  const id = `${date}-${slugifyTitle(title)}`;
  let image = clean(form.get("imageUrl"), 500) || undefined;
  let imageAlt = clean(form.get("imageAlt"), 200) || title;

  const file = form.get("imageFile");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image is too large. Maximum is 5 MB." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Image must be JPG, PNG, WEBP, or GIF." }, { status: 400 });
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
    const imageName = `${id}.${ext}`;
    const publicPath = path.join(process.cwd(), "public", "whats-baking", imageName);
    await fs.mkdir(path.dirname(publicPath), { recursive: true });
    await fs.writeFile(publicPath, Buffer.from(await file.arrayBuffer()));
    image = `/whats-baking/${imageName}`;
  }

  const body = bodyText
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const post: BakingPost = { id, title, date, summary, body, image, imageAlt };
  const posts = await readWhatsBakingPosts();
  const withoutDuplicate = posts.filter((existing) => existing.id !== id);
  await writeWhatsBakingPosts([post, ...withoutDuplicate]);

  return NextResponse.json({ ok: true, post });
}
