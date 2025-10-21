# 🧪 Testing Guide - Forter News UI Integration

**Last Updated:** October 22, 2025

---

## 🚀 Quick Start

### **Prerequisites**

1. ✅ Node.js installed (v18+)
2. ✅ Wallet dengan Base Sepolia ETH untuk gas
3. ✅ USDC tokens di Base Sepolia (untuk staking/pool creation)
4. ✅ RainbowKit-compatible wallet (MetaMask, Coinbase Wallet, etc.)

### **Setup**

```bash
# 1. Navigate to frontend directory
cd /Users/miftachulhuda/Documents/Base\ Workshop/forter-news\ copy/frontend

# 2. Install dependencies (if not done)
npm install

# 3. Verify environment variables
cat .env.local
# Should show NEXT_PUBLIC_USE_CONTRACTS=true

# 4. Start development server
npm run dev

# 5. Open browser
open http://localhost:3000
```

---

## 📋 Testing Scenarios

### **Scenario 1: Create NEWS**

**Goal:** Create a new prediction on blockchain

**Steps:**

1. **Navigate to Create NEWS**
   - Go to http://localhost:3000/news/create
   - Or click "Create NEWS" button on homepage

2. **Connect Wallet**
   - Click wallet connect button in header
   - Select your wallet (MetaMask/Coinbase)
   - Approve connection to Base Sepolia
   - Verify wallet address shows in header

3. **Fill Form**
   - **Title:** "ETH will hit $5000 by Dec 2025" (min 10 chars)
   - **Description:** Long description explaining why (min 50 chars)
   - **Category:** Select "Crypto"
   - **Resolution Date:** Select future date (e.g., 2025-12-31)
   - **Resolution Criteria:** "ETH price >= $5000 on CoinGecko at 23:59 UTC on Dec 31, 2025" (min 20 chars)

4. **Preview** (Optional)
   - Click "Preview" button
   - Verify form data looks correct

5. **Submit**
   - Click "Create NEWS & Post to FC"
   - See floating indicator: "Creating NEWS on blockchain..."
   - Approve transaction in wallet
   - Wait for confirmation

6. **Verify Success**
   - See success indicator: "NEWS created successfully!"
   - Click "View on BaseScan" link (optional)
   - Wait 2 seconds for auto-redirect to /news
   - Verify your NEWS appears in the list

**Expected Results:**
- ✅ Transaction succeeds
- ✅ NEWS appears in news list
- ✅ NEWS shows as "active" status
- ✅ Creator address matches your wallet

---

### **Scenario 2: Create Pool**

**Goal:** Create analysis pool under existing NEWS

**Prerequisites:**
- ✅ At least 20 USDC in wallet
- ✅ Existing active NEWS to analyze

**Steps:**

1. **Navigate to NEWS Detail**
   - Go to /news page
   - Click on any active NEWS card
   - Or go to /news/[newsId] directly

2. **Start Pool Creation**
   - Click "+ Create Pool" button
   - Redirects to /news/[id]/pool/create

3. **Connect Wallet** (if not connected)

4. **Fill Pool Form**
   - **Position:** Select YES or NO
   - **Reasoning:** Write detailed analysis (min 100 chars)
     - Example: "Based on current market trends and upcoming ETH upgrades, the price trajectory shows strong momentum. Technical analysis indicates..."
   - **Image Upload:** (Optional but recommended)
     - Drag & drop chart image
     - Or paste imgur URL
     - Add caption
   - **Evidence Links:** (Optional)
     - Add supporting URLs
     - Click "+ Add Evidence Link" for more
   - **Creator Stake:** Enter amount (min $20)
     - Example: 50

5. **Preview** (Optional)
   - Click "Preview" to see how pool will look

6. **Submit**
   - Click "Create Pool & Post to FC"
   - System validates USDC balance >= stake amount
   - See floating indicator: "Creating pool on blockchain..."
   - Approve USDC spend (first time only)
   - Approve pool creation transaction
   - Wait for confirmation

7. **Verify Success**
   - See success indicator: "Pool created successfully! Staked 50 USDC"
   - Click "View on BaseScan" link (optional)
   - Wait 2 seconds for auto-redirect to /news/[id]
   - Verify your pool appears in pools list

