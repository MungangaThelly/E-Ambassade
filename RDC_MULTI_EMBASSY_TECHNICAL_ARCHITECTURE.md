# RDC Multi-Embassy Technical Architecture

## Purpose

This document defines how the current E-Ambassade application can evolve from a single-embassy booking system into a multi-embassy RDC consular platform.

The main objective is to support multiple RDC embassies abroad from one shared codebase while preserving strong tenant separation, clear permissions, and configurable local operations.

## Architecture Goal

The platform should support:

- one shared application codebase
- one shared platform administration model
- multiple embassies as isolated tenants
- embassy-specific branding, services, schedules, and communications
- secure separation of data and operations by embassy

## Recommended Operating Model

Recommended model: shared multi-tenant platform.

Each embassy is treated as a tenant. All embassy-owned data is linked to `embassy_id`. Application logic, admin queries, notifications, reporting, and public content must respect that tenant boundary.

This model is preferable to cloning the app per embassy because it:

- reduces maintenance cost
- simplifies updates and security fixes
- standardizes operations
- speeds up onboarding of new embassies

## Core Architectural Principles

### 1. Tenant Isolation

Every record that belongs to an embassy must include `embassy_id`.

That includes at minimum:

- users in embassy roles
- user profiles where business context depends on embassy
- bookings
- notifications
- services
- appointment slots or calendar rules
- public content
- audit logs

### 2. Configuration Over Forking

Embassy differences should be handled by configuration, not separate code branches.

Examples:

- branding
- office hours
- supported services
- email sender names
- confirmation texts
- language settings

### 3. Centralized Authorization

Permissions should not be spread informally across pages and API handlers. Authorization rules should be explicit and reusable.

### 4. Server-Enforced Security

Client-side controls are not sufficient. Tenant isolation and role checks must be enforced at the API and database layers.

## High-Level System Domains

The target platform should be organized around these domains:

- identity and access management
- embassy management
- service catalog
- scheduling and booking
- notifications and communications
- content and public information
- reporting and audit

## Tenant Model

### Tenant Entity

The main tenant entity is `embassies`.

Suggested fields:

| Field | Type | Purpose |
| --- | --- | --- |
| id | uuid | Primary key |
| code | text unique | Stable short identifier such as `stockholm` |
| official_name | text | Official embassy name |
| country | text | Host country |
| city | text | Host city |
| address | text | Public office address |
| phone | text | Public contact number |
| email | text | Public contact email |
| timezone | text | Embassy timezone |
| primary_locale | text | Default language |
| supported_locales | jsonb | Enabled languages |
| logo_url | text | Branding asset |
| domain | text | Optional dedicated domain |
| subdomain | text | Optional subdomain |
| status | text | `active`, `inactive`, `setup` |
| created_at | timestamptz | Audit timestamp |
| updated_at | timestamptz | Audit timestamp |

### Tenant Resolution

The system should determine active embassy context using one of these strategies:

1. subdomain-based resolution
2. domain-based resolution
3. path-based resolution such as `/embassy/stockholm`
4. admin-selected context for super admins

Recommended order:

- public site: subdomain or domain based
- back office: explicit embassy context for scoped admins

## Identity and Access Control

### Recommended Roles

| Role | Scope | Description |
| --- | --- | --- |
| super_admin | platform | Full platform access across all embassies |
| embassy_admin | embassy | Full operational access for one embassy |
| embassy_staff | embassy | Handles bookings and service operations |
| citizen_user | self | Public applicant |
|

### Role Storage

Do not rely only on user metadata in the auth provider.

Create an explicit access table such as `user_embassy_roles`:

| Field | Type | Purpose |
| --- | --- | --- |
| id | uuid | Primary key |
| user_id | uuid | Auth user id |
| embassy_id | uuid nullable | Null only for global role |
| role | text | Role name |
| status | text | `active`, `revoked` |
| created_at | timestamptz | Audit timestamp |
| updated_at | timestamptz | Audit timestamp |

This makes it possible for one user to:

- be a super admin globally
- administer one embassy only
- work in multiple embassies if needed

### Authorization Rules

Core rules:

- `super_admin` can access all tenants
- `embassy_admin` can access only records with matching `embassy_id`
- `embassy_staff` can operate only within assigned embassy and limited actions
- `citizen_user` can access only their own records

### Authorization Implementation

Introduce reusable server-side helpers such as:

- `getCurrentActor()`
- `requireAuthenticatedUser()`
- `requirePlatformRole()`
- `requireEmbassyRole(embassyId, role)`
- `assertTenantAccess(record.embassy_id)`

## Database Schema Outline

### 1. embassies

Defines each embassy tenant.

### 2. profiles

