# Stage 4: Website Build (Days 15-21)

## Overview
This stage transforms content and strategy into a fully functional Shopify store. All technical implementation, theme customization, app integration, and functionality development happens here.

**Duration:** 7 Days  
**Output:** Fully functional Shopify store ready for SEO optimization  

---

## Day 15: Theme Development

### 15.1 Theme Setup

#### Install Base Theme:
```
Option A: Dawn (Free)
- Navigate to Online Store > Themes
- Add Dawn from Shopify Theme Store
- Publish as main theme

Option B: Premium Theme
- Purchase and install selected theme
- Follow theme documentation for setup
```

#### Theme Customization Checklist:
- [ ] Upload logo (all variants: color, white, single color)
- [ ] Set favicon
- [ ] Configure brand colors:
  - Primary: #4169E1 (Royal Blue)
  - Secondary: #E63946 (Vibrant Red)
  - Background: #FFFFFF
  - Text: #333333
- [ ] Set typography:
  - Headings: Nunito or Poppins
  - Body: Open Sans or Lato
- [ ] Configure button styles
- [ ] Set up announcement bar

### 15.2 Header Configuration

#### Header Elements:
```
[Logo] [Navigation: Clothing | Hats | Plush Toys | Accessories | Sale] [Search] [Account] [Cart]
```

#### Navigation Structure:
```
Main Menu:
├── Clothing
│   ├── T-Shirts & Tops
│   ├── Hoodies & Sweatshirts
│   ├── Onesies & Bodysuits
│   └── Pajamas
├── Hats & Headwear
│   ├── Baseball Caps
│   ├── Beanies
│   └── Bucket Hats
├── Plush Toys
│   ├── Classic Stuffed Animals
│   ├── Character Plush
│   └── Interactive Plush
├── Accessories
│   ├── Bags & Backpacks
│   ├── Water Bottles
│   └── Keychains & Small Items
└── Sale
```

#### Announcement Bar:
```
Text: "Free shipping on orders $50+ | Use code WELCOME15 for 15% off your first order"
Background: #4169E1 (Blue)
Text Color: #FFFFFF
Link: /collections/all
```

### 15.3 Footer Configuration

#### Footer Columns:

**Column 1: Shop**
- Clothing
- Hats & Headwear
- Plush Toys
- Accessories
- Gift Cards

**Column 2: Help**
- Contact Us
- FAQs
- Shipping Info
- Returns & Exchanges
- Size Guide

**Column 3: About**
- Our Story
- Mission
- Sustainability
- Press

**Column 4: Connect**
- Newsletter signup
- Social links (Instagram, Facebook, Pinterest)
- Contact email: hello@bwildandwonder.com

#### Footer Bottom:
```
© 2025 B's Wild And Wonder. All rights reserved.
[Privacy Policy] [Terms of Service] [Accessibility]
Payment icons: Visa, Mastercard, Amex, PayPal, Shop Pay
```

---

## Day 16: Homepage Construction

### 16.1 Homepage Section Order

```
1. Announcement Bar
2. Header
3. Hero Banner (Full-width image + text overlay)
4. Featured Collections (4 cards)
5. Mission Statement
6. Best Sellers Product Grid
7. Social Proof / Reviews
8. Newsletter Signup
9. Instagram Feed (optional)
10. Footer
```

### 16.2 Hero Section Implementation

#### Settings:
```yaml
Height: 70vh (viewport height)
Background: Full-width image
Overlay: Semi-transparent dark (rgba(0,0,0,0.3))
Text Alignment: Center
Text Color: White
```

#### Content:
```
Headline: "Helping Little Ones Live Their Best Life"
Subheadline: "Adventure-ready clothing, cozy companions, and gear for every explorer."
Primary CTA: "Start Exploring" → /collections/all
Secondary CTA: "Shop Best Sellers" → /collections/best-sellers
```

### 16.3 Featured Collections Section

#### Layout: 4-column grid (2x2 on mobile)

```
[Clothing Image]    [Hats Image]
Adventure-Ready     Hats for Little
Clothing            Explorers
Shop Now →          Shop Now →

[Plush Image]       [Accessories Image]
Cuddly Companions   Gear for Little
                    Adventurers
Shop Now →          Shop Now →
```

