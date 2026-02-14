# Quick Reference: UPI Payment Verification

## 🎯 The Problem

When users pay via UPI apps (GPay, PhonePe), your app doesn't automatically know when payment is complete.

## ✅ The Solution

**Three-layer automatic detection system:**

```
┌─────────────────────────────────────────────────────────────┐
│                    USER COMPLETES PAYMENT                    │
│                         in UPI App                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │   How does your app know? 3 ways:       │
        └─────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────────┐                    ┌──────────────────┐
│  1. APP STATE    │                    │  2. DEEP LINK    │
│   MONITORING     │                    │     RETURN       │
└──────────────────┘                    └──────────────────┘
        │                                           │
        │ Detects when user                        │ UPI app redirects
        │ switches back to app                     │ back to your app
        │                                           │
        └─────────────────────┬─────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  3. PERIODIC     │
                    │    POLLING       │
                    └──────────────────┘
                              │
                              │ Checks every 6 sec
                              │ for 2 minutes
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │    VERIFY PAYMENT WITH BACKEND API      │
        │    (Verify_Payment_Status_Api)          │
        └─────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
        ┌──────────────┐            ┌──────────────┐
        │   SUCCESS    │            │    FAILED    │
        └──────────────┘            └──────────────┘
                │                           │
                ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ Update Wallet    │        │ Show Error       │
    │ Show Success     │        │ Message          │
    │ Stop Monitoring  │        │ Stop Monitoring  │
    └──────────────────┘        └──────────────────┘
```

## 📝 What You Need to Implement

### 1. Backend API Endpoint

**Action**: `'Verify_Payment_Status_Api'`

```typescript
// Request
{ txnid: "TXN123456" }

// Response
{
    success: true,
    status: 'success' | 'failed' | 'pending',
    message: 'Payment verified',
    amount: '1000'
}
```

### 2. Deep Link Configuration

**Android** (`AndroidManifest.xml`):

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="yourappname" android:host="payment" />
</intent-filter>
```

**iOS** (`Info.plist`):

```xml
<key>CFBundleURLSchemes</key>
<array>
    <string>yourappname</string>
</array>
```

### 3. Replace PayU VPA

In `wallet/index.tsx` line ~397:

```typescript
vpa: 'payu@payu', // ❌ Replace with actual PayU VPA
vpa: 'merchant@payu', // ✅ Your actual VPA
```

## 🔄 Complete Flow Example

```typescript
// 1. User selects GPay
handleUpiAppSelect(gpay)
    ↓
// 2. Launch GPay app
UpiPaymentService.launchUpiApp(...)
    ↓
// 3. Start monitoring
PaymentVerificationService.startPaymentMonitoring(txnid, verifyUpiPayment)
    ↓
// 4. User completes payment in GPay
// ... user is in GPay app ...
    ↓
// 5. User returns to app (any of 3 ways)
AppState: 'active' → verifyUpiPayment(txnid)
OR
Deep Link: yourapp://payment?txnid=123 → verifyUpiPayment(txnid)
OR
Polling: Every 6 sec → verifyUpiPayment(txnid)
    ↓
// 6. Verify with backend
props.walletActions('Verify_Payment_Status_Api', { txnid })
    ↓
// 7. Backend calls PayU verification API
POST https://info.payu.in/merchant/postservice.php?form=2
    ↓
// 8. Update wallet balance
if (status === 'success') {
    updateWalletInDatabase(userId, amount)
    return { success: true, status: 'success' }
}
    ↓
// 9. Show success & reload balance
Toast.show('Payment Successful')
load() // Refresh wallet balance
PaymentVerificationService.stopPaymentMonitoring()
```

## ⏱️ Timeline

```
0:00 - User clicks "Recharge"
0:05 - User selects GPay
0:06 - GPay opens, monitoring starts
0:15 - User enters UPI PIN
0:20 - Payment processing...
0:25 - Payment successful in GPay
0:26 - User presses back button
       ↓
       ✅ App State Monitoring detects return
       ✅ verifyUpiPayment() called immediately
       ✅ Backend API called
       ✅ Payment verified
       ✅ Wallet balance updated
       ✅ Success toast shown
       ✅ Monitoring stopped
0:27 - User sees updated balance
```

## 🧪 Testing Checklist

-   [ ] Complete payment in GPay → Return immediately
-   [ ] Complete payment in PhonePe → Wait 10 seconds → Return
-   [ ] Complete payment → Close app → Reopen app
-   [ ] Start payment → Cancel in UPI app → Return
-   [ ] Start payment → Don't return for 30 seconds
-   [ ] Check console logs for verification attempts
-   [ ] Verify wallet balance updates correctly
-   [ ] Test with no internet after payment

## 🐛 Debugging

### Check These Logs:

```
✅ "Starting payment monitoring for txnid: TXN123456"
✅ "App state changed to: active"
✅ "Verifying UPI payment for txnid: TXN123456"
✅ "Payment verification successful"
✅ "Stopping payment monitoring"
```

### Common Issues:

| Issue                     | Cause                     | Solution                          |
| ------------------------- | ------------------------- | --------------------------------- |
| Balance not updating      | Backend not updating DB   | Check backend wallet update logic |
| Infinite polling          | Backend returns 'pending' | Check PayU API response mapping   |
| No verification on return | App state not detected    | Check useEffect dependencies      |
| Deep links not working    | Missing configuration     | Add intent filters / URL schemes  |

## 📊 Monitoring Behavior

| Scenario                   | Detection Method     | Time to Verify |
| -------------------------- | -------------------- | -------------- |
| User returns immediately   | App State Monitoring | < 1 second     |
| User returns via deep link | Deep Link Handler    | < 1 second     |
| User doesn't return        | Polling              | 6-12 seconds   |
| App closed during payment  | Deep Link on reopen  | On app launch  |

## 🎯 Key Points

1. **Automatic**: No user action needed after payment
2. **Reliable**: 3 detection methods ensure payment is verified
3. **Fast**: Usually verified within 1 second of return
4. **Efficient**: Stops automatically after verification
5. **Robust**: Works even if user closes app

## 📁 Files Modified

```
src/
├── services/
│   ├── paymentVerificationService.ts  ← NEW (monitoring logic)
│   └── upiPaymentService.ts           ← Existing (UPI intents)
├── modules/
│   └── wallet/
│       └── index.tsx                  ← Modified (integration)
└── Backend API
    └── Verify_Payment_Status_Api      ← TO IMPLEMENT
```

## 🚀 Next Steps

1. **Implement Backend API** - Most important!
2. **Add Deep Link Config** - For instant detection
3. **Test on Real Device** - With actual UPI apps
4. **Replace PayU VPA** - With your merchant VPA
5. **Monitor Logs** - During testing

---

**Need more details?** See `UPI_PAYMENT_VERIFICATION_GUIDE.md` for complete documentation.
