# 🧪 STAKING FIXES TEST PLAN

## Overview
Test plan untuk memvalidasi semua critical fixes yang telah diimplementasikan untuk staking functionality.

## 🎯 Test Objectives
1. Memastikan position mapping logic bekerja dengan benar
2. Memvalidasi pool ID format handling
3. Mengkonfirmasi error handling yang user-friendly
4. Memastikan optimistic updates dengan rollback
5. Validasi UI consistency dan parameter clarity

## 📋 Test Cases

### **Test Case 1: Position Mapping Logic**
**Objective:** Memastikan stakes masuk ke pool yang benar

**Scenario 1.1: Pool Position YES, User Agrees**
1. Buka pool dengan position "YES"
2. User pilih "Agree" (setuju dengan pool)
3. Stake $10
4. **Expected:** `agreeStakes` bertambah $10, `disagreeStakes` tidak berubah

**Scenario 1.2: Pool Position YES, User Disagrees**
1. Buka pool dengan position "YES"
2. User pilih "Disagree" (melawan pool)
3. Stake $10
4. **Expected:** `disagreeStakes` bertambah $10, `agreeStakes` tidak berubah

**Scenario 1.3: Pool Position NO, User Agrees**
1. Buka pool dengan position "NO"
2. User pilih "Agree" (setuju dengan pool)
3. Stake $10
4. **Expected:** `disagreeStakes` bertambah $10, `agreeStakes` tidak berubah

**Scenario 1.4: Pool Position NO, User Disagrees**
1. Buka pool dengan position "NO"
2. User pilih "Disagree" (melawan pool)
3. Stake $10
4. **Expected:** `agreeStakes` bertambah $10, `disagreeStakes` tidak berubah

**Validation Steps:**
- Check console logs: `[usePoolStaking] 🎯 OPTIMISTIC UPDATE:`
- Verify calculation logic: `Pool YES + User agree = YES+10, NO+0`
- Confirm local state updates match expected pattern
- Verify contract receives correct `userAgreesWithPool` parameter

### **Test Case 2: Pool ID Format Handling**
**Objective:** Memastikan pool ID parsing bekerja untuk berbagai format

**Scenario 2.1: Numeric Pool ID**
1. Pool ID: "5"
2. Expected extraction: "5"

**Scenario 2.2: Hyphenated Pool ID**
1. Pool ID: "news-123-5"
2. Expected extraction: "5" (last part)

**Scenario 2.3: Simple Hyphen Format**
1. Pool ID: "pool-5"
2. Expected extraction: "5"

**Scenario 2.4: Complex Format**
1. Pool ID: "some-long-prefix-123-5"
2. Expected extraction: "5"

**Validation Steps:**
- Check console logs: `[StakingService] 🎯 FIXED Stake Mapping:`
- Verify `poolId.extractionMethod` is correct
- Confirm `poolId.extracted` matches expected numeric value
- Ensure no errors for valid formats

### **Test Case 3: Minimum Stake Validation**
**Objective:** Memastikan consistency antara UI, validation, dan text

**Scenario 3.1: Below Minimum ($5)**
1. Masukkan amount: $5
2. Click "Confirm Stake"
3. **Expected:** Error message "Minimum stake amount is $10 USDC"
4. **Expected:** No transaction initiated

**Scenario 3.2: Exact Minimum ($10)**
1. Masukkan amount: $10
2. Click "Confirm Stake"
3. **Expected:** Transaction berhasil dimulai

**Scenario 3.3: Above Minimum ($50)**
1. Masukkan amount: $50
2. Click "Confirm Stake"
3. **Expected:** Transaction berhasil dimulai

**Validation Steps:**
- Check UI text displays "Minimum $10 USDC"
- Verify validation logic at $10 threshold
- Confirm console warning for amounts below $10

### **Test Case 4: Error Handling & User Feedback**
**Objective:** Memastikan error messages yang user-friendly

**Scenario 4.1: User Cancels Transaction**
1. Mulai stake process
2. Cancel di wallet modal
3. **Expected:** Error message "Transaction was cancelled. No changes were made."
4. **Expected:** UI state rollback ke original values

**Scenario 4.2: Insufficient Funds**
1. Hubungkan wallet dengan ETH < 0.001
2. Coba stake $10
3. **Expected:** Error message "Insufficient funds for gas fees..."

**Scenario 4.3: Already Staked Different Position**
1. Stake $10 pada pool dengan posisi "agree"
2. Coba stake $5 pada pool yang sama dengan posisi "disagree"
3. **Expected:** Error message about position consistency

**Scenario 4.4: Network/Connection Error**
1. Matikan internet connection
2. Coba stake
3. **Expected:** User-friendly error message (not technical)

**Validation Steps:**
- Check error display component appears
- Verify error messages are user-friendly
- Confirm rollback mechanism works on errors
- Validate loading states during errors

