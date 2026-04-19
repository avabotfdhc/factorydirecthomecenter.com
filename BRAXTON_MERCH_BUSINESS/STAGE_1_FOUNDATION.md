# Stage 1: Foundation (Days 1-3)

## Overview
This stage establishes the fundamental infrastructure for B's Wild And Wonder. All foundational elements must be completed before proceeding to product strategy.

**Duration:** 3 Days  
**Output:** Fully configured Shopify store ready for product upload  

---

## Day 1: Domain & Legal Foundation

### 1.1 Domain Setup

#### Tasks:
- [ ] Purchase BWildAndWonder.com via Shopify or Namecheap
- [ ] Enable domain privacy protection
- [ ] Configure DNS settings for Shopify
- [ ] Set up domain email forwarding (hello@bwildandwonder.com)
- [ ] Verify domain ownership in Google Search Console

#### DNS Configuration:
```
Type: A Record
Name: @
Value: 23.227.38.65

Type: CNAME Record
Name: www
Value: shops.myshopify.com
```

### 1.2 Legal Entity & Compliance

#### Business Registration:
- [ ] Register business name (DBA if needed)
- [ ] Obtain EIN from IRS (free)
- [ ] Check state sales tax requirements
- [ ] Register for sales tax permit if required

#### Required Legal Pages (Draft):

**Privacy Policy Must Include:**
- Data collection practices
- Cookie usage
- Third-party services (Shopify, Google Analytics, Klaviyo)
- Children's privacy (COPPA compliance for under 13)
- Contact information for privacy inquiries
- Data retention policies

**Terms of Service Must Include:**
- Purchase agreement terms
- Shipping and delivery terms
- Return and refund policy
- Intellectual property rights
- Limitation of liability
- Governing law

**Refund Policy (Recommended):**
```
Returns accepted within 30 days of delivery
Items must be unworn, unwashed, with tags attached
Customer pays return shipping unless defective
Exchanges available for size issues
Refunds processed within 5-7 business days
```

**Shipping Policy Must Include:**
- Processing time (1-3 business days)
- Shipping methods and timeframes
- International shipping details
- Tracking information process
- Lost package procedures

---

## Day 2: Shopify Store Configuration

### 2.1 Store Setup

#### Basic Settings:
- [ ] Create Shopify account
- [ ] Select Basic plan ($39/month)
- [ ] Set store name: "B's Wild And Wonder"
- [ ] Set store email: hello@bwildandwonder.com
- [ ] Configure store timezone: America/New_York
- [ ] Set default currency: USD
- [ ] Enable CAD for Canadian customers
- [ ] Set weight unit: pounds (lb)

#### Store Details:
```
Store Name: B's Wild And Wonder
Store Email: hello@bwildandwonder.com
Customer Email: hello@bwildandwonder.com
Phone: [Add business phone]
Address: [Business address or registered agent]
Legal Name: [Registered business name]
```

### 2.2 Payment Configuration

#### Shopify Payments Setup:
- [ ] Complete Shopify Payments application
- [ ] Connect bank account for payouts
- [ ] Set payout schedule (daily recommended)
- [ ] Enable test mode for development
- [ ] Configure fraud protection settings

#### Alternative Payment Methods:
- [ ] Enable PayPal Express Checkout
- [ ] Enable Shop Pay (automatic with Shopify Payments)
- [ ] Enable Apple Pay (if available)
- [ ] Enable Google Pay (if available)

#### Tax Configuration:
- [ ] Enable automatic tax calculation
- [ ] Configure US tax settings by state
- [ ] Configure Canadian tax settings (GST/HST/PST)
- [ ] Set tax display: included in price or added at checkout

### 2.3 Shipping Configuration

#### Shipping Zones:
```
Zone 1: United States
- Standard Shipping: $5.99 (5-10 business days)
- Express Shipping: $12.99 (3-5 business days)
- Free Shipping: Orders $50+

Zone 2: Canada
- Standard Shipping: $9.99 (7-14 business days)
- Express Shipping: $19.99 (5-7 business days)
- Free Shipping: Orders $75+
```

