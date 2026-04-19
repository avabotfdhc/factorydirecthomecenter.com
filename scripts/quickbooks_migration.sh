#!/bin/bash

# QuickBooks Desktop Pro Plus 2023 - Migration Script
# This script helps move QuickBooks to a new computer

echo "=========================================="
echo "  QuickBooks Desktop Pro Plus 2023"
echo "      Migration Helper"
echo "=========================================="
echo ""

# Colors for readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to pause
pause() {
    echo ""
    read -p "Press Enter to continue..."
}

# Step 1: Pre-flight check
echo -e "${BLUE}Step 1: Pre-Flight Check${NC}"
echo "----------------------------------------"
echo "Before we start, make sure you have:"
echo "  ✓ Your QuickBooks license key"
echo "  ✓ Your product number"
echo "  ✓ A USB drive or cloud storage for transfer"
echo "  ✓ QuickBooks installer downloaded on new PC"
echo ""
echo "Don't have the installer? Download it from:"
echo "https://quickbooks.intuit.com/learn-support/en-us/help-article/download-install/quickbooks-desktop-software/L2tlcnVpZS9lcnJvcg"
echo ""
pause

# Step 2: Backup company files
echo ""
echo -e "${BLUE}Step 2: Backup Your Company Files${NC}"
echo "----------------------------------------"
echo "Your company files are typically stored in:"
echo "  C:\\Users\\[YourName]\\Documents\\Intuit\\QuickBooks\\Company Files"
echo ""
echo "${YELLOW}ACTION REQUIRED:${NC}"
echo "1. Open QuickBooks on your OLD computer"
echo "2. Go to File → Back Up Company → Create Local Backup"
echo "3. Choose 'Local Backup' and click Next"
echo "4. Save the .qbb backup file to your USB drive or cloud folder"
echo "5. Also copy any .qbw files directly if you prefer"
echo ""
echo "${GREEN}Pro Tip:${NC} Include the date in your backup filename!"
echo "   Example: FDHC_QuickBooks_2026-04-01.qbb"
echo ""
pause

# Step 3: Find additional files
echo ""
echo -e "${BLUE}Step 3: Additional Files to Copy${NC}"
echo "----------------------------------------"
echo "You may also want to backup:"
echo ""
echo "Templates & Forms:"
echo "  C:\\Users\\[YourName]\\AppData\\Local\\Intuit\\QuickBooks [Year]"
echo ""
echo "Accountant's Copy (if you have one):"
echo "  Look for .qbx or .qba files"
echo ""
echo "Custom Reports:"
echo "  These are saved within your company file"
echo ""
pause

# Step 4: Install on new computer
echo ""
echo -e "${BLUE}Step 4: Install on New Computer${NC}"
echo "----------------------------------------"
echo "${YELLOW}ACTION REQUIRED:${NC}"
echo "1. Run the QuickBooks installer on your NEW computer"
echo "2. Enter your license and product numbers when prompted"
echo "3. Complete the installation"
echo "4. DO NOT restore your backup yet - we'll do that next"
echo ""
pause

# Step 5: Restore backup
echo ""
echo -e "${BLUE}Step 5: Restore Your Company File${NC}"
echo "----------------------------------------"
echo "${YELLOW}ACTION REQUIRED:${NC}"
echo "1. Copy your .qbb backup file from USB to new computer"
echo "2. Open QuickBooks on NEW computer"
echo "3. Go to File → Open or Restore Company"
echo "4. Select 'Restore a backup copy' and click Next"
echo "5. Choose 'Local backup' and click Next"
echo "6. Browse to your .qbb file and click Open"
echo "7. Choose where to save the restored .qbw file"
echo "   (Recommended: Documents\\Intuit\\QuickBooks\\Company Files)"
echo "8. Click Save"
echo ""
pause

# Step 6: Verify and update
echo ""
echo -e "${BLUE}Step 6: Verify Everything Works${NC}"
echo "----------------------------------------"
echo "${YELLOW}Checklist:${NC}"
echo "  □ Open your company file successfully"
echo "  □ Verify all accounts and transactions are present"
echo "  □ Check that reports look correct"
echo "  □ Test printing if you use that feature"
echo "  □ Verify bank feeds are connected (may need to re-link)"
echo ""
echo "${GREEN}Note:${NC} You may need to re-enter some passwords"
echo "      (bank feeds, email settings, etc.)"
echo ""
pause

# Step 7: Update QuickBooks
echo ""
echo -e "${BLUE}Step 7: Update QuickBooks${NC}"
echo "----------------------------------------"
echo "${YELLOW}ACTION REQUIRED:${NC}"
echo "1. Go to Help → Update QuickBooks Desktop"
echo "2. Click 'Update Now' tab"
echo "3. Click 'Get Updates'"
echo "4. Restart QuickBooks when prompted"
echo ""
echo "This ensures you have the latest features and security patches."
echo ""
pause

# Completion
echo ""
echo "=========================================="
echo -e "${GREEN}  Migration Complete!${NC}"
echo "=========================================="
echo ""
echo "Your QuickBooks should now be running on your new computer."
echo ""
echo "${YELLOW}Important Reminders:${NC}"
echo "  • Keep your old computer's backup until you're 100% sure everything works"
echo "  • Set up automatic backups on the new computer"
echo "  • Consider QuickBooks Online for easier multi-device access in the future"
echo ""
echo "Need help? QuickBooks Support: 1-800-446-8848"
echo ""
read -p "Press Enter to exit..."
