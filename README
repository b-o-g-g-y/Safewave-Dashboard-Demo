# SafeWave Dashboard — Product Requirements Document

**Version:** 1.0
**Date:** October 2026
**Owner:** Bogdan Shoyat
**Status:** Draft for team review

---

## 1. Overview

The SafeWave Dashboard is the web-based admin interface for the SafeWave haptic
safety alert platform. It serves two distinct user classes:

- **Super Admin** — SafeWave internal staff (founders, support, dev team).
  Cross-organization platform operators.
- **Org Admin** — Business customer administrators (safety leads, operations
  managers, supervisors). Single-facility operators.

The dashboard is the primary delivery surface for every non-firmware feature on
the SafeWave roadmap. Firmware is updated separately on the physical band. The
mobile apps consume the same Firestore/FCM backend the dashboard writes to.

---

## 2. Goals & Non-Goals

### 2.1 Goals

- Give Org Admins a real-time situation room to dispatch alerts, track
  acknowledgments, and prove compliance.
- Give Super Admins platform-wide visibility to operate the business:
  customer health, revenue, system health, support, firmware fleet.
- Close the Amazon enterprise deal by shipping the four deal-critical capabilities:
  push notifications with band vibration, acknowledgment tracking, group targeting,
  and sound recognition cascade.
- Establish audit-ready foundations for HIPAA, SOC 2, ADA, GDPR, and CCPA.

### 2.2 Non-Goals

- End-user (worker) interface. Workers interact via the mobile app and the band.
- Firmware authoring or debugging tools. Those remain in Bogdan's toolchain.
- Generic analytics dashboards unrelated to safety operations.
- Billing self-service for Org Admins in v1 (SafeWave handles invoicing).

---

## 3. User Roles & Permissions

### 3.1 Role matrix

| Capability                        | Super Admin | Org Admin | Supervisor | Worker |
|-----------------------------------|-------------|-----------|------------|--------|
| Dispatch critical alerts          | ✓           | ✓         | ✓          | —      |
| Dispatch standard alerts          | ✓           | ✓         | ✓          | —      |
| Manage users & groups             | ✓           | ✓         | —          | —      |
| Manage devices (band assignment)  | ✓           | ✓         | —          | —      |
| Export compliance reports         | ✓           | ✓         | —          | —      |
| Configure notification templates  | ✓           | ✓         | —          | —      |
| Acknowledge alerts                | ✓           | ✓         | ✓          | ✓      |
| Billing & integrations            | ✓           | —         | —          | —      |
| Multi-org access & impersonation  | ✓           | —         | —          | —      |
| Push firmware OTA across fleet    | ✓           | —         | —          | —      |
| View platform health & revenue    | ✓           | —         | —          | —      |

### 3.2 Super Admin impersonation

- Super Admins can drop into any Org's tenant view to debug or assist.
- Tenant context must display a persistent banner indicating the impersonation
  state and that actions are logged.
- All actions taken under impersonation write to the target org's audit_logs
  collection with actor = super_admin_uid and metadata.impersonation = true.

---

## 4. Super Admin Views

### 4.1 Platform Overview

**Purpose:** At-a-glance state of the SafeWave business.

**Must show:**
- Count of total orgs, platform MRR, bands shipped, active workers, open
  incidents across all orgs, open support tickets.
- Tenant list with name, workers, bands, MRR, last incident, health status.
- "Needs attention" feed of cross-org alerts (active incidents, degraded
  services, failing firmware rollouts).
- 7-day platform activity summary (dispatches, acks, sound events, signups).

**Must support:**
- Clicking any tenant name drops into that tenant's context.
- Filtering the metrics strip by time range (24h, 7d, 30d).
- Exporting a platform report.

### 4.2 Organizations

**Purpose:** Directory and management of every customer org.

**Must show:**
- Searchable table: name, plan, workers, bands, MRR, health, contract term,
  signup date.
- Per-row actions: Enter tenant view, Edit, Suspend, Export data.

**Must support:**
- Creating a new org (onboarding wizard: name, plan, primary contact,
  domain, initial facility).
- Filtering by plan, health status, contract type.
- Bulk actions (export all, send notice).

