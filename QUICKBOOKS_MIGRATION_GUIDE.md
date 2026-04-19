# QuickBooks + Files Migration Guide
# Factory Direct Homes Center
# From: [Old Laptop] To: [New Laptop]
# Date: March 26, 2026

---

## PRE-MIGRATION CHECKLIST

### Gather Information (Do This First!)

**QuickBooks Information:**
- [ ] QuickBooks Version: _______________
- [ ] License Number: _______________
- [ ] Product Key: _______________
- [ ] Company File Name(s): _______________
- [ ] Company File Location: _______________
- [ ] Single User or Multi-User: _______________

**Payroll & Payment Services:**
- [ ] Payroll Service Login: _______________
- [ ] Merchant Services Login: _______________
- [ ] Intuit Data Protect Status: _______________

**Custom Settings to Document:**
- [ ] Custom Invoice Templates: _______________
- [ ] Custom Report Templates: _______________
- [ ] Memorized Reports: _______________
- [ ] Chart of Accounts Customizations: _______________
- [ ] User Permissions (if multi-user): _______________

**Computer Information:**
- [ ] Old Laptop OS: _______________
- [ ] New Laptop OS: _______________
- [ ] Estimated Data Size: _______________ GB

---

## PHASE 1: PREPARATION (Day Before Migration)

### Step 1: Verify QuickBooks is Up to Date
**On Old Laptop:**
1. Open QuickBooks
2. Go to Help → Update QuickBooks Desktop
3. Click Update Now
4. Wait for update to complete
5. Restart QuickBooks

**Why:** Ensures compatibility and latest features

---

### Step 2: Create Full Company File Backup
**On Old Laptop:**
1. Open QuickBooks
2. Go to File → Back Up Company → Create Local Backup
3. Select Local Backup → Next
4. Choose location: External drive or cloud storage
5. Name it: "QB_Backup_[Date]_PreMigration"
6. Click Save
7. Wait for backup to complete (may take 10-30 minutes)
8. Verify backup file exists and is not 0KB

**Backup File Location:** _______________
**Backup File Size:** _______________

---

### Step 3: Document Custom Settings

**Print/Save These Reports:**
1. Chart of Accounts
   - Reports → List → Account Listing
   - Print to PDF

2. Item List
   - Reports → List → Item Listing
   - Print to PDF

3. Memorized Reports List
   - Reports → Memorized Reports
   - Screenshot or write down names

4. Custom Templates
   - Lists → Templates
   - Screenshot each custom template

5. User List (if multi-user)
   - Company → Set Up Users and Passwords
   - Document each user and permissions

**Save these PDFs to:** _______________

---

### Step 4: Note Payroll & Payment Settings

**Payroll Setup:**
1. Employees → Payroll Center
2. Screenshot or write down:
   - Payroll schedule
   - Tax forms filed
   - Direct deposit setup
   - Workers comp settings

**Payment Services:**
1. Customers → Credit Card Processing Activities
2. Document:
   - Merchant account number
   - Processing rates
   - Connected bank accounts

---

### Step 5: Prepare New Laptop

**On New Laptop:**
1. [ ] Connect to internet
2. [ ] Install all Windows/Mac updates
3. [ ] Create user account (same name as old laptop preferred)
4. [ ] Install antivirus software
5. [ ] Verify at least 50GB free space
6. [ ] Have USB drive ready (minimum 32GB, 256GB recommended)

---

## PHASE 2: QUICKBOOKS MIGRATION

### METHOD A: QuickBooks Migrator Tool (Recommended for Single User)

**Time Required:** 1-2 hours
**Best For:** QuickBooks Desktop 2018 or newer, single user

---

#### Step 1: Run Migrator Tool on Old Laptop

1. **Open QuickBooks**
2. **Go to:** File → Utilities → Move QuickBooks to another computer
3. **Click:** "I'm Ready"
4. **Create Password:**
   - Password: _______________
   - Confirm: _______________
   - **WRITE THIS DOWN - You cannot recover it!**
5. **Select USB Drive:**
   - Choose your USB drive from dropdown
   - Ensure it has at least 250MB free
6. **Click:** "Copy Data"
7. **Wait:** This takes 15-45 minutes depending on file size
8. **When Complete:** Safely eject USB drive

**Migrator Tool Copies:**
- ✅ QuickBooks Desktop application
- ✅ Last 3 company files opened
- ✅ Basic settings and preferences

**Migrator Tool Does NOT Copy:**
- ❌ Payroll setup
- ❌ Payment services setup
- ❌ Intuit Data Protect
- ❌ Custom templates (all)
- ❌ Memorized reports
- ❌ Printer settings
- ❌ Attachments
- ❌ Multi-user settings

---

#### Step 2: Install on New Laptop

