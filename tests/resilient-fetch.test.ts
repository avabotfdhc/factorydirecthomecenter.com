// Tests for the Supabase read hardening (src/lib/resilient-fetch.ts).
//
// These cover the failure that made Prime homes disappear on 2026-09-11: the
// Vercel→Supabase connection dropping mid-request (ETIMEDOUT / ECONNRESET /
// UND_ERR_SOCKET) with no retry, so the catalogue silently degraded.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  clearRememberedGood,
  isRetryableStatus,
  isTransientError,
  recallGood,
  rememberGood,
  RetryableHttpError,
  STALE_MAX_AGE_MS,
  withRetry,
} from "../src/lib/resilient-fetch";

/** The shape undici throws: a TypeError whose `cause` carries the socket code. */
const fetchFailure = (code: string) => {
  const err = new TypeError("fetch failed");
  (err as unknown as { cause: unknown }).cause = Object.assign(new Error("socket"), { code });
  return err;
};

test("the production socket failures are recognised as transient", () => {
  for (const code of ["ETIMEDOUT", "ECONNRESET", "UND_ERR_SOCKET", "ENOTFOUND", "EAI_AGAIN"]) {
    assert.equal(isTransientError(fetchFailure(code)), true, code);
  }
  assert.equal(
    isTransientError(new Error("Client network socket disconnected before secure TLS connection")),
    true,
  );
});

test("a database answer is not transient", () => {
  assert.equal(isTransientError(new Error("[supabase] HTTP 404 Not Found")), false);
  assert.equal(isTransientError(new Error("permission denied for table floor_plans")), false);
});

test("only busy/broken statuses are retried", () => {
  for (const s of [408, 425, 429, 500, 502, 503, 504]) assert.equal(isRetryableStatus(s), true, String(s));
  for (const s of [200, 400, 401, 403, 404, 416]) assert.equal(isRetryableStatus(s), false, String(s));
});

test("a dropped connection is retried and the read succeeds", async () => {
  let calls = 0;
  const result = await withRetry(
    async () => {
      calls++;
      if (calls < 3) throw fetchFailure("ECONNRESET");
      return "400 active floor plans";
    },
    { delays: [1, 1] },
  );
  assert.equal(result, "400 active floor plans");
  assert.equal(calls, 3);
});

test("a 503 is retried; a 404 is not", async () => {
  let busy = 0;
  await withRetry(
    async () => {
      busy++;
      if (busy < 2) throw new RetryableHttpError(503, "busy");
      return "ok";
    },
    { delays: [1, 1] },
  );
  assert.equal(busy, 2);

  let missing = 0;
  await assert.rejects(
    withRetry(
      async () => {
        missing++;
        throw new Error("[supabase] HTTP 404 Not Found");
      },
      { delays: [1, 1] },
    ),
    /404/,
  );
  assert.equal(missing, 1, "a 404 must not be retried");
});

test("retries are bounded and the last error propagates", async () => {
  let calls = 0;
  await assert.rejects(
    withRetry(
      async () => {
        calls++;
        throw fetchFailure("ETIMEDOUT");
      },
      { delays: [1, 1] },
    ),
    /fetch failed/,
  );
  assert.equal(calls, 3, "one attempt plus two retries");
});

test("the last good response stands in for a failed read, until it ages out", () => {
  clearRememberedGood();
  const key = "floor_plans?is_active=eq.true";
  const t0 = 1_000_000;
  rememberGood(key, [{ slug: "prime-belmont" }], t0);

  const fresh = recallGood(key, t0 + 60_000);
  assert.deepEqual(fresh?.value, [{ slug: "prime-belmont" }]);
  assert.equal(fresh?.ageMs, 60_000);

  assert.equal(recallGood(key, t0 + STALE_MAX_AGE_MS + 1), undefined, "stale copy expires");
  assert.equal(recallGood("never-fetched", t0), undefined);
});

test("remembering many queries does not grow without bound", () => {
  clearRememberedGood();
  for (let i = 0; i < 600; i++) rememberGood(`q${i}`, i);
  assert.equal(recallGood("q599")?.value, 599, "the newest query is kept");
  assert.equal(recallGood("q0"), undefined, "the oldest was evicted");
});