#### Shipping Settings:
- [ ] Set default package size (12" x 9" x 3", 0.5 lb)
- [ ] Enable shipping notifications
- [ ] Configure tracking email templates
- [ ] Set handling time: 1-3 business days

---

## Day 3: Brand Implementation

### 3.1 Visual Identity Setup

#### Logo Requirements:
- [ ] Upload logo to Shopify (SVG preferred, PNG minimum 500px)
- [ ] Create favicon (32x32, 180x180 for Apple touch)
- [ ] Prepare logo variants:
  - Full color (primary use)
  - White version (for dark backgrounds)
  - Single color (for special uses)

#### Color Implementation:
```css
/* Shopify Theme Colors */
--color-primary: #4169E1;        /* Royal Blue */
--color-primary-dark: #3151b5;   /* Darker Blue for hover */
--color-secondary: #E63946;      /* Vibrant Red */
--color-secondary-dark: #c42b36; /* Darker Red for hover */
--color-background: #FFFFFF;     /* White */
--color-text: #333333;           /* Dark Gray */
--color-text-light: #666666;     /* Medium Gray */
--color-accent: #F8F9FA;         /* Light Gray backgrounds */
```

#### Typography:
- [ ] Select primary font: Nunito or Poppins (friendly, rounded)
- [ ] Select secondary font: Open Sans or Lato (body text)
- [ ] Configure heading hierarchy in theme

### 3.2 Theme Selection & Installation

#### Theme Options:

**Option A: Dawn (Free)**
- Native Online Store 2.0
- Fast loading
- Highly customizable
- Good for starting

**Option B: Premium Theme ($150-350)**
- Impulse (Archetype) - $380
- Prestige (Maestrooo) - $350
- Motion (Archetype) - $380

#### Theme Configuration:
- [ ] Install selected theme
- [ ] Configure color scheme with brand colors
- [ ] Set typography
- [ ] Configure header layout
- [ ] Set up announcement bar
- [ ] Configure footer content
- [ ] Set up homepage sections

### 3.3 Essential Apps Installation

#### Must-Have Apps (Free Tier):

| App | Purpose | Cost |
|-----|---------|------|
| Klaviyo | Email marketing | Free (up to 250 contacts) |
| Judge.me | Product reviews | Free plan available |
| Google Channel | Google Shopping | Free |
| Shopify Email | Basic email campaigns | Free (up to 10,000 emails/month) |
| Privacy Policy Generator | Legal compliance | Free |

#### Recommended Paid Apps:

| App | Purpose | Cost |
|-----|---------|------|
| Loox | Photo reviews | $9.99/month |
| SEO Manager | SEO optimization | $20/month |
| PageFly | Landing pages | Free tier available |
| Tidio | Live chat | Free tier available |

---

## Stage 1 Deliverables Checklist

### Domain & Legal:
- [ ] Domain purchased and configured
- [ ] Privacy policy drafted
- [ ] Terms of service drafted
- [ ] Refund policy established
- [ ] Shipping policy established
- [ ] Business registration complete

### Shopify Setup:
- [ ] Store created and configured
- [ ] Payment gateways active
- [ ] Tax settings configured
- [ ] Shipping rates set
- [ ] Email notifications customized

### Brand Implementation:
- [ ] Logo uploaded
- [ ] Colors configured
- [ ] Typography set
- [ ] Theme installed and customized
- [ ] Essential apps installed

### Pre-Stage 2 Requirements:
- [ ] Store is password-protected for development
- [ ] Test order completed successfully
- [ ] All legal pages published
- [ ] Contact information complete
- [ ] Brand assets organized in file system

---

## Stage 1 Timeline

| Day | Focus | Hours Est. |
|-----|-------|------------|
| 1 | Domain, Legal, Business Setup | 4-6 |
| 2 | Shopify Configuration | 6-8 |
| 3 | Brand Implementation, Theme Setup | 6-8 |
| **Total** | | **16-22 hours** |

---

## Resources & Templates

### Legal Page Templates:
- Shopify Privacy Policy Generator: https://www.shopify.com/tools/policy-generator
- Terms of Service Template: Available in Shopify admin
- Refund Policy Template: Customize based on FashionTIY terms

### Design Resources:
- Logo specifications: See IMAGE_GENERATION_PROMPTS.md
- Brand guidelines: Refer to BRAXTON_WEBSITE_BUILD_PLAN.md
- Color codes: #4169E1 (Blue), #E63946 (Red)

### Support Resources:
- Shopify Help Center: https://help.shopify.com
- FashionTIY Support: https://www.fashiontiy.com/HelpCenter.html
- Domain support: Contact registrar

---

**Next Stage:** Stage 2 - Product Strategy  
**Prerequisites for Next Stage:** All checkboxes above completed