**Expected Results:**
- ✅ Transaction succeeds
- ✅ Pool appears in news detail page
- ✅ Pool shows creator address = your wallet
- ✅ Pool shows correct position (YES/NO)
- ✅ Pool shows creator stake = entered amount
- ✅ Total staked = creator stake

---

### **Scenario 3: Stake on Pool**

**Goal:** Stake USDC on existing pool

**Prerequisites:**
- ✅ At least 1 USDC in wallet
- ✅ Existing active pool

**Steps:**

1. **Navigate to NEWS Detail**
   - Go to /news/[id]
   - Find pool you want to stake on

2. **Connect Wallet** (if not connected)

3. **Select Position**
   - Click "Stake Agree" (support pool position)
   - OR "Stake Disagree" (oppose pool position)
   - Inline form appears

4. **Enter Stake Amount**
   - Enter amount (min $1)
   - Example: 10
   - See potential rewards calculation
     - If pool CORRECT/WRONG
     - Expected ROI %

5. **Confirm Stake**
   - Click "Confirm Stake $10"
   - System validates USDC balance >= amount
   - See floating indicator: "Staking 10 USDC on Support/Oppose..."
   - Approve USDC spend (first time only)
   - Approve stake transaction
   - Wait for confirmation

6. **Verify Success**
   - See success indicator: "Successfully staked 10 USDC!"
   - Click "View on BaseScan" link (optional)
   - Pool stats auto-refresh
   - Verify agreeStakes or disagreeStakes increased
   - Verify totalStaked increased

**Expected Results:**
- ✅ Transaction succeeds
- ✅ Pool stats update
- ✅ Stakes progress bars update
- ✅ Your stake added to pool

---

### **Scenario 4: Resolve NEWS (Admin Only)**

**Goal:** Resolve news and trigger auto-distribution

**Prerequisites:**
- ✅ Connected wallet is admin address
- ✅ NEWS has reached resolution date
- ✅ Verifiable outcome data available

**Steps:**

1. **Navigate to NEWS Detail**
   - Go to active NEWS detail page
   - Verify "Admin Actions" card shows

2. **Open Resolve Modal**
   - Click "Resolve News" button
   - Modal appears

3. **Review NEWS Info**
   - Verify title, description, criteria
   - Verify resolution date

4. **Select Outcome**
   - Click "YES" or "NO" based on actual outcome
   - Button highlights

5. **Enter Resolution Data**
   - **Data Source URL:** Paste verification link
     - Example: https://www.coingecko.com/en/coins/ethereum
   - **Notes:** (Optional) Add context
     - Example: "ETH hit $4,987 on Dec 31, 2025 at 23:59 UTC per CoinGecko. Did not reach $5000."

6. **Submit Resolution**
   - Click "Resolve as YES/NO"
   - See floating indicator: "Resolving NEWS on blockchain..."
   - Approve transaction
   - Wait for confirmation

7. **Verify Success**
   - See success indicator: "NEWS resolved as YES/NO! Rewards auto-distributed."
   - Modal auto-closes after 2 seconds
   - Page refreshes
   - Verify "Resolved" banner shows
   - Verify outcome badge (YES/NO)
   - Verify all pools show "Resolved Pool" status
   - Verify auto-distribute info shows on pools

**Expected Results:**
- ✅ Transaction succeeds
- ✅ NEWS status changes to "resolved"
- ✅ All pools under NEWS get resolved
- ✅ Rewards auto-distributed to winners
- ✅ Pool cards show distribution details

---

## 🐛 Error Scenarios to Test

### **1. Insufficient Balance**

**Test:** Try to create pool with stake > USDC balance

**Expected:**
- ❌ Error indicator: "Insufficient USDC balance"
- ❌ Transaction does not proceed

### **2. Wallet Not Connected**

**Test:** Try to submit without connecting wallet

**Expected:**
- ❌ Error indicator: "Please connect your wallet first"
- ❌ Transaction does not proceed

### **3. Form Validation**

**Test:** Try to submit with invalid form data

**Expected:**
- ❌ Button remains disabled
- ❌ Validation messages show

### **4. Transaction Rejection**

**Test:** Reject transaction in wallet popup

**Expected:**
- ❌ Error indicator: "Transaction rejected by user" (or similar)
- ❌ Button re-enables
- ❌ Can retry

### **5. Network Issues**

