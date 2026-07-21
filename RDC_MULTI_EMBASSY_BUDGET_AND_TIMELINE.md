# RDC Multi-Embassy Budget And Timeline

## Purpose

This document provides a practical phased budget and implementation timeline for evolving the current E-Ambassade project into a multi-embassy RDC consular platform.

The numbers below are planning estimates, not fixed contractual prices. Final cost depends on exact scope, security expectations, deployment model, and support obligations.

## Planning Assumptions

These estimates assume:

- one shared codebase
- one Supabase-backed platform
- phased rollout
- reuse of the existing booking and admin foundation
- moderate UI redesign rather than a full visual rebuild
- support for multiple embassies through configuration

These estimates do not assume:

- native mobile applications
- payment gateway integration
- OCR or document verification automation
- call center integration
- large-scale legacy data migration

## Recommended Delivery Model

The recommended delivery model is phased.

This reduces risk, improves budget control, and allows real-world validation before broad rollout.

## Budget Ranges

### Option A: Pilot Upgrade

Scope:

- strengthen the current Stockholm deployment
- prepare the platform for multi-embassy architecture
- add first-level tenant model foundations
- improve security and admin controls

Estimated range:

- USD 6,000 to 12,000

Best for:

- validating the direction
- presenting a concrete pilot to stakeholders
- preparing the first architecture step without full expansion

### Option B: Multi-Embassy Core Platform

Scope:

- implement shared multi-tenant architecture
- add embassy-specific configuration
- add scoped roles and access control
- redesign service catalog and scheduling model
- support onboarding of at least two embassies

Estimated range:

- USD 15,000 to 30,000

Best for:

- creating the actual reusable platform
- supporting Stockholm plus one or two additional embassies
- establishing a repeatable onboarding model

### Option C: Full Institutional Delivery

Scope:

- everything in Option B
- audit logging and reporting package
- production hardening and monitoring
- onboarding procedures and training materials
- deployment support for broader embassy adoption
- post-launch support window

Estimated range:

- USD 30,000 to 55,000+

Best for:

- official long-term adoption
- multi-embassy operational rollout
- stronger institutional support and governance

## Suggested Phase Breakdown

### Phase 1: Architecture And Foundation

Objective:

Convert the application from single-embassy assumptions to multi-embassy readiness.

Main work:

- create embassy tenant model
- redesign permissions and roles
- add embassy-aware database structure
- refactor core queries and admin access
- centralize configuration and branding rules

Estimated duration:

- 2 to 4 weeks

Estimated budget:

- USD 5,000 to 10,000

### Phase 2: Service And Scheduling Layer

Objective:

Make the platform operationally useful for different embassies.

Main work:

- service catalog by embassy
- working hours and closure management
- appointment slot rules
- embassy-specific booking instructions
- embassy-specific public content

Estimated duration:

- 2 to 4 weeks

Estimated budget:

- USD 4,000 to 9,000

### Phase 3: Communications And Admin Operations

Objective:

Improve day-to-day usability for embassy teams and applicants.

Main work:

- embassy-specific e-mail templates
- reminder and status notifications
- richer admin workflows
- better reporting views
- improved dashboards

Estimated duration:

- 2 to 3 weeks

Estimated budget:

- USD 3,000 to 7,000

### Phase 4: Security And Production Hardening

Objective:

Make the platform suitable for official use across multiple embassies.

Main work:

- server-side validation hardening
- audit logs
- rate limiting
- monitoring and alerting
- backup and recovery preparation
- privacy and operational review

Estimated duration:

- 2 to 4 weeks

Estimated budget:

- USD 4,000 to 10,000

### Phase 5: Rollout And Support

Objective:

Deploy and operationalize the platform beyond the first embassy.

Main work:

- second embassy onboarding
- configuration validation
- training and handover
- support during initial usage

Estimated duration:

- 1 to 3 weeks

Estimated budget:

- USD 2,000 to 6,000

## Timeline Scenarios

### Scenario 1: Lean Pilot Track

Best for:

- decision support
- stakeholder demonstration
- early institutional interest

Timeline:

- 4 to 6 weeks

Likely scope:

- Phase 1
- selected items from Phase 2
- selected items from Phase 4

Estimated budget:

- USD 6,000 to 12,000

### Scenario 2: Practical Multi-Embassy Launch Track

Best for:

- building the real reusable platform
- onboarding Stockholm and one additional embassy

Timeline:

- 8 to 12 weeks

Likely scope:

- Phase 1
- Phase 2
- Phase 3
- essential parts of Phase 4

Estimated budget:

- USD 15,000 to 30,000

### Scenario 3: Institutional Rollout Track

Best for:

- long-term official use
- stronger compliance and operations maturity
- broader embassy deployment

Timeline:

- 12 to 20 weeks

Likely scope:

- all phases
- governance support
- training and rollout package

Estimated budget:

- USD 30,000 to 55,000+

## Cost Drivers

The final budget will mainly depend on:

- number of embassies included in the initial rollout
- level of security and audit requirements
- complexity of service categories
- need for document upload or file management
- level of reporting and analytics
- quality of deployment and support expectations
- training and stakeholder documentation needs

## Suggested Commercial Positioning

For discussions with stakeholders, the project can be positioned in three levels.

### Level 1: Pilot

Message:

Demonstrate value quickly and validate the model.

Suitable range:

- USD 6,000 to 12,000

### Level 2: Core Platform

Message:

Build the reusable multi-embassy foundation.

Suitable range:

- USD 15,000 to 30,000

### Level 3: Full Delivery

Message:

Deliver an institutional platform with rollout support and stronger operational controls.

Suitable range:

- USD 30,000 to 55,000+

## Recommended Sequence

The most practical sequence is:

1. approve the architecture and migration scope
2. execute the multi-embassy foundation refactor
3. onboard Stockholm as the reference embassy model
4. add one second embassy with distinct needs
5. validate the onboarding model before larger expansion

## Risks To Budget And Schedule

The most common causes of delay or cost increase would be:

- changing service scope during implementation
- unclear governance over platform ownership
- late security requirements
- major redesign requests after core development begins
- onboarding many embassies too early before the model is validated

These risks can be reduced by keeping the first rollout disciplined and phased.

## Final Recommendation

The strongest value-for-money path is usually Option B: build the multi-embassy core platform and validate it with Stockholm plus one additional embassy.

This gives enough substance to create a reusable institutional product without overcommitting to a full-scale rollout too early.

If the priority is only proof of concept, Option A is enough. If the priority is official long-term adoption across multiple RDC embassies abroad, Option C is the right strategic target.