### 4.3 Fleet Operations

**Purpose:** Manage firmware rollouts and device inventory at the platform level.

**Must show:**
- Total fleet count, adoption rate of current firmware, count on previous
  version, unassigned inventory.
- Per-org firmware rollout progress (total / current / previous / unassigned
  / %).
- Release notes log and rollout phases (canary, staged, full).

**Must support:**
- Initiating an OTA push scoped to: all orgs, specific orgs, or canary group.
- Pausing or rolling back a rollout if telemetry shows degradation.
- Viewing per-band rollout status (success, pending, failed).

### 4.4 System Health

**Purpose:** Platform infrastructure monitoring.

**Must show:**
- Service status for FCM, Firestore reads/writes, BLE Bridge, ML pipelines
  (iOS + Android), Cloud Functions, Webhook delivery.
- Per-service: region, p99 latency, error count (24h), uptime %.
- Overall platform uptime and SLA compliance.
- 24h error timeline with drill-down into specific failures.

**Must support:**
- Filtering by time range.
- Alerting integration (when a service breaches SLA, notify on-call).
- Drill-down into any service to see error stack traces and affected orgs.

### 4.5 Support Queue

**Purpose:** Customer support ticket management across all orgs.

**Must show:**
- Open tickets with ID, org, subject, priority, age, assigned agent.
- Summary metrics: open count, high priority count, avg response time,
  resolved count (7d), CSAT.

**Must support:**
- Filtering by org, priority, agent, status.
- Assigning or reassigning tickets.
- Creating a ticket on behalf of a customer.
- Linking tickets to incidents (INC-) or organizations for context.

### 4.6 Revenue

**Purpose:** SafeWave business metrics and per-customer contribution.

**Must show:**
- MRR, ARR, ARPA, 90-day churn rate.
- Per-customer revenue table sorted by MRR.
- Plan mix breakdown (Enterprise, Growth, Starter, Other) with contribution.
- Pipeline view: orgs in negotiation with estimated MRR and sales stage.

**Must support:**
- Exporting P&L-friendly CSV.
- Filtering by time range and plan.
- Drilling into a customer to see contract details and invoice history.

---

## 5. Org Admin Views (Tenant Context)

These screens are scoped to the current facility. Super Admins see identical
screens when impersonating, with the added context banner.

### 5.1 Operations / Situation Room

**Purpose:** Real-time command center. Primary screen during active incidents.

**Must show:**
- Active incident banner (when one exists) with type, zone, sent-by, sent-at,
  source, elapsed timer, ack count, pending count, median response time,
  delivery confirmation.
- 6 rolling 24h metrics: dispatched, ack rate, median response, devices
  online, low battery count, bands unassigned.
- Interactive facility map with zone-level status (nominal / alert). Clicking
  a zone shows zone detail.
- Live worker response table filterable by All / Ack / Pending — avatar,
  name, worker ID, group, ack method (band/app), response time, status.
- Live event stream with timestamped typed entries (ACK, DSP, SND, BLE, BAT).
- Quick dispatch composer: template selection, target selection, message,
  send button.

**Must support:**
- Send All Clear action (one-click dismissal of active incident).
- Escalate action (notify supervisors and create incident draft).
- Filtering worker response by team, method, status.
- Drilling into any worker for their band status and history.
- Auto-refresh with Firestore snapshot listeners (no manual reload).

### 5.2 Dispatch Log

**Purpose:** Historical record of every alert ever sent at this facility.

**Must show:**
- Summary: sent (7d), ack rate (7d), critical count, failed delivery count.
- Table: incident ID, type, zone/target, sent-at, sent-by, ack rate with
  progress bar, recipients, status (active/closed), priority.

**Must support:**
- Filtering by status (all/active/closed) and priority (critical/standard/info).
- Searching by incident ID, type, or zone.
- Date range filtering.
- Export CSV of filtered results.
- Clicking any row drills into full incident detail: per-worker response,
  audit trail, message content, escalation timeline, attached evidence.

### 5.3 Sound Events

**Purpose:** On-device ML detection log and sound model management.

**Must show:**
- Summary: events (24h), cascaded count, avg confidence, custom profile count,
  dismissed count.
