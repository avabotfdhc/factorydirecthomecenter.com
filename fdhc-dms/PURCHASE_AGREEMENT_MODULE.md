# Purchase Agreement Module - Added to FDHC DMS

## ✅ What's Been Added

### Database Schema (002_purchase_agreements.sql)
- **purchase_agreements** table with:
  - Auto-generated agreement numbers (YYYY-XXXX format)
  - Client info (auto-populated from lead)
  - Home info (auto-populated from deal/home)
  - Financial terms (auto-populated from deal)
  - Deposit tracking
  - Signature management
  - Document generation
- **purchase_agreement_templates** table for customizable templates
- RLS policies for security
- Auto-population trigger

### Server Actions (app/actions/purchase-agreements.ts)
- `createPurchaseAgreement()` - Create new agreement with auto-population
- `getPurchaseAgreements()` - List agreements with filters
- `getPurchaseAgreementById()` - Get single agreement detail
- `updatePurchaseAgreement()` - Update agreement
- `signPurchaseAgreement()` - Record signatures
- `recordDepositPayment()` - Track deposit payments
- `generateAgreementDocument()` - Generate populated document

### Pages & Components
- `/dashboard/agreements` - List all agreements
- `/dashboard/agreements/new` - Create new agreement
- `/dashboard/agreements/[id]` - View agreement detail
- Updated Sidebar with Agreements link

### API Routes
- `/api/agreements` - REST endpoints for agreements

## 🎯 Key Features

### 1. Auto-Population (No Double Entry!)
When you create a purchase agreement:
- **Client info** auto-fills from lead (name, phone, email, address)
- **Home info** auto-fills from deal/home (manufacturer, model, serial)
- **Financial terms** auto-fills from deal (prices, down payment, monthly payment)

### 2. Connected to Deals & Clients
- Every agreement links to a **Deal** (financial terms)
- Every agreement links to a **Lead** (client profile)
- Quick navigation between agreement → deal → client

### 3. Agreement Number Generation
Auto-generated format: `2024-0001`, `2024-0002`, etc.

### 4. Signature Workflow
- Client signs first
- Sales rep signs second  
- Manager signs last
- Status updates automatically

### 5. Deposit Tracking
- Record deposit amount and payment method
- Track if deposit is paid
- View payment date

## 📋 How to Use

### Creating a Purchase Agreement:
1. Go to `/dashboard/agreements`
2. Click "New Agreement"
3. Select client (lead) - info auto-fills
4. Select deal - financial terms auto-fill
5. Add deposit amount
6. Add site address (if different from client address)
7. Add any special terms
8. Submit

### Viewing an Agreement:
- Full client info displayed
- Complete financial breakdown
- Signature status for all parties
- Deposit payment status
- Links to related deal and client profile

## 🔗 Integration Points

The purchase agreement connects to:
- **Leads** - Client contact info
- **Deals** - Financial terms and pricing
- **Home Inventory** - Home specifications
- **Activities** - Logs when agreements are created

## 🚀 Next Steps to Deploy

1. Run the migration:
   ```sql
   -- Copy contents of supabase/migrations/002_purchase_agreements.sql
   -- Run in Supabase SQL Editor
   ```

2. The module is ready to use!

## 📁 Files Added/Modified

```
app/
├── actions/purchase-agreements.ts      ✅ NEW
├── (dashboard)/agreements/
│   ├── page.tsx                        ✅ NEW
│   ├── new/page.tsx                    ✅ NEW
│   └── [id]/page.tsx                   ✅ NEW
├── api/agreements/route.ts             ✅ NEW
└── components/Sidebar.tsx              ✅ MODIFIED

supabase/migrations/
└── 002_purchase_agreements.sql         ✅ NEW

app/types/index.ts                      ✅ MODIFIED (added types)
```

The Purchase Agreement module is now fully integrated and ready to reduce double entry by auto-populating data from deals and client profiles!
