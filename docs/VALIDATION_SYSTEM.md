# Register Number Validation System

## Overview

The Campus ID Flow application now includes a comprehensive validation system that ensures only eligible students can submit ID card requests. Students can ONLY submit a new request if their register number is present in either the `acceptedidcards` or `rejectedidcards` collections.

## Eligibility Logic

### ✅ **ELIGIBLE Students (Can Apply)**
- Register number exists in `acceptedidcards` collection
- Register number exists in `rejectedidcards` collection

### ❌ **NOT ELIGIBLE Students (Cannot Apply)**
- Register number NOT found in any collection
- Register number has a pending request in `studentidreq` collection

## Collections Checked

1. **`acceptedidcards`** - Students who can apply (previously accepted)
2. **`rejectedidcards`** - Students who can apply (previously rejected)
3. **`studentidreq`** - Check for pending requests (blocks application)

## Validation Logic

### Backend Validation
- **POST `/api/idcards`** - Checks eligibility before allowing submission
- **GET `/api/check-eligibility/:registerNumber`** - Real-time eligibility check

### Frontend Validation
- Real-time checking as user types register number
- Debounced API calls (500ms delay)
- Visual indicators during checking
- Toast notifications for eligibility status

## API Endpoints

### Check Eligibility
```
GET /api/check-eligibility/:registerNumber
```

**Response for ELIGIBLE student:**
```json
{
  "success": true,
  "eligible": true,
  "message": "You are eligible to apply for a new ID card.",
  "collection": "acceptedidcards",
  "status": "Accepted"
}
```

**Response for NOT ELIGIBLE student:**
```json
{
  "success": false,
  "eligible": false,
  "message": "You are not eligible to apply for an ID card. Please contact your administrator.",
  "collection": null,
  "status": "Not Found"
}
```

### Submit Request
```
POST /api/idcards
```

**Response for NOT ELIGIBLE student:**
```json
{
  "success": false,
  "message": "You are not eligible to apply for an ID card. Please contact your administrator.",
  "existingRequest": true,
  "collection": null,
  "status": "Not Found"
}
```

## User Experience

### Real-time Validation
- As user types register number, system checks eligibility
- Visual spinner shows "Checking..." status
- Immediate feedback via toast notifications

### Error Messages
- **Eligible Student**: "You are eligible to apply for a new ID card."
- **Not Found**: "You are not eligible to apply for an ID card. Please contact your administrator."
- **Pending Request**: "You already have a pending request. Please wait for the current request to be processed."

## Workflow

1. **Student enters register number**
2. **System checks `acceptedidcards` and `rejectedidcards` collections**
3. **If found in either collection** → Student CAN apply ✅
4. **If NOT found in both collections** → Student CANNOT apply ❌
5. **If has pending request** → Student CANNOT apply ❌

## Testing

Run the validation test:
```bash
node test-validation.js
```

This will test:
1. Eligible student submission (should succeed)
2. Non-eligible student submission (should fail)
3. Eligibility checking API

## Database Schema

All three collections use the same schema:
```javascript
{
  registerNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: String,
  department: String,
  year: String,
  section: String,
  libraryCode: String,
  photo: {
    data: Buffer,
    contentType: String,
    originalName: String
  },
  reason: String,
  status: { type: String, default: 'Pending' },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}
```

## Implementation Details

### Backend Helper Function
```javascript
async function checkRegisterNumberEligibility(registerNumber) {
  // Check in acceptedidcards collection
  // Check in rejectedidcards collection
  // Check for pending requests
  // Return eligibility status and info
}
```

### Frontend Debounced Check
```javascript
const debouncedCheckEligibility = React.useCallback(
  React.useMemo(() => {
    let timeoutId;
    return (registerNumber) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => checkEligibility(registerNumber), 500);
    };
  }, []),
  []
);
```

## Security Considerations

- All validation happens on the backend
- Frontend validation is for UX only
- Database constraints prevent unauthorized submissions
- Proper error handling for all edge cases