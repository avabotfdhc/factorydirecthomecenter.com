// The YouTube id is read out of whatever URL shape DealerTide or /admin
// supplies; anything else yields "" and the page shows no video.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { youtubeEmbedUrl, youtubeIdFrom, youtubeThumbnail, youtubeWatchUrl } from "../src/lib/plan-video";

test("every YouTube URL shape yields the same id", () => {
  for (const url of [
    "https://www.youtube.com/embed/GW3FQ-AqSQw?enablejsapi=1",
    "https://www.youtube.com/watch?v=GW3FQ-AqSQw&t=10s",
    "https://m.youtube.com/watch?v=GW3FQ-AqSQw",
    "https://youtu.be/GW3FQ-AqSQw",
    "https://www.youtube-nocookie.com/embed/GW3FQ-AqSQw?rel=0",
    "https://www.youtube.com/shorts/GW3FQ-AqSQw",
  ]) {
    assert.equal(youtubeIdFrom(url), "GW3FQ-AqSQw", url);
  }
});

test("anything that is not a YouTube video id is rejected", () => {
  for (const url of ["", "not a url", "https://my.matterport.com/show/?m=zUuN931WExB", "https://www.youtube.com/@ChampionHomesusa", "https://vimeo.com/12345", "https://www.youtube.com/watch?v=short"]) {
    assert.equal(youtubeIdFrom(url), "", url || "(empty)");
  }
  assert.equal(youtubeIdFrom(undefined), "");
});

test("embed, watch and thumbnail URLs are built from the id, privacy-enhanced for the embed", () => {
  assert.equal(youtubeEmbedUrl("GW3FQ-AqSQw"), "https://www.youtube-nocookie.com/embed/GW3FQ-AqSQw?rel=0");
  assert.equal(youtubeWatchUrl("GW3FQ-AqSQw"), "https://www.youtube.com/watch?v=GW3FQ-AqSQw");
  assert.equal(youtubeThumbnail("GW3FQ-AqSQw"), "https://i.ytimg.com/vi/GW3FQ-AqSQw/hqdefault.jpg");
});