#### Image Specifications:
- Size: 600x600px minimum
- Aspect ratio: 1:1 (square)
- Style: Lifestyle photography with children
- Overlay: None or subtle gradient

### 16.4 Best Sellers Section

#### Configuration:
```yaml
Collection: best-sellers (create this collection)
Products to show: 8
Layout: 4-column grid (2 on mobile)
Show: Product image, title, price, quick add button
```

#### Create Best Sellers Collection:
1. Products > Collections > Create collection
2. Name: "Best Sellers"
3. Conditions: Manual (curate top 8 products)
4. Add initial products:
   - Adventure Awaits Tee
   - Brave Bear Plush
   - Mini Explorer Baseball Cap
   - Little Explorer Backpack
   - Cozy Explorer Hoodie
   - Adventure Sips Bottle
   - Wonder Bunny Rabbit
   - Sun Explorer Bucket Hat

### 16.5 Newsletter Section

#### Design:
```
Background: #F8F9FA (light gray) or #4169E1 (brand blue)
Heading: "Join the Adventure"
Subtext: "Get 15% off your first order + exclusive updates"
Input: Email field + "Subscribe" button
Privacy text: "We respect your privacy. Unsubscribe anytime."
```

#### Klaviyo Integration:
```
1. Install Klaviyo app
2. Connect to Klaviyo account
3. Create signup form in Klaviyo
4. Embed form code or use Shopify integration
5. Set up welcome email automation
```

---

## Day 17: Collection Pages

### 17.1 Collection Template Setup

#### Collection Page Structure:
```
[Breadcrumb: Home > Collection Name]
[Collection Title]
[Collection Description]
[Filter/Sort Bar]
[Product Grid]
[Load More / Pagination]
```

#### Filter Configuration:
```
Enabled Filters:
- Price (slider)
- Size (checkboxes)
- Color (swatches)
- Age Range (checkboxes)
- Availability (in stock)
```

#### Sort Options:
```
- Featured
- Best Selling
- Alphabetically, A-Z
- Alphabetically, Z-A
- Price, low to high
- Price, high to low
- Date, new to old
```

### 17.2 Create All Collections

#### Main Collections:

| Collection Name | Handle | Type | Conditions |
|----------------|--------|------|------------|
| All Products | all | Automated | All products |
| Clothing | clothing | Automated | Product type = Clothing |
| Hats & Headwear | hats-headwear | Automated | Product type = Hats |
| Plush Toys | plush-toys | Automated | Product type = Plush |
| Accessories | accessories | Automated | Product type = Accessories |
| Best Sellers | best-sellers | Manual | Curated list |
| New Arrivals | new-arrivals | Automated | Created > 30 days |
| Sale | sale | Automated | Compare at price > Price |

#### Sub-Collections (Clothing):

| Collection Name | Handle | Type | Conditions |
|----------------|--------|------|------------|
| T-Shirts & Tops | t-shirts-tops | Automated | Tag = t-shirt |
| Hoodies & Sweatshirts | hoodies-sweatshirts | Automated | Tag = hoodie |
| Onesies & Bodysuits | onesies-bodysuits | Automated | Tag = onesie |
| Pajamas | pajamas | Automated | Tag = pajamas |

### 17.3 Collection SEO Setup

For each collection, configure:
- Title tag (from Stage 3)
- Meta description (from Stage 3)
- Collection image (1200x800px)
- URL handle
- Collection description (HTML allowed)

---

## Day 18: Product Pages

### 18.1 Product Template Structure

```
[Breadcrumb]
[Product Images - Left Column]
[Product Info - Right Column]
  - Title
  - Price (with compare-at if on sale)
  - Short description
  - Variant selectors (Size, Color)
  - Quantity selector
  - Add to Cart button
  - Wishlist/Compare (if using app)
  - Shipping info snippet
  - Payment icons
[Full Description - Below]
[Product Details Tabs]
  - Description
  - Specifications
  - Shipping & Returns
[Related Products]
[Reviews Section]
```

### 18.2 Product Page Elements

