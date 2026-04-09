import { getPublishedPosts } from "@/lib/blog";

const BASE_URL = "https://factorydirecthomescenter.com";

export async function GET() {
  const posts = getPublishedPosts();

  const items = posts
    .map((post) => {
      const url = `${BASE_URL}/blog/${post.slug}`;
      const pubDate = new Date(post.publishedDate).toUTCString();
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>info@factorydirecthomescenter.com (${post.author})</author>
      <category>${post.categoryLabel}</category>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Manufactured Home Blog — Factory Direct Homes Center</title>
    <link>${BASE_URL}/blog</link>
    <description>Expert guides, buyer tips, financing advice, and industry news for manufactured and modular home buyers.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/images/hero-home.jpg</url>
      <title>Factory Direct Homes Center Blog</title>
      <link>${BASE_URL}/blog</link>
    </image>${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