1. **Insert USB Drive** into new laptop
2. **Open USB Drive** in File Explorer
3. **Double-click:** Move_QuickBooks.bat
   - If Windows blocks it: Right-click → Run as Administrator
4. **Enter Password:** (the one you created in Step 1)
5. **Click:** "Continue" or "Install"
6. **Wait:** Installation takes 20-60 minutes
7. **When Complete:** Click "Finish"
8. **Open QuickBooks** to verify it works

---

#### Step 3: Activate QuickBooks

1. **Open QuickBooks** on new laptop
2. **Go to:** Help → Activate QuickBooks Desktop
3. **Enter:** License Number and Product Key
4. **Follow:** On-screen activation steps
5. **Verify:** Company file opens correctly

---

### METHOD B: Manual Transfer (If Migrator Tool Fails or Multi-User)

**Time Required:** 2-3 hours
**Best For:** Older QuickBooks, multi-user setup, or if Migrator Tool fails

---

#### Step 1: Deactivate QuickBooks on Old Laptop (Optional)

1. **Open QuickBooks**
2. **Go to:** Help → Deactivate QuickBooks Desktop
3. **Click:** "Deactivate"
4. **Why:** Frees up license for new computer

---

#### Step 2: Install QuickBooks on New Laptop

1. **Download installer** from Intuit website OR use installation CD
2. **Run installer** on new laptop
3. **Enter:** License Number and Product Key
4. **Complete installation**
5. **DO NOT open company file yet**

---

#### Step 3: Transfer Company File

1. **Locate company file** on old laptop:
   - Usually in: C:\Users\[YourName]\Documents\Intuit\QuickBooks\Company Files\
   - Or search for: *.QBW files

2. **Copy company file** to USB drive or cloud storage
   - File name: [YourCompany].QBW
   - Also copy: [YourCompany].QBW.ND (network data file)
   - Also copy: [YourCompany].DSN (data source name)

3. **On new laptop:**
   - Create folder: C:\Users\[YourName]\Documents\Intuit\QuickBooks\Company Files\
   - Paste company file(s) into this folder

---

#### Step 4: Restore Company File

1. **Open QuickBooks** on new laptop
2. **Go to:** File → Open or Restore Company
3. **Select:** "Open a company file"
4. **Navigate to:** Location where you pasted the file
5. **Select:** [YourCompany].QBW
6. **Click:** Open
7. **If prompted to update:** Click "Yes" (this updates file format if needed)

---

## PHASE 3: RECONFIGURATION (Required for Both Methods)

### Step 1: Set Up Payroll (If Applicable)

1. **Open QuickBooks**
2. **Go to:** Employees → Payroll Center
3. **Click:** "Set Up Payroll"
4. **Sign in** with your Intuit payroll account
5. **Verify:** All employees are listed
6. **Verify:** Payroll schedules are correct
7. **Test:** Run a sample payroll (do not submit)

**Payroll Account Login:** _______________
**Payroll Service Key:** _______________

---

### Step 2: Set Up Payment Services (If Applicable)

1. **Go to:** Customers → Credit Card Processing Activities
2. **Click:** "Sign In" or "Set Up"
3. **Enter:** Merchant account credentials
4. **Verify:** Bank account connections
5. **Test:** Process a $1 test transaction (void immediately)

**Merchant Account Login:** _______________
**Connected Bank Account:** _______________

---

### Step 3: Restore Custom Templates

**If you saved templates before migration:**

1. **Locate template files** on old laptop:
   - Usually in: C:\Users\[YourName]\AppData\Local\Intuit\QuickBooks [Year]\Company Files\
   - Look for: *.QBT files (template files)

2. **Copy to new laptop:**
   - Same location on new laptop
   - Or: Lists → Templates → Import

3. **Verify:**
   - Lists → Templates
   - All custom templates appear

---

### Step 4: Restore Memorized Reports

**Option A: If backed up:**
1. Reports → Memorized Reports
2. Click "Import"
3. Select backup file

**Option B: Recreate manually:**
1. Open each report you use regularly
2. Customize as needed
3. Reports → Memorize Report
4. Name it and save

---

### Step 5: Set Up Intuit Data Protect (If Used)

1. **Go to:** File → Back Up Company → Set Up/Activate Online Backup
2. **Sign in** with Intuit account
3. **Configure:** Backup schedule
4. **Verify:** First backup completes successfully

---

### Step 6: Configure Printer Settings

1. **Go to:** File → Printer Setup
2. **For each form type:**
   - Select appropriate printer
   - Set paper size
   - Test print

3. **Common forms to configure:**
   - Invoices
   - Checks
   - Reports
   - Labels

---

### Step 7: Set Up Email

1. **Go to:** Edit → Preferences → Send Forms
2. **Select:** Email method
   - Web Mail (Gmail, Yahoo, etc.)
   - Outlook
   - QuickBooks Email
