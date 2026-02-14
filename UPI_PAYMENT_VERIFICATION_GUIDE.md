# UPI Payment Verification - Complete Guide

## How Payment Verification Works After UPI Payment

When a user completes payment in a UPI app (GPay, PhonePe, etc.), your app needs to know when they return and verify if the payment was successful. Here's how the implemented solution works:

## Architecture Overview

```
User Flow:
1. User clicks Recharge → Enters amount
2. UPI Selector appears → User selects GPay
3. GPay app opens → User completes payment
4. User returns to your app (manually or via deep link)
5. ✨ App automatically detects return
6. ✨ Backend API is called to verify payment
7. ✨ Wallet balance is updated
```

## Three-Layer Detection System

### Layer 1: App State Monitoring

**File**: `paymentVerificationService.ts`

```typescript
// Monitors when app comes to foreground
AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
        // User returned to app - verify payment immediately
        verifyPayment(txnid);
    }
});
```

**What it does:**

-   Detects when user switches back to your app from UPI app
-   Immediately triggers payment verification
-   Works even if user manually switches back

### Layer 2: Deep Link Handling

**File**: `wallet/index.tsx`

```typescript
// Listen for deep link returns
Linking.addEventListener('url', (event) => {
    // UPI app can return to your app via deep link
    // URL format: yourapp://payment?txnid=123&status=success
    PaymentVerificationService.handleDeepLinkReturn(event.url);
});
```

**What it does:**

-   Handles deep links from UPI apps (if configured)
-   Extracts transaction ID from URL
-   Triggers immediate verification

**Configuration Required:**
See "Deep Link Configuration" section below

### Layer 3: Periodic Polling

**File**: `paymentVerificationService.ts`

```typescript
// Poll every 6 seconds for 2 minutes
setInterval(() => {
    verifyPayment(txnid);
}, 6000);
```

**What it does:**

-   Checks payment status every 6 seconds
-   Runs for ~2 minutes (20 attempts)
-   Catches payment completion even if other methods fail
-   Stops automatically when payment is confirmed

## Complete Payment Flow

### Step 1: User Selects UPI App

```typescript
// In wallet/index.tsx
const handleUpiAppSelect = async (app: UpiApp) => {
    // Launch UPI app
    await UpiPaymentService.launchUpiApp(app, {
        vpa: 'payu@payu',
        amount: '1000',
        transactionId: 'TXN123456',
    });

    // Start monitoring for payment completion
    PaymentVerificationService.startPaymentMonitoring(
        'TXN123456',
        verifyUpiPayment, // Callback function
        20, // Max attempts
    );
};
```

### Step 2: User Completes Payment in UPI App

-   User is in GPay/PhonePe/etc.
-   Enters UPI PIN
-   Confirms payment
-   Payment is processed

### Step 3: User Returns to Your App

**Three ways this can happen:**

1. **Manual Return**: User presses back button or switches apps

    - ✅ App State Monitoring detects this
    - ✅ Verification triggered immediately

2. **Deep Link Return**: UPI app redirects back

    - ✅ Deep Link Handler catches this
    - ✅ Verification triggered immediately

3. **User Doesn't Return**: User closes app or does something else
    - ✅ Polling continues in background
    - ✅ Payment verified within 6 seconds

### Step 4: Payment Verification

```typescript
const verifyUpiPayment = (txnid: string) => {
    // Call backend API
    props.walletActions('Verify_Payment_Status_Api', {
        txnid: txnid,
        callBack: (success, response) => {
            if (response.status === 'success') {
                // ✅ Payment successful
                PaymentVerificationService.stopPaymentMonitoring();
                Toast.show({ text1: 'Payment Successful' });
                load(); // Reload wallet balance
            } else if (response.status === 'failed') {
                // ❌ Payment failed
                PaymentVerificationService.stopPaymentMonitoring();
                Toast.show({ text1: 'Payment Failed' });
            } else {
                // ⏳ Payment pending - continue polling
                console.log('Still pending...');
            }
        },
    });
};
```

### Step 5: Wallet Balance Updated

-   Backend confirms payment
-   Wallet balance is refreshed
-   User sees updated balance
-   Success toast is shown

## Backend API Requirements

### You Need to Implement This API Endpoint

**Action Name**: `'Verify_Payment_Status_Api'`

**Request:**

```typescript
{
    txnid: 'TXN123456'; // Transaction ID from PayU
}
```

**Response Format:**

```typescript
{
    success: boolean,
    status: 'success' | 'failed' | 'pending',
    message: string,
    amount?: string,
    // ... other payment details
}
```

**Backend Implementation:**

```javascript
// Example backend endpoint
app.post('/api/verify-payment', async (req, res) => {
    const { txnid } = req.body;

    // Call PayU verification API
    const payuResponse = await verifyPaymentWithPayU(txnid);

    if (payuResponse.status === 'success') {
        // Update user's wallet balance in database
        await updateWalletBalance(userId, amount);

        return res.json({
            success: true,
            status: 'success',
            message: 'Payment verified successfully',
            amount: payuResponse.amount,
        });
    } else if (payuResponse.status === 'failure') {
        return res.json({
            success: false,
            status: 'failed',
            message: 'Payment failed',
        });
    } else {
        // Payment still pending
        return res.json({
            success: false,
            status: 'pending',
            message: 'Payment is being processed',
        });
    }
});
```

**PayU Verification API:**