#### Image Gallery:
```yaml
Main Image: 800x1000px (portrait)
Thumbnail Strip: Below or beside main image
Zoom: Enabled on hover
Lightbox: Click to expand
```

#### Variant Selectors:
```
Size: [2T] [3T] [4T] [5T] [6] [7] [8] (button style)
Color: [Blue swatch] [Red swatch] [Gray swatch] (color swatches)
```

#### Add to Cart Button:
```
Style: Full width, brand blue (#4169E1)
Text: "Add to Cart"
Hover: Darker blue (#3151b5)
Loading state: "Adding..."
Success: "Added!" + cart drawer opens
```

#### Trust Badges (below ATC):
```
[Lock icon] Secure Checkout
[Truck icon] Free shipping over $50
[Return icon] 30-day returns
[Shield icon] CPSIA Certified Safe
```

### 18.3 Product Page Apps

#### Judge.me Reviews:
```
1. Install Judge.me app
2. Configure widget placement (below product description)
3. Set up review request emails
4. Import sample reviews for launch
```

#### Product Options (if needed):
```
Apps to consider:
- Infinite Options (for personalization)
- Product Options by Bold
- Variant Image Automator
```

---

## Day 19: Static Pages

### 19.1 About Page

#### Template: page.about

```
[Hero Image - Full width]
[Mission Statement Section]
[Brand Story Section]
[Values Grid (4 values)]
[Team/Founder Section]
[Newsletter CTA]
```

#### Implementation:
1. Online Store > Pages > Add page
2. Title: "About Us"
3. Template: page (or custom page.about)
4. Add content using page builder or HTML
5. Set featured image for social sharing

### 19.2 Contact Page

#### Template: page.contact

```
[Contact Form]
  - Name (required)
  - Email (required)
  - Phone (optional)
  - Order Number (optional)
  - Message (required)
[Contact Info Sidebar]
  - Email: hello@bwildandwonder.com
  - Response time: 24 hours
  - Business hours
[FAQ Accordion]
```

#### Implementation:
1. Create page with contact form template
2. Configure form in theme settings
3. Set notification email
4. Test form submission

### 19.3 FAQ Page

#### Template: page.faq

```
[Search Bar]
[Category Tabs]
[Accordion FAQ Items]
[Still Have Questions CTA]
```

#### Implementation Options:
```
Option 1: Native accordion HTML in page content
Option 2: FAQ app (HelpCenter, FAQ Page & Product FAQ)
Option 3: Custom section in theme
```

### 19.4 Legal Pages

#### Pages to Create:
- Privacy Policy (/pages/privacy-policy)
- Terms of Service (/pages/terms-of-service)
- Refund Policy (/pages/refund-policy)
- Shipping Policy (/pages/shipping-policy)
- Size Guide (/pages/size-guide)

#### Implementation:
1. Create each as a page
2. Add content from Stage 3
3. Add to footer navigation
4. Link in checkout and cart

---

## Day 20: Cart & Checkout

### 20.1 Cart Configuration

#### Cart Type: Drawer (recommended)
```
Settings:
- Cart type: Drawer (slides from right)
- Show cart note: Yes (gift messages)
- Show shipping estimator: Yes
- Show checkout button: Yes
- Continue shopping link: Yes
```

#### Cart Drawer Contents:
```
[Cart Header: Your Cart (X items)]
[Cart Items]
  - Image
  - Product name + variant
  - Quantity selector
  - Price
  - Remove button
[Cart Note: Add a gift message...]
[Shipping Calculator]
[Subtotal]
[Checkout Button - Full width]
[Continue Shopping Link]
[Trust badges]
```

### 20.2 Checkout Customization

#### Shopify Checkout Settings:
```
Customer contact method: Email or phone
Customer information: Shipping address first
Tipping: Disabled
Order processing: Automatically fulfill orders (if using dropship app)
```

#### Checkout Branding:
```
Logo: Upload brand logo
Colors:
  - Background: #FFFFFF
  - Primary: #4169E1
  - Secondary: #E63946
  - Accents: #F8F9FA
Fonts: Match theme fonts
```

#### Checkout Apps:
```
- Order notes (enabled)
- Phone number (optional)
- Marketing consent checkbox
- Terms and conditions checkbox (required)
```