Suggested use:

- store end-user personal profile data
- keep auth-linked identity details
- avoid storing embassy permissions directly here

Suggested fields:

| Field | Type |
| --- | --- |
| user_id | uuid primary key |
| full_name | text |
| phone | text |
| preferred_locale | text |
| created_at | timestamptz |
| updated_at | timestamptz |

### 3. user_embassy_roles

Stores embassy-level or platform-level role assignments.

### 4. embassy_services

Each embassy should manage its own service catalog.

Suggested fields:

| Field | Type | Purpose |
| --- | --- | --- |
| id | uuid | Primary key |
| embassy_id | uuid | Tenant key |
| code | text | Stable service code |
| name | text | Service name |
| description | text | Public description |
| duration_minutes | integer | Appointment duration |
| capacity_per_slot | integer | Max bookings per slot |
| requires_documents | boolean | Quick rule flag |
| required_documents | jsonb | Structured requirements |
| fee_reference | text | Public fee note |
| active | boolean | Public availability |
| created_at | timestamptz | Audit timestamp |
| updated_at | timestamptz | Audit timestamp |

### 5. embassy_schedules

Stores weekly availability rules.

Suggested fields:

| Field | Type |
| --- | --- |
| id | uuid |
| embassy_id | uuid |
| weekday | integer |
| start_time | time |
| end_time | time |
| slot_interval_minutes | integer |
| active | boolean |

### 6. embassy_closures

Stores holidays, local closures, or exceptional unavailable periods.

Suggested fields:

| Field | Type |
| --- | --- |
| id | uuid |
| embassy_id | uuid |
| start_date | date |
| end_date | date |
| reason | text |
| created_at | timestamptz |

### 7. bookings

The current bookings table should be expanded.

Recommended fields:

| Field | Type | Purpose |
| --- | --- | --- |
| id | uuid | Primary key |
| embassy_id | uuid | Tenant key |
| user_id | uuid | Applicant |
| service_id | uuid | Linked service |
| reference_number | text | User-visible tracking id |
| appointment_date | date | Booking date |
| appointment_time | time | Booking time |
| timezone | text | Embassy timezone snapshot |
| full_name | text | Applicant name snapshot |
| email | text | Applicant email snapshot |
| phone | text | Applicant phone snapshot |
| passport_number | text or encrypted | Sensitive identifier |
| message | text | Applicant note |
| status | text | `pending`, `confirmed`, `completed`, `cancelled`, `rejected`, `rescheduled` |
| status_reason | text | Admin explanation |
| created_by | uuid | Actor who created record |
| updated_by | uuid | Last modifying actor |
| created_at | timestamptz | Audit timestamp |
| updated_at | timestamptz | Audit timestamp |

### 8. booking_status_history

Do not rely only on current status in the bookings table.

Track every change.

Suggested fields:

| Field | Type |
| --- | --- |
| id | uuid |
| booking_id | uuid |
| embassy_id | uuid |
| old_status | text |
| new_status | text |
| reason | text |
| changed_by | uuid |
| changed_at | timestamptz |

### 9. notifications

Notifications should be embassy-aware.

Suggested fields:

| Field | Type |
| --- | --- |
| id | uuid |
| embassy_id | uuid |
| user_id | uuid |
| type | text |
| title | text |
| message | text |
| read | boolean |
| created_at | timestamptz |

### 10. embassy_content_pages

For public content and information pages.

Suggested fields:

| Field | Type |
| --- | --- |
| id | uuid |
| embassy_id | uuid |
| slug | text |
| locale | text |
| title | text |
| body | text or jsonb |
| published | boolean |
| updated_by | uuid |
| updated_at | timestamptz |

### 11. embassy_settings

Central embassy configuration storage.

Suggested fields:

| Field | Type |
| --- | --- |
| embassy_id | uuid primary key |
| booking_rules | jsonb |
| branding | jsonb |
| email_settings | jsonb |
| notification_settings | jsonb |
| locale_settings | jsonb |
| updated_at | timestamptz |

### 12. audit_logs

Platform-wide audit logging.

Suggested fields:

| Field | Type |
| --- | --- |
| id | uuid |
| embassy_id | uuid nullable |
| actor_user_id | uuid |
| action | text |
| entity_type | text |
| entity_id | uuid |
| metadata | jsonb |
| created_at | timestamptz |

## Data Isolation Strategy

### Application Layer

All service functions and API routes must receive or derive current `embassy_id` and include it in read and write filters.

Examples:

- list bookings by `embassy_id`
- create notifications with `embassy_id`
- restrict admin dashboard stats to active embassy

### Database Layer

Recommended measures:

