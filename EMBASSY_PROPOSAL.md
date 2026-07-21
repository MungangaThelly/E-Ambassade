# Embassy App Proposal

## Executive Summary

This app is suitable for a pilot today, but for real embassy use it should be hardened before production launch. The main upgrades are security, reliability, auditability, and performance. The current multilingual structure is a strong base for a public-facing embassy service, especially for French-speaking users in Sweden and the wider Scandinavian region.

## Suggested Pricing

Pricing should depend on scope and responsibility. A practical range would be:

- Pilot / demo handover: $2,000–$5,000
- Production hardening for one embassy: $8,000–$20,000
- Full embassy-grade delivery with support, training, and deployment: $20,000–$45,000+

If billing hourly, a realistic rate is often $60–$120/hour depending on market, urgency, and support obligations.

## Recommended Scope

### Phase 1: Production Hardening

- Review and tighten authentication and authorization
- Add rate limiting to sensitive routes
- Validate all booking, profile, and admin inputs server-side
- Add audit logs for admin actions
- Review and minimize stored personal data
- Confirm database indexes for read-heavy routes
- Add monitoring, error tracking, and backups

### Phase 2: Performance and Reliability

- Reduce unnecessary client-side rendering
- Cache safe read operations where appropriate
- Keep heavy e-mail or notification work off the request path
- Add graceful failure handling for Supabase and Resend
- Test on slow mobile networks and lower-end devices

### Phase 3: Delivery and Support

- Deployment checklist
- Admin/user training
- Short handover document
- Post-launch support window

## CIA Priorities

### Confidentiality

- Enforce least-privilege access
- Recheck middleware and admin route protection
- Protect personal data such as passport numbers
- Avoid exposing sensitive details in logs or e-mails

### Integrity

- Validate all writes on the server
- Add audit trails for status changes and admin edits
- Use consistent role checks across APIs
- Prevent tampering with booking or profile payloads

### Availability

- Add monitoring and uptime checks
- Configure backups and recovery steps
- Handle external service failures gracefully
- Confirm the app still works when e-mail delivery is slow or unavailable

## Recommendation

Do not launch exactly as-is for embassy production. The current app is a strong base, but I recommend a focused hardening phase before real use. For a pilot or internal proof of concept, the current state is acceptable. For public-facing embassy operations, production hardening is the safer choice.

## Practical Next Step

If you want to present this to the embassy, use the following framing:

- Current app: ready for pilot use
- Required before production: security, audit, reliability, and performance hardening
- Commercial value: quote the project as a delivery package, not just a code build
