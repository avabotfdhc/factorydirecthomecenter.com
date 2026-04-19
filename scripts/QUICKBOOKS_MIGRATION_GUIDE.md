# QuickBooks Desktop Pro Plus 2023 - Migration Guide

## Quick Reference Checklist

- [ ] Gather: License key, product number, USB drive or cloud storage
- [ ] Download QuickBooks installer on new PC (link below)
- [ ] Backup company file on OLD computer (File → Back Up Company)
- [ ] Install QuickBooks on NEW computer
- [ ] Restore backup on NEW computer (File → Open or Restore Company)
- [ ] Verify everything works
- [ ] Update QuickBooks (Help → Update QuickBooks Desktop)

---

## Where Your Files Are Stored

**Company Files:**
```
C:\Users\[YourName]\Documents\Intuit\QuickBooks\Company Files
```

**Templates & Forms:**
```
C:\Users\[YourName]\AppData\Local\Intuit\QuickBooks 2023
```

---

## Download QuickBooks Installer

https://quickbooks.intuit.com/learn-support/en-us/help-article/download-install/quickbooks-desktop-software/L2tlcnVpZS9lcnJvcg

---

## Detailed Step-by-Step Instructions

### Step 1: Backup on Old Computer

1. Open QuickBooks
2. Go to **File → Back Up Company → Create Local Backup**
3. Choose "Local Backup" and click **Next**
4. Save the `.qbb` file to your USB drive
5. **Pro tip:** Name it with the date (e.g., `FDHC_QuickBooks_2026-04-01.qbb`)

### Step 2: Install on New Computer

1. Download and run the QuickBooks installer
2. Enter your license and product numbers
3. Complete installation
4. **Don't restore the backup yet**

### Step 3: Restore Backup

1. Copy the `.qbb` file from USB to new computer
2. Open QuickBooks
3. Go to **File → Open or Restore Company**
4. Select "Restore a backup copy" → **Next**
5. Choose "Local backup" → **Next**
6. Browse to your `.qbb` file → **Open**
7. Choose save location (`Documents\Intuit\QuickBooks\Company Files`)
8. Click **Save**

### Step 4: Verify

- [ ] Company file opens successfully
- [ ] All accounts and transactions present
- [ ] Reports look correct
- [ ] Bank feeds connected (may need to re-link)
- [ ] Re-enter any passwords as needed

### Step 5: Update

1. Go to **Help → Update QuickBooks Desktop**
2. Click "Update Now" tab
3. Click **Get Updates**
4. Restart QuickBooks when prompted

---

## Important Reminders

- **Keep your old computer's backup** until you're 100% sure everything works
- **Set up automatic backups** on the new computer
- **Bank feeds and some passwords** will need to be re-linked/re-entered
- **QuickBooks Support:** 1-800-446-8848

---

## Migration Script

See `quickbooks_migration.sh` for an interactive bash script that walks through this process step-by-step.

To run it:
```bash
bash quickbooks_migration.sh
```

---

*Created: April 1, 2026*
