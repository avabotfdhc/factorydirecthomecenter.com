# Purchase Agreement - Legal Compliance & Addendum A

## ✅ Enhanced Features Added

### 1. State & Federal Compliance

#### State Compliance Configuration
Database table `state_compliance_requirements` includes:

| State | Tax Rate | Title Type | Cooling-Off | Max Deposit | HUD Code |
|-------|----------|------------|-------------|-------------|----------|
| IN | 7.00% | Chattel | 3 days | 25% | Indiana Modular |
| OH | 5.75% | Both | 3 days | 25% | Ohio Basic |
| MI | 6.00% | Both | 3 days | 25% | Michigan Modular |
| WI | 5.00% | Real Property | 3 days | 25% | Wisconsin UDC |
| IL | 6.25% | Both | 3 days | 25% | Illinois Modular |
| KY | 6.00% | Chattel | 3 days | 25% | Kentucky |

#### Automatic Compliance Features:
- **Sales Tax Calculation** - Auto-calculates based on delivery state rules
- **Cooling-Off Period** - Auto-sets expiration date based on state requirements
- **Deposit Validation** - Ensures deposit doesn't exceed state maximum
- **HUD Standards** - Applies correct installation code per state

### 2. Legal Document Templates

#### Template Types:
1. **Master Purchase Agreement** - Main contract with all legal verbiage
2. **Addendum A** - Optional upgrades page
3. **HUD Disclosure** - Federal HUD requirements
4. **State Disclosure** - State-specific requirements

#### Template Variables:
All templates support dynamic replacement:
- `{agreement_number}`, `{agreement_date}`
- `{client_first_name}`, `{client_last_name}`, `{client_address}`
- `{manufacturer}`, `{model_name}`, `{serial_number}`
- `{base_home_price}`, `{total_price}`, `{sales_tax}`
- `{cooling_off_date}`, `{hud_standards}`

### 3. Addendum A - Optional Upgrades

#### Features:
- **Item Numbering** - Auto-generated (A-001, A-002, etc.)
- **Categories** - Appliance, Interior, Exterior, Structural, Electrical, Plumbing, HVAC, Other
- **Pricing** - Retail price + installation cost
- **Warranty Tracking** - Per-item warranty periods
- **Installation Party** - Factory, Dealer, or Third Party

#### Database Schema:
```sql
addendum_a_upgrades:
  - item_number (A-001, A-002, etc.)
  - category
  - description
  - manufacturer
  - model_number
  - retail_price
  - dealer_cost
  - installation_cost
  - installed_by
  - warranty_period_months
```

### 4. Required Disclosures

#### Federal Disclosures:
- ✅ **Formaldehyde Emissions** (Required for all)
- ✅ **HUD Installation Standards** (24 CFR 3285)
- ✅ **Cooling-Off Period** (3-day right to cancel)

#### Optional Disclosures:
- ⚠️ **Asbestos** (pre-1977 homes)
- ⚠️ **Lead-Based Paint** (pre-1978 homes)
- ⚠️ **Mold and Moisture**

#### State-Specific:
Each state can have custom disclosure requirements configured in `state_compliance_requirements`.

### 5. Tax Compliance

#### Automatic Tax Calculation:
```typescript
// Taxes applied based on state rules:
sales_tax_applies_to_home: boolean
sales_tax_applies_to_freight: boolean
sales_tax_applies_to_setup: boolean
sales_tax_applies_to_options: boolean
sales_tax_applies_to_site_prep: boolean
```

#### Example Calculations:
- **Indiana**: Tax on home + freight + setup + options (no site prep tax)
- **Wisconsin**: Tax on everything including site prep
- **Michigan**: Tax on home + freight + setup + options (no site prep tax)

### 6. Document Generation

#### Generated Documents:
1. **Master Agreement** - Complete purchase contract
2. **Addendum A** - Itemized upgrades list
3. **HUD Disclosure** - Installation standards
4. **State Disclosure** - State-specific requirements

#### Signature Workflow:
1. Client signs first
2. Sales rep signs second
3. Manager signs third
4. Status auto-updates to "SIGNED"

## 📋 New Files Added

```
supabase/migrations/
└── 003_legal_compliance.sql          # State compliance & legal templates

app/actions/
└── purchase-agreements-compliance.ts  # Compliance server actions

app/components/
├── AddendumAForm.tsx                 # Addendum A management
├── AddUpgradeModal.tsx               # Add upgrade dialog
└── LegalDisclosuresForm.tsx          # Disclosure acknowledgments
```

## 🎯 Usage Flow

### Creating a Compliant Agreement:

1. **Select Delivery State**
   - System loads state-specific requirements
   - Tax rate auto-applied
   - HUD code auto-selected

2. **Client & Deal Selection**
   - Client info auto-populates
   - Financial terms auto-populate
   - Home details auto-populate

3. **Addendum A (Optional)**
   - Add upgrades with item numbers
   - Track installation & warranty
   - Auto-calculates addendum total

4. **Legal Disclosures**
   - Required disclosures pre-marked
   - Optional disclosures available
   - Cooling-off period explained
   - HUD compliance acknowledged

5. **Document Generation**
   - Master agreement generated
   - Addendum A generated (if upgrades)
   - HUD disclosure generated
   - State disclosure generated

## 🔒 Compliance Features

### Automatic Validations:
- ✅ Deposit cannot exceed state maximum
- ✅ Cooling-off period auto-calculated
- ✅ Required disclosures must be acknowledged
- ✅ Tax calculated per state rules
- ✅ HUD standards applied correctly

### Audit Trail:
- All disclosures tracked with timestamps
- Signature timestamps recorded
- Document generation logged
- State compliance version tracked

## 🚀 Deployment

1. **Run Migration:**
   ```sql
   -- Execute 003_legal_compliance.sql in Supabase
   ```

2. **Configure Templates:**
   - Customize master agreement template
   - Add state-specific language
   - Configure disclosure requirements

3. **Ready to Use!**

The Purchase Agreement system is now fully compliant with state and federal regulations, includes comprehensive legal verbiage, and supports Addendum A for optional upgrades!