**Test:** Disconnect internet during transaction

**Expected:**
- ❌ Error indicator with network error message
- ❌ Transaction fails gracefully

---

## 📊 Visual Indicators to Verify

### **Loading State**
- [ ] Spinner animates
- [ ] Message shows action ("Creating NEWS...")
- [ ] Button disabled
- [ ] User can see progress

### **Success State**
- [ ] Green checkmark icon
- [ ] Success message clear and specific
- [ ] Transaction hash link works
- [ ] BaseScan page loads correctly
- [ ] Auto-dismiss after 5 seconds
- [ ] Auto-redirect (where applicable)

### **Error State**
- [ ] Red X icon
- [ ] Error message clear and helpful
- [ ] Auto-dismiss after 6 seconds
- [ ] User can retry action

---

## 🔍 Contract Verification

After each transaction, verify on BaseScan:

1. **Transaction Hash**
   - Click "View on BaseScan" link
   - Verify transaction succeeded (green checkmark)
   - Verify from/to addresses correct
   - Verify gas used

2. **Contract Events**
   - Check "Logs" tab
   - Verify correct event emitted:
     - `NewsCreated` for news creation
     - `PoolCreated` for pool creation
     - `Staked` for staking
     - `Resolved` for resolution

3. **State Changes**
   - Verify contract state updated
   - Check token transfers (for USDC)

---

## ✅ Testing Checklist

### **Basic Functionality**
- [ ] Wallet connection works
- [ ] Create NEWS succeeds
- [ ] Create Pool succeeds
- [ ] Stake on pool succeeds
- [ ] Resolve NEWS succeeds (admin)

### **UI/UX**
- [ ] Loading indicators show
- [ ] Success indicators show
- [ ] Error indicators show
- [ ] Buttons update states correctly
- [ ] Auto-redirects work
- [ ] Auto-refresh works

### **Validation**
- [ ] Wallet check works
- [ ] Balance check works
- [ ] Form validation works
- [ ] Admin check works (for resolution)

### **Edge Cases**
- [ ] Insufficient balance handled
- [ ] Wallet disconnect handled
- [ ] Transaction rejection handled
- [ ] Network error handled
- [ ] Multiple transactions work

### **Contract Integration**
- [ ] Transactions appear on BaseScan
- [ ] Events emitted correctly
- [ ] State changes reflected
- [ ] Token transfers work

---

## 🆘 Troubleshooting

### **Issue: Wallet won't connect**
**Solution:**
- Ensure wallet extension installed
- Check network is Base Sepolia
- Clear browser cache
- Try different wallet

### **Issue: Transaction fails immediately**
**Solution:**
- Check USDC balance
- Check ETH balance for gas
- Verify contract addresses in .env.local
- Check console for errors

### **Issue: Transaction pending forever**
**Solution:**
- Check network status
- Try increasing gas price
- Check wallet transaction queue
- Wait or cancel and retry

### **Issue: Success but data not showing**
**Solution:**
- Refresh page manually
- Check BaseScan for confirmation
- Clear browser cache
- Verify contract data

---

## 📝 Bug Report Template

When reporting bugs, include:

```
**Bug Description:**
[What happened vs what should happen]

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. Enter...
4. See error...

**Environment:**
- Browser: [Chrome/Firefox/Safari]
- Wallet: [MetaMask/Coinbase]
- Network: Base Sepolia
- Wallet Address: [0x...]

**Screenshots:**
[Attach screenshots]

**Console Errors:**
[Paste console errors]

**Transaction Hash:**
[If applicable]
```

---

## 🎯 Success Criteria

Integration is successful when:

1. ✅ All 4 main flows work end-to-end
2. ✅ Transactions confirmed on BaseScan
3. ✅ UI feedback clear and helpful
4. ✅ Error handling graceful
5. ✅ Data updates reflected in UI
6. ✅ No console errors (except expected warnings)

---

**Happy Testing!** 🚀

If you encounter issues, check:
1. Console logs
2. Network tab
3. BaseScan transaction details
4. Contract addresses
5. Wallet connection

For questions, refer to:
- `UI_INTEGRATION_COMPLETE.md` - Integration details
- `CONTRACT_IMPLEMENTATION_AUDIT.md` - Contract coverage
- `INTEGRATION_GUIDE.md` - Technical guide
