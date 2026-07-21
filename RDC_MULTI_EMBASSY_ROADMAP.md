# RDC Multi-Embassy Expansion Roadmap

## Executive Summary

Yes, the current E-Ambassade project can be upgraded for RDC embassies abroad.

At present, the application is a strong single-embassy foundation. It already includes the core capabilities needed for a broader consular platform:

- user authentication
- booking management
- user dashboard
- admin dashboard
- notifications
- multilingual support

However, it is not yet designed as a multi-embassy platform. To support multiple RDC embassies abroad, the system should be upgraded from a single-site application into a configurable multi-tenant consular platform.

The right target is not to clone the app for each embassy. The right target is to maintain one codebase that supports many embassies through configuration, permissions, and embassy-specific data.

## Current Position

The current project already provides a useful base for expansion because it has:

- authentication and session management
- booking APIs and admin booking workflows
- profile and notification features
- support for French, Swedish, and English
- an existing deployment path with Next.js, Supabase, NextAuth, and Resend

This makes the project suitable for a pilot today and a realistic candidate for a broader RDC embassy platform after targeted upgrades.

## Main Limitation Today

The current application is still organized around one embassy context.

Examples of that limitation include:

- single branding and app identity
- single sender identity for emails
- no embassy separation in the booking model
- no embassy-specific services, calendars, or rules
- no embassy-scoped admin permissions

Because of this, the project cannot yet safely serve several RDC embassies from one shared system.

## Target Vision

The target vision should be:

One central RDC consular platform that can be used by multiple embassies abroad, where each embassy has:

- its own public information
- its own services
- its own appointment calendar
- its own administrators and staff
- its own branding and contact details
- its own reporting and audit trail

From a technical point of view, this is a multi-tenant platform where each embassy is a tenant.

## What Will Be Needed

### 1. Multi-Embassy Data Model

The first essential upgrade is database restructuring.

Add a dedicated `embassies` table with fields such as:

- id
- official_name
- country
- city
- address
- phone
- email
- timezone
- logo_url
- primary_domain or subdomain
- status

Then attach `embassy_id` to every embassy-owned record, especially:

- bookings
- profiles for embassy staff and admins
- notifications
- available services
- working hours and closure days
- email templates or template overrides
- public content pages

This is the core change that makes multi-embassy support possible.

### 2. Embassy-Scoped Access Control

The current admin model should be upgraded into scoped roles.

Recommended roles:

- super_admin: manages the whole platform
- embassy_admin: manages one embassy
- embassy_staff: handles bookings and operations for one embassy
- citizen_user: public applicant

Each back-office query and admin action must be restricted by `embassy_id`.

This prevents Stockholm staff from seeing Paris, Brussels, or London records unless explicitly authorized.

### 3. Embassy Configuration Layer

Each embassy should be configurable without code changes.

Configuration should include:

- embassy name and logo
- contact information
- host country language preference
- opening hours
- appointment slot rules
- holiday calendars
- services available at that embassy
- required documents per service
- e-mail sender identity
- confirmation and notification texts

This turns onboarding a new embassy into a configuration exercise instead of a development project.

### 4. Service Catalog Redesign

The booking layer should move from a mostly static list into a structured service catalog.

Typical consular services may include:

- visa application
- passport renewal
- emergency travel document
- consular card
- birth registration
- marriage registration
- document legalization
- power of attorney
- nationality and civil status requests

Each service should support:

- duration
- capacity rules
- required documents
- eligibility notes
- fees reference
- appointment instructions
- embassy availability

### 5. Calendar and Slot Management

Booking logic should become embassy-specific.

Add support for:

- embassy timezones
- bookable days and hours
- slot capacity per service
- blackout dates and public holidays
- buffer times between appointments
- rescheduling rules
- cancellation rules

This is especially important because embassies in different countries operate under different local calendars and working rhythms.

### 6. Public Information Pages per Embassy

Each embassy should have its own public-facing content.

Recommended sections:

- about the embassy
- consular services
- required documents
- processing guidance
- office hours
- contact details
- announcements
- emergency contacts
- FAQ

This is necessary because procedures and expectations vary by country and local practice.

### 7. Communications Layer

Email and notification flows should become embassy-aware.

Needed upgrades:

- embassy-specific sender names and domains
- embassy-specific email templates
- multilingual message templates
- reminders before appointments
- cancellation and reschedule notices
- optional SMS or WhatsApp notifications if operationally needed