- Event log: ID, detected sound type, confidence %, device count, zone,
  timestamp, cascade status (cascaded/logged/dismissed).
- Detection pipeline explainer (how sound → band → cloud → cascade works).
- Active sound models list with source (baseline/custom) and event volume.

**Must support:**
- Filtering by cascade status, sound type, confidence threshold.
- Dismissing false positives (write to audit log with reason).
- Training new custom sound models (org-specific alarms, custom alert tones).
- Configuring cascade thresholds per sound type (e.g., fire alarm triggers
  org-wide broadcast at N devices in M minutes).

**Privacy guarantee (must enforce in UI copy):**
- Audio data never leaves the worker's device.
- Only event payloads (type, confidence, device ID, timestamp) sync to cloud.

### 5.4 Workforce

**Purpose:** User, group, and role management.

**Must show across three tabs:**

**Workers tab:**
- Table: name, email, group, role, assigned band, status (online/offline),
  last seen.
- Counts: total workers, online count.

**Groups tab:**
- Card grid of groups with name, type (zone/role/shift), member count,
  last drill performance (ack % and avg response).
- "New group" card for creation.

**Roles tab:**
- Permission matrix across Super Admin / Org Admin / Supervisor / Worker.

**Must support:**
- Add worker (manual form or bulk CSV upload).
- Invite worker via email with magic link.
- Edit worker (group, role, assigned band).
- Deactivate worker (soft delete — preserves audit history).
- Create, edit, delete groups.
- Drag-and-drop worker reassignment between groups.
- Filter workers by role, group, status, last-seen range.
- Export workforce list for HR reconciliation.

### 5.5 Devices

**Purpose:** Band fleet management for this facility.

**Must show:**
- Summary: total bands, online count, unassigned count, low battery count,
  firmware adoption percentage.
- Device table (list or grid view): band ID, status, battery %, assigned
  worker, zone, firmware version, last seen.

**Must support:**
- Register new band (scan QR or enter serial).
- Assign band to worker.
- Unassign / decommission band.
- Toggle between list and grid view.
- Filtering by status (online/offline/unassigned), firmware version, battery
  level, zone.
- Requesting OTA firmware update (submitted to Super Admin for approval).
- Drilling into a band for detailed telemetry: connection history, battery
  graph, firmware history, vibration event log.

### 5.6 Reports & Compliance

**Purpose:** Drill performance, audit exports, regulatory posture.

**Must show:**
- Summary: 30d drill count, avg ack rate, avg response, audit entries.
- Drill history table: event name, date, type, ack rate, avg response,
  recipient count. Each row has a PDF export link.
- Ack distribution histogram for the most recent incident (0-2s, 2-4s, 4-6s,
  6-10s, pending buckets).
- Compliance posture for HIPAA, SOC 2 Type II, ADA/WCAG 2.1 AA, GDPR/CCPA,
  ISO 27001. Each with status and last-updated date.
- Scheduled exports list (recurring CSV/PDF deliveries).

**Must support:**
- Export audit pack (full archive with CSV + PDF + supporting evidence).
- Per-drill PDF report with message content, recipient list, response
  timeline, and ack evidence.
- Configuring scheduled exports (cadence, format, recipient email).
- Date range filtering for all report queries.
- Drill comparison view (compare two or more drills side by side).

### 5.7 Settings

**Purpose:** Organization-level configuration.

**Must show (5 sections):**

**Organization:**
- Facility name, client, facility type, timezone, address, primary contact.

**Notification Templates:**
- Pre-built templates (Fire Alarm, Evacuation, Shelter, All Clear, Shift Change).
- Custom templates created by this org.
- Per-template: name, priority, message default, vibration pattern.

**Escalation Rules:**
- Timeout before escalation.
- Escalation chain (resend, notify supervisors, create draft, email admin,
  page on-call).

**Integrations:**
- Firebase Cloud Messaging (required).
- Firestore (required).
- Amazon S3 (for audit archive).
- Optional: Slack, PagerDuty, Workday, Google Workspace SSO, Azure AD SSO.

**Billing (Org Admin sees view-only; Super Admin can modify):**
- Current plan, usage vs limits (workers, bands, dispatches).
- Invoice history with download links.