3. **Enter:** Email credentials
4. **Test:** Send test email to yourself

**Email for QB:** _______________

---

## PHASE 4: FILE MIGRATION (Non-QuickBooks Files)

### Method 1: External SSD (Recommended for Speed)

**Equipment Needed:**
- External SSD (1TB recommended) - $80-120
- USB-C or USB 3.0 cable

**Steps:**

1. **Connect SSD to old laptop**
2. **Copy these folders:**
   ```
   C:\Users\[YourName]\
   ├── Documents
   ├── Desktop
   ├── Downloads
   ├── Pictures
   ├── Music
   ├── Videos
   ├── AppData\Local (for application data)
   ```

3. **Also copy:**
   - QuickBooks backup files
   - Any custom software installers
   - License keys document
   - Browser bookmarks (export first)
   - Email archives (if not cloud-based)

4. **Eject SSD safely**
5. **Connect to new laptop**
6. **Copy everything to matching locations**

**Estimated Time:** 30 minutes to 4 hours (depending on data size)

---

### Method 2: Windows Migration Tool (Windows 10/11)

**If both computers run Windows 10 or 11:**

**On New Laptop:**
1. Settings → System → Recovery
2. "Transfer files from another PC"
3. Follow on-screen instructions
4. Choose transfer method:
   - Over WiFi (slow but no cables)
   - Using external drive (faster)

**Estimated Time:** 1-8 hours

---

### Method 3: Cloud Storage (Best for Small Amounts)

**Services:** OneDrive, Google Drive, Dropbox

**Steps:**
1. Install cloud client on old laptop
2. Upload all files (takes hours/days)
3. Install same client on new laptop
4. Download/sync all files

**Estimated Time:** Hours to days (depends on internet speed)

---

## PHASE 5: VERIFICATION & TESTING

### QuickBooks Verification Checklist

- [ ] Open QuickBooks without errors
- [ ] Open company file successfully
- [ ] Verify Chart of Accounts is complete
- [ ] Check recent transactions are present
- [ ] Run a P&L report (compare to old laptop)
- [ ] Run a Balance Sheet (compare to old laptop)
 [ ] Verify all bank accounts are connected
- [ ] Test printing an invoice
- [ ] Test sending an email from QB
- [ ] Verify payroll is set up (if applicable)
- [ ] Verify payment processing works (if applicable)
- [ ] Check custom templates are available
- [ ] Verify memorized reports are present
- [ ] Test backup function

---

### File Verification Checklist

- [ ] All Documents folder files transferred
- [ ] Desktop files and shortcuts transferred
- [ ] Pictures transferred
- [ ] Downloads folder (if needed)
- [ ] Browser bookmarks restored
- [ ] Email client configured
- [ ] Custom software installed
- [ ] License keys work
- [ ] Printer drivers installed
- [ ] Network drives mapped (if applicable)

---

## TROUBLESHOOTING

### Problem: QuickBooks won't activate
**Solution:**
1. Call Intuit: 1-800-446-8848
2. Explain you're migrating to new computer
3. They can reset activation

### Problem: Company file won't open
**Solution:**
1. Try File → Utilities → Verify Data
2. If errors found: File → Utilities → Rebuild Data
3. If still won't open: Restore from backup

### Problem: Missing transactions
**Solution:**
1. Check date range in reports
2. Verify you're opening correct company file
3. Check for multiple company files

### Problem: Payroll not working
**Solution:**
1. Call Intuit Payroll Support: 1-888-712-9702
2. Have your Payroll Service Key ready
3. They can reactivate on new computer

### Problem: Custom templates missing
**Solution:**
1. Go back to old laptop
2. Locate template files: *.QBT
3. Copy to new laptop manually
4. Import via Lists → Templates → Import

---

## POST-MIGRATION TASKS

### Week 1 After Migration

- [ ] Run daily backups (verify they work)
- [ ] Process a payroll (if applicable)
- [ ] Process payments (if applicable)
- [ ] Reconcile bank accounts
- [ ] Check all automated reports
- [ ] Verify email notifications work

### Month 1 After Migration

- [ ] Compare month-end reports to old system
- [ ] Verify all integrations work
- [ ] Train any other users on new setup
- [ ] Document any new workflows
- [ ] Securely wipe old laptop (when ready)

---

## EMERGENCY CONTACTS

**QuickBooks Support:** 1-800-446-8848
**QuickBooks Payroll:** 1-888-712-9702
**Intuit Merchant Services:** 1-800-558-9558
**Your IT Support:** _______________

---

## NOTES & CUSTOMIZATIONS

**Add your specific notes here:**

_______________________________________________

_______________________________________________

_______________________________________________

---

**Document Created:** March 26, 2026
**Migration Date:** _______________
**Completed By:** _______________