### **Test Case 5: State Management & Race Conditions**
**Objective:** Memastikan optimistic updates dan rollback bekerja

**Scenario 5.1: Successful Transaction**
1. Stake $10 pada pool
2. **Expected:** UI immediately shows updated stakes
3. **Expected:** After confirmation, state persists
4. **Expected:** No rollback occurs

**Scenario 5.2: Failed Transaction**
1. Stake $10, tapi simulate error (e.g., reject wallet)
2. **Expected:** UI immediately shows updated stakes (optimistic)
3. **Expected:** After error, UI rolls back to original values
4. **Expected:** Console log shows rollback message

**Scenario 5.3: Rapid Multiple Clicks**
1. Click "Confirm Stake" multiple times quickly
2. **Expected:** Only one transaction processed
3. **Expected:** Loading state prevents multiple submissions
4. **Expected:** Final state is correct

**Validation Steps:**
- Monitor console for `[usePoolStaking] 🔄 ROLLING BACK` messages
- Verify state consistency after failures
- Check loading states during processing
- Confirm no duplicate transactions

### **Test Case 6: Contract Parameter Mapping**
**Objective:** Memastikan parameter dikirim ke contract dengan benar

**Scenario 6.1: Parameter Validation**
1. Monitor console logs saat stake
2. **Expected:** `[Forter/write] 📤 FIXED Sending to contract stake():`
3. **Expected:** `userAgreesWithPool: true/false` (not `userPosition`)
4. **Expected:** Clear documentation in logs

**Scenario 6.2: Event Parsing**
1. Setelah successful stake, check event logs
2. **Expected:** `[Forter/write] 🔍 FIXED Decoded Staked event:`
3. **Expected:** `interpretation: "User agrees/disagrees with pool creator"`

**Validation Steps:**
- Verify parameter naming consistency
- Check event parsing logic
- Confirm documentation clarity

## 🔧 Testing Tools & Commands

### Console Monitoring
Monitor these console log patterns:
- `[usePoolStaking] 🎯 OPTIMISTIC UPDATE:`
- `[StakingService] 🎯 FIXED Stake Mapping:`
- `[Forter/write] 📤 FIXED Sending to contract stake():`
- `[usePoolStaking] 🔄 ROLLING BACK`

### Manual Testing Checklist
- [ ] Position mapping correct untuk semua 4 scenarios
- [ ] Pool ID extraction works untuk berbagai formats
- [ ] Minimum stake validation consistent
- [ ] Error messages user-friendly
- [ ] Rollback mechanism functional
- [ ] No race conditions
- [ ] Contract parameters correctly mapped

### Automated Testing (Future)
```typescript
// Example test case for position mapping
describe('Position Mapping', () => {
  test('Pool YES, User agrees → agreeStakes increase', () => {
    const pool = { position: 'YES', agreeStakes: 100, disagreeStakes: 50 };
    const result = calculateStakeUpdate(pool, 'agree', 10);
    expect(result.agreeStakesIncrease).toBe(10);
    expect(result.disagreeStakesIncrease).toBe(0);
  });
});
```

## 🚨 Critical Validation Points

### Must Pass Before Production:
1. **Position Mapping Logic**: ALL 4 scenarios must work correctly
2. **Error Handling**: User-friendly messages for common errors
3. **State Consistency**: No race conditions or corrupted state
4. **Parameter Mapping**: Contract receives correct parameters

### Should Pass Before Production:
1. **Pool ID Handling**: Works for all expected formats
2. **UI Consistency**: All text and validation aligned
3. **User Experience**: Smooth flow with proper feedback

## 📊 Success Criteria

### Functional Criteria:
- ✅ All position mapping scenarios work correctly
- ✅ Error handling covers 80% of common failure cases
- ✅ State management consistent across success/failure scenarios
- ✅ UI provides clear feedback for all user actions

### Technical Criteria:
- ✅ No console errors or warnings
- ✅ Optimistic updates with rollback functional
- ✅ Contract parameters correctly mapped
- ✅ Event parsing works as expected

### User Experience Criteria:
- ✅ Clear error messages in user language
- ✅ Immediate UI feedback for all actions
- ✅ Consistent behavior across different scenarios
- ✅ No confusing or misleading information

## 🐛 Known Issues & Limitations

### Current Limitations:
1. Alert-based error messages (consider toast notifications in future)
2. Limited automated test coverage
3. Hardcoded error message strings

### Future Improvements:
1. Implement toast notification system
2. Add comprehensive unit/integration tests
3. Internationalization for error messages
4. Enhanced logging for debugging

---

**Test Status:** 🟡 Ready for Testing
**Last Updated:** 2025-10-27
**Test Engineer:** Claude AI Assistant