```
POST https://info.payu.in/merchant/postservice.php?form=2

Parameters:
- key: Your merchant key
- command: verify_payment
- var1: Transaction ID
- hash: SHA512(key|command|var1|salt)
```

## Deep Link Configuration

### Android Configuration

**File**: `android/app/src/main/AndroidManifest.xml`

Add this inside your main `<activity>` tag:

```xml
<activity
    android:name=".MainActivity"
    android:launchMode="singleTask">

    <!-- Existing intent filters -->

    <!-- Add this for UPI payment returns -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="yourappname"
            android:host="payment" />
    </intent-filter>
</activity>
```

**Deep Link Format**: `yourappname://payment?txnid=123&status=success`

### iOS Configuration

**File**: `ios/YourApp/Info.plist`

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>yourappname</string>
        </array>
        <key>CFBundleURLName</key>
        <string>com.yourcompany.yourapp</string>
    </dict>
</array>

<!-- Add these to allow querying UPI apps -->
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>gpay</string>
    <string>phonepe</string>
    <string>paytmmp</string>
    <string>cred</string>
    <string>bhim</string>
    <string>upi</string>
</array>
```

**Deep Link Format**: `yourappname://payment?txnid=123&status=success`

## Testing the Payment Verification

### Test Scenario 1: Successful Payment

1. Click Recharge → Enter amount → Select GPay
2. In GPay, complete payment with UPI PIN
3. Press back button to return to app
4. **Expected**:
    - Toast shows "Payment Successful"
    - Wallet balance updates automatically
    - No manual refresh needed

### Test Scenario 2: Failed Payment

1. Click Recharge → Enter amount → Select PhonePe
2. In PhonePe, cancel the payment
3. Return to app
4. **Expected**:
    - Toast shows "Payment Failed"
    - Wallet balance unchanged

### Test Scenario 3: User Doesn't Return Immediately

1. Click Recharge → Enter amount → Select GPay
2. Complete payment in GPay
3. Don't return to app immediately (check other apps)
4. After 6-12 seconds, return to app
5. **Expected**:
    - Payment already verified by polling
    - Toast shows "Payment Successful"
    - Balance already updated

### Test Scenario 4: App Closed During Payment

1. Click Recharge → Enter amount → Select GPay
2. Complete payment in GPay
3. Close your app completely
4. Reopen app
5. **Expected**:
    - Deep link handler catches the return
    - Payment verified on app open
    - Balance updated

## Monitoring and Debugging

### Console Logs to Watch

```typescript
// When UPI app is launched
'Launching Google Pay with URL: intent://pay?...';

// When monitoring starts
'Starting payment monitoring for txnid: TXN123456';

// When app comes to foreground
'App state changed to: active';
'App came to foreground, verifying payment immediately';

// During polling
'Polling attempt 1/20 for txnid: TXN123456';
'Verifying UPI payment for txnid: TXN123456';

// When payment is verified
'Payment verification successful';
'Stopping payment monitoring';

// If deep link is received
'Deep link event: yourapp://payment?txnid=123';
'Deep link contains txnid: TXN123456 status: success';
```

### Common Issues and Solutions

#### Issue 1: Payment verified but balance not updating

**Cause**: Backend API not updating wallet balance
**Solution**: Check backend implementation, ensure wallet balance is updated in database

#### Issue 2: Verification keeps polling forever

**Cause**: Backend always returns 'pending' status
**Solution**: Check PayU verification API response, ensure proper status mapping

#### Issue 3: App doesn't detect user return

**Cause**: App state monitoring not working
**Solution**: Check if `useEffect` cleanup is removing listeners, ensure component is mounted

#### Issue 4: Deep links not working

**Cause**: Deep link configuration missing
**Solution**: Add intent filters (Android) and URL schemes (iOS) as shown above

## Performance Considerations

### Polling Frequency

-   **Current**: Every 6 seconds for 2 minutes
-   **Adjustable**: Change in `startPaymentMonitoring(txnid, callback, 20)`
-   **Recommendation**: Don't poll more frequently than 5 seconds to avoid server load

### Cleanup

-   Monitoring stops automatically when payment is confirmed
-   Cleanup happens on component unmount
-   No memory leaks or background processes after user leaves wallet screen

### Battery Impact

-   Minimal: Only polls when payment is pending
-   Stops after 2 minutes maximum
-   App state monitoring is native and efficient

## Summary

### What Happens Automatically:

✅ App detects when user returns from UPI app
✅ Payment status is verified with backend
✅ Wallet balance is updated
✅ Success/failure toast is shown
✅ Monitoring stops after verification
✅ Works even if user doesn't return immediately

### What You Need to Do:

1. ✏️ Implement backend API: `Verify_Payment_Status_Api`
2. ✏️ Add deep link configuration (AndroidManifest.xml, Info.plist)
3. ✏️ Replace PayU VPA: `'payu@payu'` with actual VPA
4. ✏️ Test on physical devices with real UPI apps
5. ✏️ Monitor console logs during testing

### Files Involved:

-   `/src/services/paymentVerificationService.ts` - Monitoring logic
-   `/src/modules/wallet/index.tsx` - Integration and callbacks
-   `/src/services/upiPaymentService.ts` - UPI app launching
-   Backend API endpoint - Payment verification

The system is designed to be robust and handle all edge cases. Even if one detection method fails, the others will catch the payment completion!