**Must support:**
- Editing any field with autosave.
- Creating a new custom template.
- Reordering escalation chain steps.
- Connecting / disconnecting integrations with OAuth flow.
- Requesting a plan upgrade (routes to SafeWave sales).

---

## 6. Cross-Cutting Requirements

### 6.1 Design system

- Typography: DM Sans for UI, DM Mono for tabular data and timestamps.
- Type scale: 10px mono labels, 11-13px body, 20-24px metric values, 24px
  page titles. No display-scale type over 32px.
- Color grammar:
  - Amber: alerts, active incidents, warnings.
  - Emerald: positive state, acknowledgments, healthy services.
  - Rose: critical failures, high-priority support, offline critical.
  - Sky: informational, unassigned devices, sound events.
  - Neutral: default.
- Consistent primitives: Card, CardHeader, Button (primary/secondary/amber/ghost),
  StatusPill, PriorityDot, Eyebrow label.

### 6.2 Responsive behavior

- Primary target: 1280px+ desktop (ops center displays).
- Tablet support (1024px): sidebar collapses to icons, tables become scrollable.
- Mobile: read-only view of active incidents and dispatch log. Full composer
  lives in the mobile app for Org Admins on the move.

### 6.3 Real-time updates

- All screens showing live data must use Firestore onSnapshot listeners.
- No manual refresh required anywhere.
- Active incident state updates subsecond on ack events.
- System health metrics poll every 30 seconds.

### 6.4 Accessibility

- WCAG 2.1 AA compliance.
- Full keyboard navigation for all controls.
- Screen reader support for all status indicators (not color-only).
- Live regions for incoming events and acknowledgments.
- Minimum 4.5:1 contrast ratio for all text.

### 6.5 Performance

- Initial page load under 2 seconds on a 3G connection.
- Active incident banner renders within 500ms of Firestore write.
- Tables virtualize beyond 200 rows.
- Images and icons lazy-loaded outside the fold.

### 6.6 Internationalization

- English (US) only in v1.
- Architecture must support adding Spanish, French, and Japanese in v2
  without refactoring.

---

## 7. Data Model Dependencies

The dashboard reads from and writes to the following Firestore collections
(per the Safewave Technical Scope v1.0):

- `users`, `organizations`, `bands`, `groups`
- `notifications`, `responses`, `notif_templates`
- `sound_events`, `audit_logs`, `activity_logs`

Platform-level collections (Super Admin only):

- `support_tickets`, `billing_records`, `firmware_releases`
- `system_metrics`, `pipeline_deals`

---

## 8. Build Phases

Aligned with the Technical Scope roadmap:

| Phase | Dashboard deliverable                                              |
|-------|--------------------------------------------------------------------|
| 1     | Stabilization — existing dashboard fixes, no new screens           |
| 2     | Schema Foundation — all screens re-wire to cleaned collections     |
| 3     | Operations screen + Dispatch Log + Quick Composer                  |
| 4     | Ack tracking real-time + worker response table                     |
| 5     | Workforce (Groups tab) + group targeting in composer               |
| 6     | Sound Events screen + cascade configuration                        |
| 7     | Templates + Escalation Rules in Settings                           |
| 8     | Reports & Compliance screen + audit pack export                    |
| 9     | Super Admin: Platform Overview, Organizations, Fleet Ops,          |
|       | System Health, Support Queue, Revenue                              |
| 10    | Messaging (extension of Dispatch with Info priority)               |
| 11    | OTA Firmware management (per-band and fleet-wide)                  |

Phases 1-8 serve Org Admins and close the Amazon deal.
Phase 9 serves SafeWave internal operations and scales the business.
Phases 10-11 extend both as client demand dictates.

---

## 9. Open Questions

- Should Org Admins be able to create their own custom sound models, or is
  that a SafeWave-assisted workflow?
- What is the SLA on Super Admin impersonation? Does it auto-expire after
  N minutes?
- Billing self-service for Org Admins: v1 or v2?
- Mobile dashboard: native app or responsive web?
- Multi-facility Org Admins (one user, multiple facilities): handled via
  facility switcher or separate accounts?