/**
 * Fixture storefront for exercising the monitor end to end without touching a
 * real retailer. Simulates the full drop: waiting room → out of stock →
 * in stock → cart → checkout, plus a mock webhook endpoint.
 *
 *   node test/fixture-server.mjs
 *   (then point config.json at http://localhost:8787/product)
 */
import { createServer } from "node:http";

const PORT = Number(process.env.PORT ?? 8787);
let productHits = 0;
const webhookHits = [];

const page = (title, body) => `<!doctype html><html><head><meta charset="utf-8">
<title>${title}</title></head><body style="font-family:system-ui;padding:3rem">${body}</body></html>`;

const routes = {
  "/waitingroom": () =>
    page(
      "Waiting Room",
      `<div id="queueSection">
         <h1>You are in line</h1>
         <p class="queue-position">Position: <span id="n">312</span></p>
       </div>
       <script>
         // Mimics a real waiting room advancing you itself. The monitor must
         // NOT reload — it should simply observe this navigation.
         let n = 312;
         setInterval(() => { n = Math.max(0, n - 90); document.getElementById('n').textContent = n; }, 2000);
         setTimeout(() => { location.href = '/product'; }, 6000);
       </script>`,
    ),

  "/product": () => {
    productHits += 1;
    // BLOCK=1 serves a bot-challenge interstitial instead, to exercise the
    // "detected a CAPTCHA, page the human, don't try to solve it" path.
    if (process.env.BLOCK === "1") {
      return page("Just a moment", `<div id="px-captcha">Verify you are human</div>`);
    }
    if (productHits === 1) return { redirect: "/waitingroom" };
    if (productHits === 2) {
      return page(
        "Product",
        `<h1>The Thing</h1>
         <button data-test="add-to-cart" disabled>Sold out</button>
         <p data-test="sold-out">Sold out</p>`,
      );
    }
    return page(
      "Product",
      `<h1>The Thing</h1>
       <button data-test="add-to-cart" onclick="document.getElementById('drawer').style.display='block'">Add to cart</button>
       <div id="drawer" data-test="cart-added-drawer" style="display:none">
         Added to cart. <a href="/cart">View cart</a>
       </div>`,
    );
  },

  "/cart": () =>
    page(
      "Cart",
      `<h1>Your cart</h1>
       <p>The Thing × 1</p>
       <button data-test="checkout" onclick="location.href='/checkout'">Checkout</button>`,
    ),

  "/checkout": () =>
    page(
      "Checkout",
      `<h1>Checkout</h1>
       <form action="/checkout/pay" data-test="payment-form">
         <input placeholder="Card number" />
         <button type="submit">Pay</button>
       </form>`,
    ),
};

createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/hook") {
    let size = 0;
    req.on("data", (c) => (size += c.length));
    req.on("end", () => {
      webhookHits.push({ at: new Date().toISOString(), bytes: size });
      console.log(`[webhook] delivery #${webhookHits.length} (${size} bytes)`);
      res.writeHead(204).end();
    });
    return;
  }

  if (url.pathname === "/__hits") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ productHits, webhookHits }));
    return;
  }

  const handler = routes[url.pathname];
  if (!handler) {
    res.writeHead(404, { "content-type": "text/plain" }).end("not found");
    return;
  }

  const out = handler();
  if (typeof out === "object" && out.redirect) {
    console.log(`[fixture] ${url.pathname} → 302 ${out.redirect}`);
    res.writeHead(302, { location: out.redirect }).end();
    return;
  }

  console.log(`[fixture] ${url.pathname} (product hits: ${productHits})`);
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(out);
}).listen(PORT, () => console.log(`Fixture storefront on http://localhost:${PORT}`));