Example:

- Stockholm may send from a Sweden-linked domain
- Brussels may use a different sender identity
- French may remain the base language, while the host-country language is enabled per embassy

### 8. Reporting and Audit

For official and administrative use, the platform should include stronger operational controls.

Required additions:

- audit logs for admin actions
- booking status change history
- who changed what and when
- exports by embassy and by service
- daily and monthly reporting
- staff activity visibility

This is important for accountability and internal administration.

### 9. Security and Compliance Hardening

Before broader rollout, the platform should be hardened.

Key upgrades:

- strict server-side validation on all write routes
- role enforcement on every admin endpoint
- rate limiting for authentication and booking endpoints
- sensitive data review, especially passport information
- reduced logging of personal data
- backup and recovery procedures
- monitoring and alerting
- tenant-isolation testing

If the system will handle personally identifiable information across multiple embassies, this is not optional.

### 10. Deployment Model

There are two realistic deployment options.

Option A: One shared platform

- one codebase
- one database with tenant separation
- one operations model
- lower maintenance cost
- stronger standardization

Option B: One deployment per embassy

- stronger isolation by default
- more infrastructure duplication
- higher maintenance overhead
- slower rollout to many embassies

For the stated vision, Option A is usually the better long-term strategy if tenant isolation is designed correctly.

## Recommended Upgrade Path

### Phase 1: Foundation Refactor

Goal: turn the current single-embassy app into a multi-embassy-ready core.

Deliverables:

- create `embassies` table
- add `embassy_id` to core records
- update queries to filter by embassy
- introduce scoped admin roles
- centralize embassy configuration
- remove hardcoded embassy identity from UI and emails

### Phase 2: Embassy Operations Layer

Goal: support different embassy workflows without separate codebases.

Deliverables:

- service catalog by embassy
- slot and calendar rules by embassy
- embassy-specific pages and content
- embassy-specific communications
- improved admin workflows

### Phase 3: Production Hardening

Goal: make the platform suitable for official multi-embassy use.

Deliverables:

- audit logging
- stronger validation
- rate limiting
- monitoring and alerts
- backup and restore plan
- security review
- privacy review

### Phase 4: Controlled Rollout

Goal: onboard embassies gradually.

Recommended order:

1. Stockholm as reference deployment
2. One second embassy with different operational needs, such as Brussels or Paris
3. Validate the configuration model
4. Expand to more embassies through standardized onboarding

## Practical Platform Architecture

The future platform should be organized around these main domains:

- identity and access
- embassy management
- service catalog
- booking and scheduling
- notifications and email
- public content management
- reporting and audit

That means the app evolves from a booking application into a configurable consular operations platform.

## What Should Change in the Existing Project

At a high level, the following areas should be refactored first:

### Branding and Layout

Replace hardcoded single-brand behavior with embassy-driven configuration for:

- app title
- descriptions
- logo
- navigation labels where needed
- contact details
- email identity

### Database Access

Refactor data access so all embassy-owned entities are filtered and written using `embassy_id`.

### Authentication and Authorization

Extend the current role model to support per-embassy staff and admin permissions.

### Booking Model

Make bookings embassy-aware and service-aware, with service rules managed from the platform.

### Email and Notification Logic

Move message texts, sender names, and templates into configurable embassy-aware resources.

## Business Value of This Upgrade

Upgrading the project this way creates several benefits:

- one reusable national platform instead of isolated embassy tools
- faster onboarding of new embassies
- lower long-term maintenance cost
- more consistent user experience for RDC citizens abroad
- better reporting and operational visibility
- stronger institutional value than a single-city app

## Recommendation

Yes, the project can absolutely be extended for RDC embassies abroad.

But the correct strategy is to evolve it into a multi-tenant embassy platform, not to duplicate the current Stockholm version embassy by embassy.

The most important first step is to redesign the platform around embassy separation:

- embassy-aware data
- embassy-scoped permissions
- embassy-specific configuration
- embassy-specific services and calendars

Once those are in place, the rest of the rollout becomes manageable and scalable.

## Suggested Immediate Next Step

The most practical next step is to prepare a technical design package covering:

- target database schema
- role and permission matrix
- configuration model
- migration strategy from single embassy to multi-embassy
- phased implementation estimate

That package can then be used for planning, budgeting, or presentation to embassy stakeholders.