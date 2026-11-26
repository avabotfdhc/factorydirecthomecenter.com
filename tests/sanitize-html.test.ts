// The /admin floor-plan HTML is rendered as HTML on every plan page, so the
// cleaner in src/lib/sanitize-html.ts must remove anything that can run code
// while keeping ordinary formatting (security fixes, 2026-11-26).
import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeHtml } from "../src/lib/sanitize-html";

test("keeps simple formatting", () => {
  const html = "<p>Three <strong>big</strong> bedrooms</p><ul><li>Island</li></ul><h3>Kitchen</h3>";
  assert.equal(sanitizeHtml(html), html);
});

test("drops scripts, styles and iframes with their contents", () => {
  const out = sanitizeHtml('<p>a</p><script>alert(1)</script><style>p{}</style><iframe src="x"></iframe><p>b</p>');
  assert.equal(out, "<p>a</p><p>b</p>");
});

test("strips event handlers and every other attribute", () => {
  const out = sanitizeHtml('<p onclick="x()" style="color:red" class="c">hi</p><img src=x onerror=alert(1)>');
  assert.equal(out, "<p>hi</p>");
});

test("keeps safe links and neutralises script URLs", () => {
  assert.equal(sanitizeHtml('<a href="/floor-plans/summit">see</a>'), '<a href="/floor-plans/summit">see</a>');
  assert.equal(sanitizeHtml('<a href="javascript:alert(1)">x</a>'), "<a>x</a>");
  assert.equal(sanitizeHtml('<a href="java\tscript:alert(1)">x</a>'), "<a>x</a>");
  assert.equal(sanitizeHtml('<a href="data:text/html,x">x</a>'), "<a>x</a>");
  assert.match(sanitizeHtml('<a href="https://example.com">x</a>'), /rel="noopener noreferrer nofollow"/);
});

test("nested and unterminated tricks end up as text", () => {
  assert.ok(!/<script/i.test(sanitizeHtml("<scr<script></script>ipt>alert(1)</script>")));
  assert.ok(!/<img/i.test(sanitizeHtml("<p>x</p><img src=x onerror=alert(1)")));
  assert.ok(!/<!--/.test(sanitizeHtml("<!-- <script>alert(1)</script> -->ok")));
});