- add indexes that include `embassy_id`
- implement Row Level Security where feasible
- restrict service-role usage to narrowly controlled server code

If using Supabase, RLS should become part of the long-term design instead of relying mainly on server trust.

## Booking Flow Architecture

### Public Flow

1. visitor lands on embassy-specific public site
2. embassy context is resolved
3. available services are loaded for that embassy
4. user authenticates or registers
5. user selects service and slot
6. booking is created with `embassy_id`
7. confirmation notification and email are sent using embassy settings

### Admin Flow

1. staff signs in
2. staff context is validated against assigned embassy
3. staff views only embassy-scoped bookings
4. status changes create audit and history records
5. user receives embassy-aware communication

## Embassy Configuration Model

Configuration should be retrieved from a central resolver such as:

- `getEmbassyByHost(host)`
- `getEmbassySettings(embassyId)`
- `getEmbassyBranding(embassyId)`
- `getEmbassyLocales(embassyId)`

Recommended configuration sections:

- branding
- locale rules
- scheduling rules
- booking rules
- email sender identity
- default notification templates
- public content flags

## Internationalization Model

The current multilingual support is a useful base, but it should be extended.

Recommended approach:

- maintain base platform translations for shared UI
- allow embassy-specific translation overrides for services and content
- support embassy-selected default locale
- support host-country language activation per embassy

Example:

- Stockholm: French, Swedish, English
- Paris: French, English
- Berlin: French, German, English

## Communications Architecture

### Email

The email layer should be refactored to support:

- sender identity per embassy
- template variables from embassy configuration
- status messages by locale
- reminder scheduling

Suggested email settings structure:

```json
{
  "fromName": "Embassy of the DRC in Stockholm",
  "fromEmail": "noreply@stockholm.example.org",
  "replyTo": "consular@stockholm.example.org",
  "enabled": true
}
```

### Notifications

Notifications should support:

- in-app delivery
- email delivery
- optional SMS in future
- templated content by event type

## API Design Direction

Recommended API characteristics:

- explicit tenant-aware route handling
- shared authorization middleware or helpers
- input validation with schemas
- consistent error responses
- actor and tenant context attached to requests

Possible patterns:

- `/api/public/services`
- `/api/public/bookings`
- `/api/admin/bookings`
- `/api/platform/embassies`

The exact route naming can vary, but the tenant context must always be explicit in server behavior.

## Security Controls

Minimum required controls for multi-embassy rollout:

- schema validation for every write endpoint
- role checks for every admin endpoint
- tenant checks for every read and write
- rate limiting on sign-in and booking creation
- least-privilege database access
- reduced personal data in logs
- secure treatment of passport numbers
- audit logging of administrative actions

Recommended additional controls:

- error monitoring
- suspicious activity alerts
- admin session review
- periodic access reviews

## Performance Considerations

As the number of embassies and bookings grows, the platform should add:

- indexes on `embassy_id`, `user_id`, `status`, `appointment_date`
- paginated admin lists
- summarized reporting queries
- caching for public embassy content and services
- background processing for non-critical emails

## Migration Strategy

### Phase 1: Prepare Schema

1. create `embassies`
2. create `user_embassy_roles`
3. create `embassy_settings`
4. create `booking_status_history`
5. add `embassy_id` to current tenant-owned tables

### Phase 2: Seed First Embassy

1. create Stockholm embassy record
2. attach current data to Stockholm `embassy_id`
3. assign existing admins to Stockholm role scope

### Phase 3: Refactor Server Code

1. update booking queries
2. update admin dashboard queries
3. update notifications and emails
4. resolve embassy context from host or route
5. replace hardcoded branding and sender text

### Phase 4: Add Second Embassy

1. seed second embassy
2. configure services and schedule
3. validate isolation and workflow behavior
4. confirm onboarding model works without code changes

## Suggested Refactor Priorities in This Codebase

Priority order:

1. central embassy resolver and settings model
2. role and authorization refactor
3. bookings schema and service catalog refactor
4. admin query scoping by embassy
5. notification and email configuration refactor
6. public content architecture by embassy

## Recommended Deliverables

For implementation, the engineering package should include:

- SQL migration plan
- revised ERD
- permission matrix
- tenant-resolution strategy
- API validation strategy
- email and notification template strategy
- rollout checklist for onboarding each embassy

## Final Recommendation

The current project is suitable as the foundation for a multi-embassy RDC platform, but the transition should be treated as a deliberate architecture upgrade, not a simple extension.

The most important technical decision is to make embassy context a first-class concept across:

- data model
- permissions
- configuration
- booking logic
- communications
- reporting

Once that is done, onboarding additional embassies becomes a controlled operational process rather than a repeated development effort.