### 20.3 Post-Purchase Page

#### Setup:
```
1. Settings > Checkout > Post-purchase page
2. Enable post-purchase offers (if using app)
3. Or customize thank you page messaging
```

---

## Day 21: App Integration & Testing

### 21.1 Essential Apps Setup

#### Klaviyo (Email Marketing):
```
Setup Steps:
1. Install Klaviyo app from Shopify App Store
2. Create account or connect existing
3. Enable onsite tracking
4. Sync Shopify data
5. Create signup forms:
   - Footer newsletter
   - Exit intent popup (optional)
   - Welcome discount
6. Set up flows:
   - Welcome series
   - Abandoned cart
   - Post-purchase
   - Browse abandonment
```

#### Judge.me (Reviews):
```
Setup Steps:
1. Install Judge.me
2. Choose plan (free to start)
3. Configure widget:
   - Star rating (product page)
   - Review widget (below description)
   - Review carousel (homepage)
4. Import reviews (if migrating)
5. Set up review request emails
6. Enable photo reviews
```

#### Google Channel:
```
Setup Steps:
1. Install Google & YouTube app
2. Connect Google account
3. Set up Google Merchant Center
4. Configure product feed
5. Enable Google Analytics 4
6. Set up Google Ads (optional)
```

### 21.2 Analytics Setup

#### Google Analytics 4:
```
1. Create GA4 property
2. Get measurement ID (G-XXXXXXXX)
3. Add to Shopify:
   - Online Store > Preferences > Google Analytics
4. Enable enhanced ecommerce
5. Set up conversion events:
   - Purchase
   - Add to cart
   - Begin checkout
   - View item
```

#### Google Search Console:
```
1. Add property: bwildandwonder.com
2. Verify ownership (HTML tag or DNS)
3. Submit sitemap: /sitemap.xml
4. Set up email notifications
```

#### Facebook Pixel (optional):
```
1. Get pixel ID from Facebook Business Manager
2. Add to Shopify:
   - Online Store > Preferences > Facebook Pixel
3. Enable standard events
```

### 21.3 Pre-Launch Testing

#### Functionality Testing:
- [ ] All navigation links work
- [ ] Collection pages load correctly
- [ ] Product pages display all info
- [ ] Variants change price/image
- [ ] Add to cart works
- [ ] Cart drawer opens and updates
- [ ] Checkout process completes
- [ ] Payment processing works
- [ ] Order confirmation emails send
- [ ] Shipping calculations correct

#### Cross-Browser Testing:
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)

#### Mobile Testing:
- [ ] Responsive layout on all pages
- [ ] Touch targets large enough
- [ ] Images load correctly
- [ ] Checkout works on mobile
- [ ] Font sizes readable

#### Content Review:
- [ ] All product descriptions loaded
- [ ] No placeholder text remaining
- [ ] All images have alt text
- [ ] Legal pages complete
- [ ] Contact info correct

---

## Stage 4 Deliverables Checklist

### Theme & Design:
- [ ] Theme installed and customized
- [ ] Brand colors implemented
- [ ] Typography configured
- [ ] Logo and favicon uploaded
- [ ] Header navigation complete
- [ ] Footer configured

### Pages Built:
- [ ] Homepage complete with all sections
- [ ] 4 main collection pages
- [ ] 8 sub-collection pages
- [ ] 60 product pages
- [ ] About page
- [ ] Contact page
- [ ] FAQ page
- [ ] Size guide page
- [ ] All legal pages

### Functionality:
- [ ] Cart drawer working
- [ ] Checkout customized
- [ ] Payment gateways active
- [ ] Shipping rates configured
- [ ] Tax settings correct

### Apps Integrated:
- [ ] Klaviyo connected
- [ ] Judge.me installed
- [ ] Google Analytics active
- [ ] Search Console verified
- [ ] Any additional apps configured

### Pre-Stage 5 Requirements:
- [ ] All functionality tested
- [ ] No broken links
- [ ] Mobile responsive
- [ ] Site speed acceptable
- [ ] Ready for SEO implementation

---

**Next Stage:** Stage 5 - SEO Optimization
