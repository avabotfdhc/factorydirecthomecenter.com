// Search-result titles fit in 65 characters (DealerTide review, 2026-09-28).
//
// The limit is enforced by construction — every generated title goes through
// fitTitle() — so these tests pin the ladder's behaviour and run it against the
// real shapes that overflowed: the longest catalogue names and every blog
// headline the site publishes.

import { test } from "node:test";
import assert from "node:assert/strict";
import { fitTitle, planTitle, postTitle, titleLength, TITLE_MAX, TITLE_MIN } from "../src/lib/page-title";
import { localBlogPosts } from "../src/lib/local-posts";
import { shortImageSrc, CATALOGUE_BUCKET_URL } from "../src/lib/image-src";

test("fitTitle returns the first candidate that fits", () => {
  assert.equal(fitTitle(["x".repeat(70), "short enough title"]), "short enough title");
  assert.equal(fitTitle(["fits the first time"]), "fits the first time");
  // Nothing fits: cut the last candidate at a word boundary, never mid-word.
  const cut = fitTitle(["word ".repeat(30).trim()]);
  assert.ok(titleLength(cut) <= TITLE_MAX && !cut.endsWith(" ") && cut.endsWith("word"));
});

test("plan titles stay within 15–65 for the longest catalogue names", () => {
  // Longest active names in the CMS on 2026-09-28 (28 characters), with the
  // longest type label and a fractional bath count.
  for (const name of ["Prime 1676H32P07 (2x6 walls)", "Barkley Reverse Aisle", "1432H11214", "Pike"]) {
    const t = planTitle(name, 4, 2.5, "Multi-Section Home");
    assert.ok(titleLength(t) <= TITLE_MAX && titleLength(t) >= TITLE_MIN, `${t} (${t.length})`);
    assert.ok(t.startsWith(name), "the home's name always leads");
  }
  // A short name keeps the full, most descriptive form.
  assert.equal(planTitle("Thornton", 3, 2, "Double Wide Home"), "Thornton — 3 Bed 2 Bath Champion Double Wide Home, Auburn IN");
});

test("every published post has a title within 15–65", () => {
  for (const post of localBlogPosts) {
    const t = postTitle(post.title);
    assert.ok(titleLength(t) <= TITLE_MAX && titleLength(t) >= TITLE_MIN, `${post.slug}: "${t}" (${titleLength(t)})`);
  }
});

test("catalogue photos get a short same-origin src, and nothing else changes", () => {
  assert.equal(shortImageSrc(`${CATALOGUE_BUCKET_URL}legacy/dutch-aspire-1452h21081.webp`), "/fp/legacy/dutch-aspire-1452h21081.webp");
  // %-escaped legacy keys, other hosts and repo paths are left alone.
  const escaped = `${CATALOGUE_BUCKET_URL}legacy/Dutch%20Aspire%201440H11065.png`;
  assert.equal(shortImageSrc(escaped), escaped);
  assert.equal(shortImageSrc("/images/hero-home.jpg"), "/images/hero-home.jpg");
  assert.equal(shortImageSrc("https://example.supabase.co/storage/v1/object/public/floor-plans/a.webp"), "https://example.supabase.co/storage/v1/object/public/floor-plans/a.webp");
});
