# Security Specification: Praveen Kumar Financial Advisory & Housing Loans

This document acts as our Attribute-Based Access Control (ABAC) validation log, outlining core data invariants and defining the "Dirty Dozen" malicious payloads designed to test Firestore access policies.

## 1. Core Data Invariants

1. **Immutable Admin Operations**: Services and News articles can only be inserted, modified, or deleted by the authorized administrator, identified by Google Authentication (`email == "abhinavkrishna3071@gmail.com"`).
2. **Anonymous Feedback Limitations**: Non-authenticated consumers can create testimonials (`reviews`) but they are strictly locked with `approved: false`. Unapproved feedback will never show on the landing page unless approved by the admin.
3. **Data Spill Safeguards**: Enquiries submitted by prospective borrowers contain PII (Emails, Phone Numbers, Details). General consumers / anonymous agents cannot read, list, delete, or harvest this information.
4. **Denial-of-Wallet Guards**: All inputs are constrained strictly by type, structure, and character count (`size() <= N`) to prevent large string payloads from overflowing cloud read/write budgets.

---

## 2. The "Dirty Dozen" Security Violations

The following 12 payloads must be blocked, resulting in `PERMISSION_DENIED`:

### Service Violations (Admin Only)
*   **Payload 1: Anonymous Service Insertion**
    *   *Intention*: Inject a new service card without any authentication.
    *   *Result*: Denied because `isAdmin()` requires Google Auth login.
*   **Payload 2: Service Modification by Normal User**
    *   *Intention*: Normal logged-in user with a different email trying to edit a service.
    *   *Result*: Denied because `request.auth.token.email` does not match the bootstrapped admin.
*   **Payload 3: Service Size/Resource Poisoning**
    *   *Intention*: Admin enters an invalid title string consisting of 1MB of bytes.
    *   *Result*: Denied due to `data.titleEn.size() <= 200` enforcement.

### News Violations (Admin Only)
*   **Payload 4: Anonymous Article Creation**
    *   *Intention*: Insert fake policy guidance without signing in.
    *   *Result*: Denied since write is locked under `isAdmin()`.
*   **Payload 5: Article Modification with Extra Undeclared Fields (Shadow Write)**
    *   *Intention*: Attacker tries to write an extra field like `injection_success: true` inside a news item document.
    *   *Result*: Denied because of rigorous map key count matching: `data.keys().size() <= 12`.

### Review Violations (Public Submission, Admin Moderation)
*   **Payload 6: Self-Approving Dynamic Review**
    *   *Intention*: Customer submits feedback with `approved: true` to bypass moderation and show it on the landing page instantly.
    *   *Result*: Denied because `create` allows *only* `request.resource.data.approved == false`.
*   **Payload 7: Unauthenticated Review Update/Approve**
    *   *Intention*: Consumer attempts to send an update packet to switch `approved` to `true` on an existing review.
    *   *Result*: Denied because update is restricted to `isAdmin()`.
*   **Payload 8: Review Body Overrun (Wallet Attack)**
    *   *Intention*: Consumer feeds a 500KB string of text as a testimonial to waste Firestore collection storage.
    *   *Result*: Denied because of `data.feedbackEn.size() <= 2000`.

### Enquiry Violations (PII Isolation)
*   **Payload 9: Public Harvesting of Client Leads**
    *   *Intention*: Malicious crawler attempts to read or search the general `enquiries` collection URL.
    *   *Result*: Denied because read, get, and list operations on `enquiries/*` are restricted strictly to `isAdmin()`.
*   **Payload 10: Client Enquiry Deletion/Dismissal by Non-Admin**
    *   *Intention*: Third-party competitor deletes incoming mortgage consultation lead files.
    *   *Result*: Denied because delete is restricted to `isAdmin()`.
*   **Payload 11: Invalid ID character injection (ID Poisoning)**
    *   *Intention*: Crafting custom enquiries with malicious URL parameters inside `enquiryId`.
    *   *Result*: Denied because of `isValidId(enquiryId)` checking alphanumeric and hyphen bounds.
*   **Payload 12: Structuring Enquiry with shadow admin parameters**
    *   *Intention*: Putting additional administrative parameters inside enquiry payloads.
    *   *Result*: Denied because the key schema restricts keys: `data.keys().size() <= 7`.
