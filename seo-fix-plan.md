# SEO Fix Plan: Factory Direct Homes Center

## Critical Issues Found (from Google Search Console)

### 1. **Duplicate Content - No Canonical Tags** 🔴 HIGH PRIORITY
**Problem:** Same floor plans accessible via multiple URLs, Google doesn't know which to index

**Examples:**
- `/floor-plans/singlewides` vs `/floor-plans/single-wides`
- `/floor-plans/details/dutch-aspire-silverton-2856h32174` vs `/special-plans/details/dutch-aspire-silverton-2856h32174`
- Multiple paths to same floor plan

**Fix:** Add canonical tags pointing to the primary URL

---

### 2. **Dev/Staging Site Indexed** 🔴 HIGH PRIORITY
**Problem:** `dev.factorydirecthomescenter.com` URLs appearing in Google search

**Affected URLs:**
- `dev.factorydirecthomescenter.com/brands/impressive`
- `dev.factorydirecthomescenter.com/floor-plans/details/...`
- `dev.factorydirecthomescenter.com/special-plans/details/...`

**Fix:** 
- Add `robots.txt` to dev site blocking all crawlers
- Add meta noindex to all dev pages
- Remove dev URLs from sitemap

---

### 3. **Test/Invalid URLs Indexed** 🔴 HIGH PRIORITY
**Problem:** Test data and invalid URLs in search index

**Examples:**
- `/brands/netflix`
- `/brands/nike`
- `/brands/champion-home-builders` (old/incorrect)
- `/bm-test`
- `/series/factory-direct-homes-center`

**Fix:**
- Delete these pages or add noindex
- Set up 301 redirects to proper pages
- Remove from sitemap

---

### 4. **URL Parameter Issues** 🟡 MEDIUM PRIORITY
**Problem:** Pagination/filter URLs creating duplicates

**Example:**
- `/floor-plans?fc=3&p=1`

**Fix:**
- Configure URL parameters in Google Search Console
- Add canonical tags to filtered pages
- Consider using AJAX for filters instead of URL parameters

---

### 5. **Inconsistent URL Structure** 🟡 MEDIUM PRIORITY
**Problem:** Some URLs missing hyphens or have typos

**Examples:**
- `/floor-plans/dutch-aspire1676h32259` (missing hyphen)
- Various inconsistent naming patterns

**Fix:**
- Standardize all URLs
- Set up 301 redirects for old/incorrect URLs

---

## Implementation Priority

1. **Week 1:** Block dev site from indexing (robots.txt + noindex)
2. **Week 1:** Remove/delete test URLs
3. **Week 2:** Add canonical tags to all floor plan pages
4. **Week 2:** Set up 301 redirects for old URLs
5. **Week 3:** Configure URL parameters in GSC
6. **Week 4:** Standardize URL structure

## Files to Create/Modify

1. `/robots.txt` - Block dev crawlers
2. Canonical tags on all floor plan templates
3. `.htaccess` or server config for 301 redirects
4. Updated sitemap.xml (remove dev/test URLs)
5. Google Search Console configuration
