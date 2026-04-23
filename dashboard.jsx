import React, { useState, useEffect, useReducer, useContext, createContext, useMemo } from "react";
import {
  Activity,
  Bell,
  BellRing,
  Volume2,
  Users,
  Watch,
  FileText,
  Settings,
  Shield,
  ShieldCheck,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Check,
  Radio,
  Send,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Clock,
  Filter,
  Download,
  Plus,
  Battery,
  MapPin,
  Edit,
  Mail,
  Building2,
  KeyRound,
  Zap,
  Calendar,
  LayoutGrid,
  List,
  ArrowRight,
  Server,
  Database,
  Cpu,
  Globe,
  LifeBuoy,
  DollarSign,
  BarChart3,
  UserCog,
  Rocket,
  GitBranch,
  AlertCircle,
  Eye,
  LogIn,
  Home,
  User,
  Wifi,
  PlayCircle,
  RotateCcw,
  SkipForward,
  Smartphone,
  X,
  Link2,
  CreditCard,
  Lock,
  GripVertical,
  MessageCircle,
  Cloud,
} from "lucide-react";

// ============================================================
// FONTS & TOKENS
// ============================================================
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
`;

const SANS = { fontFamily: "'Poppins', sans-serif" };
const MONO = { fontFamily: "'Poppins', sans-serif", fontFeatureSettings: "'tnum'" };

// ============================================================
// SHARED DATA
// ============================================================
const ORGS = [
  { id: "mih1", shortName: "Michigan", name: "Michigan Hospital — Detroit", client: "Michigan Health System", type: "Teaching hospital",   addr: "1235 Medical Park Dr, Detroit, MI 48202",contact: "Jessica Morales — j.morales@michiganhospital.org", users: 421, bands: 386, mrr: 12420, plan: "Enterprise", health: "nominal",  lastIncident: "14:32", signup: "Mar 2026", contract: "3yr" },
  { id: "jfk8", shortName: "JFK8",     name: "Amazon JFK8 — Staten Is.",    client: "Amazon",                 type: "Fulfillment center",  addr: "546 Gulf Ave, Staten Island, NY 10314",  contact: "Nadia Park — n.park@amazon.com",                   users: 612, bands: 598, mrr: 18060, plan: "Enterprise", health: "nominal",  lastIncident: "2d",    signup: "Jan 2026", contract: "3yr" },
  { id: "dc42", shortName: "DC-42",    name: "Target DC-42 — Phoenix",      client: "Target",                 type: "Distribution center", addr: "3131 E Buckeye Rd, Phoenix, AZ 85034",   contact: "Derek Liu — d.liu@target.com",                     users: 287, bands: 254, mrr:  8430, plan: "Growth",     health: "alert",    lastIncident: "now",   signup: "Jul 2026", contract: "1yr" },
  { id: "hop1", shortName: "Mercy",    name: "Mercy Hospital — Boston",     client: "Mercy",                  type: "Hospital",            addr: "330 Brookline Ave, Boston, MA 02215",    contact: "Dr. Priya Shah — p.shah@mercyhealth.org",          users: 148, bands: 142, mrr:  5920, plan: "Growth",     health: "nominal",  lastIncident: "6h",    signup: "Sep 2026", contract: "1yr" },
  { id: "fac9", shortName: "Kraft",    name: "Kraft Foods — Chicago",       client: "Kraft",                  type: "Food production",     addr: "200 E Randolph St, Chicago, IL 60601",   contact: "Eva Lindqvist — e.lindqvist@kraft.com",            users: 94,  bands: 89,  mrr:  3760, plan: "Starter",    health: "nominal",  lastIncident: "3d",    signup: "Sep 2026", contract: "1yr" },
  { id: "edu3", shortName: "NYU",      name: "NYU Campus Safety",           client: "NYU",                    type: "University campus",   addr: "70 Washington Sq S, New York, NY 10012", contact: "Chief R. Okafor — r.okafor@nyu.edu",               users: 208, bands: 198, mrr:  7320, plan: "Growth",     health: "degraded", lastIncident: "1h",    signup: "Aug 2026", contract: "2yr" },
];

const CURRENT_ORG = ORGS[0]; // fallback default; root tracks live currentOrg in state

const FACILITY_ZONES = [
  { id: "z1", name: "Emergency",  workers: 62, status: "nominal", x: 6,  y: 10, w: 30, h: 26 },
  { id: "z2", name: "ICU",        workers: 74, status: "nominal", x: 38, y: 10, w: 26, h: 26 },
  { id: "z3", name: "Radiology",  workers: 84, status: "alert",   x: 66, y: 10, w: 28, h: 26 },
  { id: "z4", name: "Surgery",    workers: 58, status: "nominal", x: 6,  y: 40, w: 34, h: 26 },
  { id: "z5", name: "Pediatrics", workers: 41, status: "nominal", x: 42, y: 40, w: 22, h: 26 },
  { id: "z6", name: "Cardiology", workers: 12, status: "nominal", x: 66, y: 40, w: 28, h: 26 },
  { id: "z7", name: "Lobby",      workers: 90, status: "nominal", x: 6,  y: 70, w: 88, h: 18 },
];

const ACTIVE_INCIDENT = {
  id: "INC-8821",
  type: "Fire Alarm",
  zone: "Radiology",
  sentAt: "14:32:08",
  sentBy: "J. Morales",
  recipients: 84,
  ack: 71,
  pending: 13,
  median: 2.8,
  source: "Sound cascade · 14 devices",
};

const WORKERS = [
  { name: "M. Chen",      id: "W-1104", group: "Rad · Day",   t: "1.8s", method: "band", status: "ack" },
  { name: "R. Patel",     id: "W-1128", group: "Rad · Day",   t: "2.1s", method: "band", status: "ack" },
  { name: "D. Williams",  id: "W-1141", group: "Rad · Swing", t: "2.4s", method: "app",  status: "ack" },
  { name: "K. Johnson",   id: "W-1156", group: "Rad · Swing", t: "3.0s", method: "band", status: "ack" },
  { name: "S. Nguyen",    id: "W-1163", group: "Rad · Night", t: "3.2s", method: "band", status: "ack" },
  { name: "A. Gomez",     id: "W-1170", group: "Rad · Night", t: "3.8s", method: "app",  status: "ack" },
  { name: "T. Brooks",    id: "W-1181", group: "Rad · Day",   t: "4.1s", method: "band", status: "ack" },
  { name: "L. Park",      id: "W-1195", group: "Rad · Swing", t: "—",    method: "—",    status: "pending" },
  { name: "J. Alvarez",   id: "W-1208", group: "Rad · Night", t: "—",    method: "—",    status: "pending" },
  { name: "B. Singh",     id: "W-1214", group: "Rad · Day",   t: "—",    method: "—",    status: "pending" },
];

const STREAM = [
  { t: "14:32:55", type: "ACK", who: "T. Brooks",     meta: "band · Radiology · 4.1s" },
  { t: "14:32:53", type: "ACK", who: "A. Gomez",      meta: "app · Radiology · 3.8s" },
  { t: "14:32:51", type: "ACK", who: "S. Nguyen",     meta: "band · Radiology · 3.2s" },
  { t: "14:32:50", type: "ACK", who: "K. Johnson",    meta: "band · Radiology · 3.0s" },
  { t: "14:32:49", type: "ACK", who: "D. Williams",   meta: "app · Radiology · 2.4s" },
  { t: "14:32:48", type: "ACK", who: "R. Patel",      meta: "band · Radiology · 2.1s" },
  { t: "14:32:48", type: "ACK", who: "M. Chen",       meta: "band · Radiology · 1.8s" },
  { t: "14:32:08", type: "DSP", who: "Fire Alarm",    meta: "dispatched to 84" },
  { t: "14:32:06", type: "SND", who: "Sound cascade", meta: "fire alarm · 14 dev · 96%" },
];

const TEMPLATES = [
  { id: "t1", icon: Flame,         name: "Fire Alarm",   priority: "critical", pattern: "3× strong" },
  { id: "t2", icon: AlertTriangle, name: "Evacuation",   priority: "critical", pattern: "Continuous" },
  { id: "t3", icon: Shield,        name: "Shelter",      priority: "critical", pattern: "2× long" },
  { id: "t4", icon: CheckCircle2,  name: "All Clear",    priority: "standard", pattern: "1× soft" },
  { id: "t5", icon: Radio,         name: "Shift Change", priority: "info",     pattern: "1× pulse" },
];

// Super Admin data
const PLATFORM_METRICS = [
  { label: "Total orgs",         value: "14",     delta: "+2",    trend: "up",   positive: true  },
  { label: "Platform MRR",       value: "$94.2k", delta: "+$8.4k",trend: "up",   positive: true  },
  { label: "Bands shipped",      value: "2,847",  delta: "+184",  trend: "up",   positive: true  },
  { label: "Active workers",     value: "4,218",  delta: "+312",  trend: "up",   positive: true  },
  { label: "Open incidents",     value: "3",      delta: "+1",    trend: "up",   positive: false },
  { label: "Support queue",      value: "7",      delta: "-3",    trend: "down", positive: true  },
];

const SYSTEM_HEALTH = [
  { service: "FCM Delivery",      region: "us-east-1", status: "nominal",  p99: "142ms", errors: 0,   uptime: "99.99%" },
  { service: "Firestore Reads",   region: "us-east-1", status: "nominal",  p99: "38ms",  errors: 2,   uptime: "99.98%" },
  { service: "Firestore Writes",  region: "us-east-1", status: "nominal",  p99: "71ms",  errors: 0,   uptime: "99.99%" },
  { service: "BLE Bridge",        region: "edge",      status: "degraded", p99: "890ms", errors: 47,  uptime: "99.72%" },
  { service: "ML Pipeline iOS",   region: "on-device", status: "nominal",  p99: "212ms", errors: 1,   uptime: "99.98%" },
  { service: "ML Pipeline And.",  region: "on-device", status: "nominal",  p99: "298ms", errors: 3,   uptime: "99.96%" },
  { service: "Cloud Functions",   region: "us-east-1", status: "nominal",  p99: "124ms", errors: 0,   uptime: "99.99%" },
  { service: "Webhook Delivery",  region: "us-east-1", status: "nominal",  p99: "89ms",  errors: 1,   uptime: "99.97%" },
];

const SUPPORT_QUEUE = [
  { id: "TKT-2104", org: "Target DC-42",  subject: "3 bands won't connect after firmware update",      pri: "high",   age: "2h",   agent: "—"         },
  { id: "TKT-2103", org: "Amazon JFK8",   subject: "Request: custom sound model for forklift alarms",  pri: "med",    age: "4h",   agent: "Sarah K."  },
  { id: "TKT-2102", org: "NYU Campus",    subject: "Android push delivery intermittent on Pixel 8",     pri: "high",   age: "6h",   agent: "Dev team"  },
  { id: "TKT-2101", org: "Mercy Hospital",subject: "HIPAA audit: need data retention documentation",   pri: "med",    age: "1d",   agent: "Legal"     },
  { id: "TKT-2100", org: "Kraft Foods",   subject: "How do I add a new supervisor role?",              pri: "low",    age: "1d",   agent: "Sarah K."  },
  { id: "TKT-2099", org: "Michigan Hospital",subject: "OTA to v2.4.1 — any known issues?",               pri: "low",    age: "2d",   agent: "Dev team"  },
  { id: "TKT-2098", org: "Target DC-42",  subject: "Billing: confirm enterprise upgrade pricing",      pri: "med",    age: "2d",   agent: "Billing"   },
];

const FIRMWARE_ROLLOUT = [
  { org: "Michigan Hospital",total: 386, current: 355, previous: 28,  unassigned: 3,  pct: 92 },
  { org: "Amazon JFK8",    total: 598, current: 598, previous: 0,   unassigned: 0,  pct: 100 },
  { org: "Target DC-42",   total: 254, current: 201, previous: 53,  unassigned: 0,  pct: 79 },
  { org: "Mercy Hospital", total: 142, current: 142, previous: 0,   unassigned: 0,  pct: 100 },
  { org: "Kraft Foods",    total: 89,  current: 68,  previous: 21,  unassigned: 0,  pct: 76 },
  { org: "NYU Campus",     total: 198, current: 188, previous: 10,  unassigned: 0,  pct: 95 },
];

// Other screen data (truncated for brevity — re-used from prior)
const DISPATCH_HISTORY = [
  { id: "INC-8821", type: "Fire Alarm",        zone: "Radiology",      sentAt: "Oct 22 · 14:32", by: "J. Morales",   recipients: 84,  ack: 71,  pct: 85, status: "active",   priority: "critical" },
  { id: "INC-8820", type: "All Clear",         zone: "All facility",   sentAt: "Oct 22 · 11:05", by: "J. Morales",   recipients: 421, ack: 418, pct: 99, status: "closed",   priority: "standard" },
  { id: "INC-8819", type: "Fire drill",        zone: "All facility",   sentAt: "Oct 22 · 10:00", by: "System",       recipients: 421, ack: 412, pct: 98, status: "closed",   priority: "critical" },
  { id: "INC-8818", type: "Shift Change",      zone: "Night → Day",    sentAt: "Oct 22 · 06:00", by: "System",       recipients: 90,  ack: 87,  pct: 97, status: "closed",   priority: "info"     },
  { id: "INC-8817", type: "Evacuation",        zone: "Surgery",        sentAt: "Oct 21 · 16:47", by: "M. Ortega",    recipients: 58,  ack: 58,  pct: 100,status: "closed",   priority: "critical" },
  { id: "INC-8816", type: "Code Blue",         zone: "ICU",            sentAt: "Oct 21 · 13:22", by: "T. Williams",  recipients: 41,  ack: 40,  pct: 98, status: "closed",   priority: "critical" },
  { id: "INC-8815", type: "All Clear",         zone: "Surgery",        sentAt: "Oct 21 · 17:10", by: "M. Ortega",    recipients: 58,  ack: 58,  pct: 100,status: "closed",   priority: "standard" },
  { id: "INC-8814", type: "Shelter in Place",  zone: "Emergency",      sentAt: "Oct 20 · 09:14", by: "J. Morales",   recipients: 62,  ack: 61,  pct: 98, status: "closed",   priority: "critical" },
];

const METRICS_24H = [
  { label: "Dispatched · 24h",    value: "12",   delta: "+2",    trend: "up",   positive: true  },
  { label: "Ack rate · 24h",      value: "97%",  delta: "+3pt",  trend: "up",   positive: true  },
  { label: "Median response",     value: "3.1s", delta: "-0.4s", trend: "down", positive: true  },
  { label: "Devices online",      value: "312",  delta: "−4",    trend: "down", positive: false },
  { label: "Low battery",         value: "7",    delta: "+2",    trend: "up",   positive: false },
  { label: "Bands unassigned",    value: "74",   delta: "0",     trend: "flat", positive: true  },
];

const ALL_WORKERS = [
  { name: "Marcus Chen",      id: "W-1104", email: "m.chen@michiganhospital.org",     group: "Radiology · Day",   band: "A2-041", role: "Tech",       status: "online",  lastSeen: "now"  },
  { name: "Rahul Patel",      id: "W-1128", email: "r.patel@michiganhospital.org",    group: "Radiology · Day",   band: "A2-112", role: "Tech",       status: "online",  lastSeen: "now"  },
  { name: "Jessica Morales",  id: "W-0204", email: "j.morales@michiganhospital.org",  group: "Safety Leads",       band: "A1-004", role: "Supervisor", status: "online",  lastSeen: "now"  },
  { name: "Darius Williams",  id: "W-1141", email: "d.williams@michiganhospital.org", group: "Radiology · Swing", band: "A2-076", role: "Nurse",      status: "online",  lastSeen: "2m"   },
  { name: "Kevin Johnson",    id: "W-1156", email: "k.johnson@michiganhospital.org",  group: "Radiology · Swing", band: "A2-089", role: "Nurse",      status: "online",  lastSeen: "4m"   },
  { name: "Sophia Nguyen",    id: "W-1163", email: "s.nguyen@michiganhospital.org",   group: "Radiology · Night", band: "A2-091", role: "Tech",       status: "online",  lastSeen: "6m"   },
  { name: "Amelia Gomez",     id: "W-1170", email: "a.gomez@michiganhospital.org",    group: "Radiology · Night", band: "A2-095", role: "Nurse",      status: "online",  lastSeen: "8m"   },
  { name: "Tariq Brooks",     id: "W-1181", email: "t.brooks@michiganhospital.org",   group: "Radiology · Day",   band: "A2-103", role: "Tech",       status: "online",  lastSeen: "12m"  },
  { name: "Leah Park",        id: "W-1195", email: "l.park@michiganhospital.org",     group: "Radiology · Swing", band: "—",      role: "Nurse",      status: "offline", lastSeen: "2h"   },
  { name: "Jorge Alvarez",    id: "W-1208", email: "j.alvarez@michiganhospital.org",  group: "Radiology · Night", band: "A2-119", role: "Tech",       status: "offline", lastSeen: "3h"   },
  { name: "Bhavin Singh",     id: "W-1214", email: "b.singh@michiganhospital.org",    group: "Radiology · Day",   band: "A2-122", role: "Tech",       status: "offline", lastSeen: "1d"   },
  { name: "Michael Ortega",   id: "W-0208", email: "m.ortega@michiganhospital.org",   group: "Safety Leads",       band: "A1-008", role: "Supervisor", status: "online",  lastSeen: "now"  },
];

const DEVICES = [
  { id: "A2-041", firmware: "2.4.1", battery: 87, status: "online",      assignedTo: "Marcus Chen",     zone: "Rad",  lastSeen: "now"  },
  { id: "A2-112", firmware: "2.4.1", battery: 18, status: "online",      assignedTo: "Rahul Patel",     zone: "Rad",  lastSeen: "now"  },
  { id: "A2-076", firmware: "2.4.1", battery: 64, status: "online",      assignedTo: "Darius Williams", zone: "Rad",  lastSeen: "2m"   },
  { id: "A2-089", firmware: "2.3.8", battery: 42, status: "online",      assignedTo: "Kevin Johnson",   zone: "Rad",  lastSeen: "4m"   },
  { id: "A2-091", firmware: "2.4.1", battery: 91, status: "online",      assignedTo: "Sophia Nguyen",   zone: "Rad",  lastSeen: "6m"   },
  { id: "A2-119", firmware: "2.4.1", battery: 73, status: "offline",     assignedTo: "Jorge Alvarez",   zone: "Rad",  lastSeen: "3h"   },
  { id: "A2-122", firmware: "2.3.8", battery: 9,  status: "offline",     assignedTo: "Bhavin Singh",    zone: "Rad",  lastSeen: "1d"   },
  { id: "A2-155", firmware: "2.4.1", battery: 100,status: "unassigned",  assignedTo: "—",               zone: "—",    lastSeen: "5d"   },
  { id: "A1-004", firmware: "2.4.1", battery: 78, status: "online",      assignedTo: "Jessica Morales", zone: "All", lastSeen: "now"  },
];

const DRILL_REPORTS = [
  { label: "Fire drill — Oct 22",   date: "Oct 22", rate: 98, avg: 3.1, count: 421, type: "Fire drill" },
  { label: "Evac — Oct 14",         date: "Oct 14", rate: 96, avg: 3.8, count: 418, type: "Evacuation" },
  { label: "Shelter — Sep 28",      date: "Sep 28", rate: 94, avg: 4.6, count: 402, type: "Shelter"    },
  { label: "Fire drill — Sep 12",   date: "Sep 12", rate: 91, avg: 5.1, count: 415, type: "Fire drill" },
  { label: "Fire drill — Aug 30",   date: "Aug 30", rate: 96, avg: 4.1, count: 411, type: "Fire drill" },
];

// ============================================================
// PRIMITIVES
// ============================================================
function Eyebrow({ children, className = "" }) {
  return (
    <div className={`text-[10px] uppercase tracking-[0.16em] text-neutral-500 ${className}`} style={MONO}>
      {children}
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`bg-white border border-neutral-200 rounded-md ${className}`}>{children}</div>;
}

function CardHeader({ eyebrow, title, right, info, infoAlign, className = "" }) {
  return (
    <div className={`flex items-center justify-between px-5 py-4 border-b border-neutral-100 ${className}`}>
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <div className={`text-sm text-neutral-900 flex items-center gap-1.5 ${eyebrow ? "mt-1" : ""}`} style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.01em" }}>
          <span>{title}</span>
          {info && <InfoTooltip text={info} align={infoAlign} />}
        </div>
      </div>
      {right}
    </div>
  );
}

function PageHeader({ title, subtitle, actions, info }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl text-neutral-900" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.025em" }}>
            {title}
          </h1>
          {info && <InfoTooltip text={info} />}
        </div>
        {subtitle && <p className="text-sm text-neutral-500 mt-1" style={SANS}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

function InfoTooltip({ text, align = "left" }) {
  const alignClass =
    align === "right"  ? "right-0" :
    align === "center" ? "left-1/2 -translate-x-1/2" :
                         "left-0";
  return (
    <span className="relative inline-flex group align-middle">
      <button
        type="button"
        className="w-4 h-4 rounded-full border border-neutral-300 bg-white text-neutral-500 hover:border-neutral-500 hover:text-neutral-800 flex items-center justify-center transition cursor-help shrink-0"
        aria-label="Component description"
      >
        <span className="text-[9px] leading-none" style={{ ...MONO, fontWeight: 700 }}>i</span>
      </button>
      <span
        className={`absolute ${alignClass} top-full mt-2 w-[260px] p-3 text-[11px] leading-relaxed text-neutral-700 bg-white border border-neutral-200 rounded-md shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150`}
        style={{ ...SANS, fontWeight: 400 }}
      >
        {text}
      </span>
    </span>
  );
}

// ============================================================
// INFO CAPTIONS — neutral one-liners shown on hover-i
// ============================================================
const INFO = {
  // Org Admin pages
  ops:       "Situation Room — primary screen during an incident. Live ack tracking, zone-level facility status, individual worker response, and a live event stream. Firestore snapshot listeners update subsecond. Click Simulate incident to run a scripted demo.",
  dispatch:  "Every alert sent at this facility — drills, real incidents, shift changes, all-clears. Searchable and filterable by status and priority; exportable as CSV for compliance audits.",
  sounds:    "On-device ML detections (fire alarms, smoke, forklift horns, custom sounds). Audio never leaves the worker's phone — only event metadata syncs to the cloud. Events above the cascade threshold auto-broadcast org-wide.",
  workforce: "People, groups, and permissions. Workers manages individual accounts and band assignments. Groups organizes teams by zone, role, or shift. Roles shows the access matrix — enforced at the API layer and logged to audit.",
  devices:   "Every SafeWave band assigned to this facility. Track battery, firmware version, assignment, zone, and connection state. Register new bands via QR; request firmware updates from SafeWave ops.",
  reports:   "Audit-ready exports. Drill history with ack distributions, compliance posture across HIPAA / SOC 2 / ADA / GDPR / ISO 27001, and scheduled PDF/CSV deliveries for regulatory filings.",
  settings:  "Facility-level configuration: organization details, notification templates, escalation rules, and a billing view. Every change is written to the audit log with actor and timestamp.",

  // Super Admin pages
  platform:  "SafeWave-wide state at a glance for internal staff. Cross-org metrics, a tenant table you can drop into, and a feed of incidents or degraded services that need attention. Super Admin only.",
  orgs:      "Every customer organization. Search, filter by plan and health, onboard new orgs through a guided wizard, or enter tenant view to support or impersonate. Super Admin only.",
  fleet:     "Firmware rollouts across every org. Push OTA to canary / staged / full; pause or roll back if telemetry degrades. Per-org adoption visible at a glance.",
  health:    "Platform infrastructure health. Eight upstream services tracked — FCM, Firestore, BLE bridge, ML pipelines, Cloud Functions, webhooks. Latency, errors, uptime. Alerts fire on SLA breach.",
  support:   "Every open customer ticket, prioritized and age-tracked. Assign or reassign, link tickets to incidents, respond inside the tool.",
  revenue:   "SafeWave business metrics — MRR, ARR, ARPA, 90-day churn. Per-customer revenue table, plan mix breakdown, and a pipeline of deals in negotiation with sales-stage tracking.",

  // Cards inside Operations
  opsIncident:  "The single highest-priority active alert. Shows elapsed time, ack progress, pending count, and supervisor controls (Send All Clear, Escalate).",
  opsMetrics:   "Rolling 24-hour operational metrics — dispatch volume, ack rate, median response, device health.",
  opsMap:       "Zone-level map of the physical facility. Zones with active incidents highlight amber; worker density shown as a per-zone count.",
  opsWorkers:   "Per-worker ack state for the most recent incident — who acknowledged, how fast, and by which method (band or app). Filterable by status.",
  opsStream:    "Live operational timeline — acknowledgments, dispatches, sound cascades. Sub-second updates via Firestore snapshot listeners.",
  opsDispatch:  "One-click broadcast composer. Pre-built templates, target groups, priority-aware haptic patterns. Typical dispatch completes in under 3 seconds.",

  // Cards inside Platform Overview
  platformTenants:  "All customer orgs with health status and revenue contribution. Click any row to impersonate that tenant.",
  platformAlerts:   "Cross-org incidents, degraded services, and failing rollouts that need attention. Most urgent first.",
  platformActivity: "Rolling 7-day volume across dispatches, acks, sound events, signups, and support.",

  // Card infos used across other screens
  fleetRollout:   "Current firmware adoption per org. Pause or roll back a rollout if telemetry shows degradation.",
  healthServices: "Eight upstream services with latency, errors, uptime. Alerts trigger when any service breaches its SLA.",
  supportQueue:   "Open tickets across every org. Priority-sorted and aged against SLA.",
  revenueByCust:  "Per-customer MRR sorted high to low, with % of total.",
  revenuePlanMix: "Revenue distribution by plan tier.",
  revenuePipeline:"Deals in negotiation with estimated MRR and sales stage.",
  soundLog:       "Every on-device sound detection. Confidence bar shows ML certainty; 'Cascaded' means the event triggered an org-wide broadcast.",
  reportsDrills:  "Every drill and real incident with ack rate, median response, and recipient count. Click PDF for a full audit export.",
  reportsPosture: "Current compliance status across major frameworks. Color reflects readiness at last audit.",
  rolesMatrix:    "Which capabilities each role can access. Enforced at the API layer; all attempts logged to audit trail.",
  settingsOrg:    "Core facility metadata. Autosaves on edit; every change is written to the audit log.",
};

function Button({ children, variant = "secondary", size = "md", icon: Icon, className = "", ...props }) {
  const sizes = {
    sm: "h-7 px-2.5 text-[11px]",
    md: "h-9 px-4 text-xs",
    lg: "h-10 px-5 text-sm",
  };
  const variants = {
    primary:   "bg-[#17abe2] hover:bg-[#1396c7] text-white border border-[#17abe2]",
    secondary: "bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300",
    amber:     "bg-amber-600 hover:bg-amber-700 text-white border border-amber-600",
    ghost:     "bg-transparent hover:bg-neutral-100 text-neutral-700 border border-transparent",
  };
  return (
    <button
      className={`rounded flex items-center justify-center gap-1.5 transition ${sizes[size]} ${variants[variant]} ${className}`}
      style={{ ...SANS, fontWeight: 500 }}
      {...props}
    >
      {Icon && <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />}
      {children}
    </button>
  );
}

function StatusPill({ status, label }) {
  const styles = {
    ack:        "bg-emerald-50 border-emerald-200 text-emerald-800",
    pending:    "bg-amber-50 border-amber-200 text-amber-800",
    online:     "bg-emerald-50 border-emerald-200 text-emerald-800",
    offline:    "bg-neutral-50 border-neutral-200 text-neutral-600",
    active:     "bg-amber-50 border-amber-200 text-amber-800",
    closed:     "bg-neutral-50 border-neutral-200 text-neutral-600",
    nominal:    "bg-emerald-50 border-emerald-200 text-emerald-800",
    alert:      "bg-amber-50 border-amber-200 text-amber-800",
    degraded:   "bg-rose-50 border-rose-200 text-rose-800",
    high:       "bg-rose-50 border-rose-200 text-rose-800",
    med:        "bg-amber-50 border-amber-200 text-amber-800",
    low:        "bg-neutral-50 border-neutral-200 text-neutral-600",
    unassigned: "bg-sky-50 border-sky-200 text-sky-700",
  };
  return (
    <span className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded border ${styles[status] || styles.closed}`} style={{ ...MONO, fontWeight: 500 }}>
      {label}
    </span>
  );
}

function PriorityDot({ priority }) {
  const colors = { critical: "bg-amber-500", standard: "bg-neutral-400", info: "bg-sky-500" };
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[priority]}`} />;
}

function HealthDot({ status }) {
  const colors = { nominal: "bg-emerald-500", degraded: "bg-rose-500", alert: "bg-amber-500" };
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[status] || "bg-neutral-400"}`} />;
}

// ============================================================
// DEMO STATE MACHINE — scripted incident simulation
// ============================================================
const DEMO_TOTAL_RECIPIENTS = 84;
const DEMO_TARGET_ACKS = 71;

const DEMO_TOTAL_NARRATIVE_STEPS = 7;

const DEMO_SCRIPT = [
  { at: 0,  action: "NARRATE", step: 1, title: "Sound detected on the worker's phone",
    body: "Our ML model just recognized a fire alarm at 96% confidence. The audio never leaves the phone — only the event metadata (type, confidence, timestamp) syncs to the cloud." },
  { at: 1,  action: "SOUND_DETECTED" },
  { at: 2,  action: "CASCADE_FIRE" },
  { at: 2,  action: "NARRATE", step: 2, title: "Cascade fires automatically",
    body: "14 devices confirmed the same sound within seconds. Safewave auto-broadcasts an alert to every worker in Radiology. No supervisor had to press a button." },
  { at: 3,  action: "MOBILE_VIBRATE" },
  { at: 3,  action: "NARRATE", step: 3, title: "Every band on the floor vibrates",
    body: "Workers feel a 3× strong haptic pattern coded to \"fire alarm.\" They don't need to see a screen — they know what kind of emergency it is by feel." },
  { at: 4,  action: "MOBILE_ALERT_SHOWN" },
  { at: 4,  action: "WORKER_ACK", id: "W-1104" },
  { at: 5,  action: "WORKER_ACK", id: "W-1128" },
  { at: 5,  action: "NARRATE", step: 4, title: "Acknowledgments arriving in real time",
    body: "One tap on the band confirms receipt. Every ack logs with its response time. Supervisors see exactly who has and hasn't responded — individually." },
  { at: 6,  action: "WORKER_ACK", id: "W-1141" },
  { at: 7,  action: "WORKER_ACK", id: "W-1156" },
  { at: 8,  action: "WORKER_ACK", id: "W-1163" },
  { at: 9,  action: "BULK_ACK",   count: 3  },
  { at: 10, action: "MOBILE_ACK" },
  { at: 11, action: "WORKER_ACK", id: "W-1170" },
  { at: 12, action: "BULK_ACK",   count: 5  },
  { at: 13, action: "WORKER_ACK", id: "W-1181" },
  { at: 15, action: "BULK_ACK",   count: 8  },
  { at: 20, action: "BULK_ACK",   count: 10 },
  { at: 20, action: "NARRATE", step: 5, title: "4–6× faster than a siren",
    body: "50+ workers acknowledged in under 20 seconds with complete individual accountability. Traditional sirens give you neither speed nor confirmation." },
  { at: 25, action: "BULK_ACK",   count: 8  },
  { at: 30, action: "BULK_ACK",   count: 7  },
  { at: 35, action: "BULK_ACK",   count: 6  },
  { at: 40, action: "BULK_ACK",   count: 6  },
  { at: 45, action: "BULK_ACK",   count: 5  },
  { at: 50, action: "BULK_ACK",   count: 4  },
  { at: 55, action: "BULK_ACK",   count: 2  },
  { at: 58, action: "CLEAR_HINT" },
  { at: 58, action: "NARRATE", step: 6, title: "Ready to issue All Clear",
    body: "Ack rate is above threshold. The supervisor resolves the incident with one click — every band receives a soft 'all clear' pattern and returns to idle." },
];

function formatElapsed(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatStreamTime(sec) {
  const total = 14 * 3600 + 32 * 60 + 8 + sec;
  const h = Math.floor(total / 3600) % 24;
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const demoInitialState = {
  phase: "idle",           // idle | running | resolved
  elapsedSec: 0,
  ackCount: 0,
  ackedIds: [],
  eventLog: [],
  mobilePhase: "idle",     // idle | vibrating | alert-shown | acked | cleared
  clearHint: false,
  narrative: null,         // { step, title, body }
};

function applyStep(state, step) {
  const t = formatStreamTime(state.elapsedSec);
  switch (step.action) {
    case "SOUND_DETECTED":
      return {
        ...state,
        eventLog: [{ id: `s${state.elapsedSec}`, t, type: "SND", who: "Sound cascade", meta: "fire alarm · 14 dev · 96%" }, ...state.eventLog],
      };
    case "CASCADE_FIRE":
      return {
        ...state,
        eventLog: [{ id: `d${state.elapsedSec}`, t, type: "DSP", who: "Fire Alarm", meta: `dispatched to ${DEMO_TOTAL_RECIPIENTS}` }, ...state.eventLog],
      };
    case "MOBILE_VIBRATE":
      return { ...state, mobilePhase: "vibrating" };
    case "MOBILE_ALERT_SHOWN":
      return { ...state, mobilePhase: "alert-shown" };
    case "MOBILE_ACK":
      return { ...state, mobilePhase: "acked" };
    case "WORKER_ACK": {
      const worker = WORKERS.find((w) => w.id === step.id);
      if (!worker || state.ackedIds.includes(step.id)) return state;
      return {
        ...state,
        ackCount: Math.min(DEMO_TARGET_ACKS, state.ackCount + 1),
        ackedIds: [...state.ackedIds, step.id],
        eventLog: [
          { id: `a${step.id}`, t, type: "ACK", who: worker.name, meta: `${worker.group} · ${worker.t === "—" ? "2.6s" : worker.t}` },
          ...state.eventLog,
        ],
      };
    }
    case "BULK_ACK":
      return { ...state, ackCount: Math.min(DEMO_TARGET_ACKS, state.ackCount + step.count) };
    case "CLEAR_HINT":
      return { ...state, clearHint: true };
    case "NARRATE":
      return {
        ...state,
        narrative: { step: step.step, totalSteps: DEMO_TOTAL_NARRATIVE_STEPS, title: step.title, body: step.body },
      };
    default:
      return state;
  }
}

function applyAllStepsUpTo(state, maxSec) {
  let out = { ...state, elapsedSec: 0 };
  for (const step of DEMO_SCRIPT) {
    if (step.at <= maxSec) {
      out = applyStep({ ...out, elapsedSec: step.at }, step);
    }
  }
  return { ...out, elapsedSec: maxSec };
}

function demoReducer(state, action) {
  switch (action.type) {
    case "START": {
      let out = { ...demoInitialState, phase: "running", elapsedSec: 0 };
      // Apply any t=0 steps (narrative seeds, etc.)
      for (const step of DEMO_SCRIPT) {
        if (step.at === 0) out = applyStep(out, step);
      }
      return out;
    }
    case "TICK": {
      if (state.phase !== "running") return state;
      const next = state.elapsedSec + 1;
      let newState = { ...state, elapsedSec: next };
      for (const step of DEMO_SCRIPT) {
        if (step.at === next) newState = applyStep(newState, step);
      }
      return newState;
    }
    case "SKIP_TO_CLEAR":
      return applyAllStepsUpTo({ ...demoInitialState, phase: "running" }, 58);
    case "ALL_CLEAR": {
      const t = formatStreamTime(state.elapsedSec || 62);
      return {
        ...state,
        phase: "resolved",
        mobilePhase: "cleared",
        clearHint: false,
        eventLog: [{ id: `c${state.elapsedSec}`, t, type: "CLR", who: "All Clear", meta: "incident resolved · J. Morales" }, ...state.eventLog],
        narrative: {
          step: DEMO_TOTAL_NARRATIVE_STEPS,
          totalSteps: DEMO_TOTAL_NARRATIVE_STEPS,
          title: "Incident closed · full audit trail",
          body: "Who was alerted, who acknowledged, when, and how — exported as a compliance-ready PDF. HIPAA / SOC 2 / ADA ready.",
        },
      };
    }
    case "RESET":
      return demoInitialState;
    default:
      return state;
  }
}

const DemoContext = createContext(null);

function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(demoReducer, demoInitialState);

  useEffect(() => {
    if (state.phase !== "running") return;
    const i = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(i);
  }, [state.phase]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

function useDemo() {
  return useContext(DemoContext);
}

// ============================================================
// FACILITY MAP
// ============================================================
function FacilityMap() {
  return (
    <div className="relative h-full w-full bg-neutral-50 rounded overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" aria-hidden>
        <defs>
          <pattern id="grid-pro" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#eeeeee" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pro)" />
      </svg>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {FACILITY_ZONES.map((z) => {
          const isAlert = z.status === "alert";
          return (
            <rect
              key={z.id}
              x={z.x} y={z.y} width={z.w} height={z.h} rx="0.4"
              fill={isAlert ? "#fef3c7" : "#ffffff"}
              stroke={isAlert ? "#d97706" : "#e5e5e5"}
              strokeWidth="0.15"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      {FACILITY_ZONES.map((z) => {
        const isAlert = z.status === "alert";
        return (
          <div key={z.id} className="absolute pointer-events-none" style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}>
            <div className="p-3 h-full flex flex-col justify-between">
              <div>
                <Eyebrow className={isAlert ? "!text-amber-700" : ""}>{z.id.toUpperCase()}</Eyebrow>
                <div className={`text-sm mt-0.5 ${isAlert ? "text-amber-900" : "text-neutral-800"}`} style={{ ...SANS, fontWeight: isAlert ? 600 : 500 }}>
                  {z.name}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className={`text-[11px] ${isAlert ? "text-amber-700" : "text-neutral-500"}`} style={MONO}>{z.workers}</div>
                {isAlert && <span className="text-[9px] uppercase tracking-[0.15em] text-amber-700" style={{ ...MONO, fontWeight: 500 }}>active</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// MOBILE COMPANION PANEL — "what the worker sees"
// ============================================================
function PhoneFrame({ children }) {
  return (
    <div className="relative mx-auto" style={{ width: 244, height: 496 }}>
      <div className="absolute inset-0 rounded-[36px] bg-neutral-900 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.45)]" />
      <div className="absolute inset-[6px] rounded-[30px] bg-neutral-950 overflow-hidden">
        <div className="absolute left-1/2 top-1.5 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-10" />
        <div className="absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-5 text-[10px] text-white z-10" style={{ ...SANS, fontWeight: 600 }}>
          <span>14:32</span>
          <span className="flex items-center gap-1.5">
            <Wifi className="w-2.5 h-2.5" strokeWidth={2.5} />
            <Battery className="w-3 h-3" strokeWidth={2} />
          </span>
        </div>
        <div className="absolute inset-0 pt-7">{children}</div>
      </div>
    </div>
  );
}

function BandPulse() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-neutral-800 flex items-center justify-center">
        <Watch className="w-10 h-10 text-neutral-400" />
      </div>
      <span className="absolute inset-0 rounded-full border-2 border-amber-400 sw-pulse-ring" />
      <span className="absolute inset-0 rounded-full border-2 border-amber-400 sw-pulse-ring" style={{ animationDelay: "0.45s" }} />
      <span className="absolute inset-0 rounded-full border-2 border-amber-400 sw-pulse-ring" style={{ animationDelay: "0.9s" }} />
    </div>
  );
}

function MobileIdleScreen({ cleared }) {
  return (
    <div className="absolute inset-0 bg-[#061018] text-white flex flex-col">
      {cleared && (
        <div className="absolute top-10 left-3 right-3 z-20 p-2.5 rounded-md bg-emerald-600/20 border border-emerald-500/40 flex items-center gap-2 sw-fade-out">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
          <span className="text-[10px] text-emerald-100" style={SANS}>All Clear received</span>
        </div>
      )}

      <div className="px-5 pt-5 pb-1 text-center">
        <div className="text-[15px] text-white" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.015em" }}>Marcus Chen</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-[110px] h-[110px] rounded-full bg-gradient-to-br from-[#17abe2] via-[#0d87b6] to-[#0a5d85] flex items-center justify-center shadow-[0_0_48px_-6px_rgba(23,171,226,0.5)]">
          <Shield className="w-12 h-12 text-white" strokeWidth={2.4} />
        </div>
        <div className="mt-6 text-center">
          <div className="text-[14px] text-white" style={{ ...SANS, fontWeight: 600 }}>Safewave Band</div>
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-emerald-400" style={SANS}>Connected</span>
          </div>
        </div>
      </div>

      <div className="px-4 flex gap-2">
        <div className="flex-1 rounded-xl bg-white/[0.04] p-3">
          <div className="text-[9px] text-neutral-500 uppercase tracking-wider" style={{ ...SANS, fontWeight: 500 }}>Apps</div>
          <div className="text-[18px] text-white mt-0.5 tabular-nums leading-none" style={{ ...SANS, fontWeight: 600 }}>6</div>
        </div>
        <div className="flex-1 rounded-xl bg-white/[0.04] p-3">
          <div className="text-[9px] text-neutral-500 uppercase tracking-wider" style={{ ...SANS, fontWeight: 500 }}>Battery</div>
          <div className="text-[18px] text-white mt-0.5 tabular-nums leading-none" style={{ ...SANS, fontWeight: 600 }}>87%</div>
        </div>
      </div>

      <div className="px-4 pt-3">
        <button className="w-full h-10 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-[12px] flex items-center justify-center gap-2 transition" style={{ ...SANS, fontWeight: 500 }}>
          Test Vibration
        </button>
      </div>

      <div className="mt-4 pb-3 flex items-center justify-around px-3">
        {[
          { icon: Home,  label: "Home",    active: true  },
          { icon: Bell,  label: "Alerts",  active: false },
          { icon: Clock, label: "History", active: false },
          { icon: User,  label: "Account", active: false },
        ].map((t, i) => {
          const Icon = t.icon;
          return (
            <div key={i} className="flex flex-col items-center gap-1 py-1">
              <Icon className={`w-[18px] h-[18px] ${t.active ? "text-[#17abe2]" : "text-neutral-600"}`} strokeWidth={t.active ? 2.5 : 2} />
              <span className={`text-[8px] ${t.active ? "text-[#17abe2]" : "text-neutral-600"}`} style={{ ...SANS, fontWeight: t.active ? 600 : 500 }}>{t.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileVibratingScreen() {
  return (
    <div className="absolute inset-0 bg-[#061018] text-white flex flex-col items-center justify-center gap-6">
      <BandPulse />
      <div className="text-center">
        <div className="text-[15px] text-white" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.015em" }}>Band vibrating</div>
        <div className="text-[11px] text-neutral-500 mt-1" style={SANS}>Incoming alert</div>
      </div>
    </div>
  );
}

function MobileAlertScreen() {
  return (
    <div className="absolute inset-0 bg-[#061018] text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
        <div className="w-[88px] h-[88px] rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mb-6">
          <Flame className="w-11 h-11 text-rose-400" />
        </div>
        <div className="text-[10px] uppercase tracking-[0.24em] text-rose-400 mb-2" style={{ ...SANS, fontWeight: 600 }}>Critical alert</div>
        <div className="text-[24px] leading-tight" style={{ ...SANS, fontWeight: 700, letterSpacing: "-0.025em" }}>Fire Alarm</div>
        <div className="text-[13px] text-neutral-400 mt-1.5" style={SANS}>Radiology</div>
        <div className="mt-5 text-[12px] text-neutral-400 leading-relaxed max-w-[200px]" style={SANS}>
          Evacuate immediately via the nearest emergency exit.
        </div>
      </div>

      <div className="px-4 pb-5">
        <button className="h-11 w-full rounded-xl bg-[#17abe2] hover:bg-[#1396c7] text-white text-sm sw-alert-pulse transition" style={{ ...SANS, fontWeight: 600 }}>
          Acknowledge
        </button>
      </div>
    </div>
  );
}

function MobileAckConfirmScreen() {
  return (
    <div className="absolute inset-0 bg-[#061018] text-white flex flex-col items-center justify-center px-6 text-center gap-5">
      <div className="w-[88px] h-[88px] rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_32px_-4px_rgba(16,185,129,0.55)]">
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
      </div>
      <div>
        <div className="text-[18px] text-white" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.015em" }}>Acknowledged</div>
        <div className="text-[11px] text-emerald-400 mt-1" style={SANS}>in 2.4 seconds</div>
      </div>
      <div className="text-[11px] text-neutral-500 leading-relaxed max-w-[200px]" style={SANS}>
        Supervisor notified. Stay safe.
      </div>
    </div>
  );
}

function MobileCompanion() {
  const [open, setOpen] = useState(false);
  const { state } = useDemo();
  const phase = state.mobilePhase;

  return (
    <>
      {/* Toggle tab — always visible on right edge */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-1.5 h-24 px-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-l-md shadow-[0_8px_24px_-6px_rgba(0,0,0,0.4)] transition"
          style={{ ...MONO, writingMode: "vertical-rl" }}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase tracking-[0.24em]">Worker view</span>
          <ChevronLeft className="w-3 h-3" />
        </button>
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-40 w-[340px] bg-neutral-100 border-l border-neutral-200 flex flex-col shadow-[-12px_0_40px_-20px_rgba(0,0,0,0.2)] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-neutral-600" />
            <div>
              <div className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 600 }}>Worker · M. Chen</div>
              <div className="text-[10px] text-neutral-500" style={MONO}>Band A2-041 · paired</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="w-7 h-7 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-500">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-5 bg-gradient-to-b from-neutral-100 to-neutral-200 overflow-hidden">
          <PhoneFrame>
            {(phase === "idle" || phase === "cleared") && <MobileIdleScreen cleared={phase === "cleared"} />}
            {phase === "vibrating" && <MobileVibratingScreen />}
            {phase === "alert-shown" && <MobileAlertScreen />}
            {phase === "acked" && <MobileAckConfirmScreen />}
          </PhoneFrame>
        </div>

        <div className="p-3 border-t border-neutral-200 bg-white">
          <div className="text-[10px] text-neutral-500 leading-relaxed" style={SANS}>
            The SafeWave app synchronized with the worker's band haptic pulse. Runs side-by-side with the live dashboard during a demo.
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// DEMO CONTROL BAR — floating pitch controls
// ============================================================
function DemoControlBar() {
  const { state, dispatch } = useDemo();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-neutral-900/95 backdrop-blur border border-neutral-700 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)]">
      <span className="flex items-center gap-1.5 pl-2 pr-1 text-[10px] text-neutral-300 uppercase tracking-[0.2em]" style={MONO}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          state.phase === "running" ? "bg-amber-400 animate-pulse" :
          state.phase === "resolved" ? "bg-emerald-400" : "bg-neutral-500"
        }`} />
        Demo · {state.phase}
      </span>

      {state.phase === "idle" && (
        <button
          onClick={() => dispatch({ type: "START" })}
          className="h-7 px-3 rounded-full bg-[#17abe2] hover:bg-[#1396c7] text-white text-[11px] flex items-center gap-1.5 transition"
          style={{ ...SANS, fontWeight: 600 }}
        >
          <PlayCircle className="w-3.5 h-3.5" /> Start demo
        </button>
      )}

      {state.phase === "running" && (
        <>
          <span className="text-[11px] text-amber-300 min-w-[44px] text-center tabular-nums" style={MONO}>
            {formatElapsed(state.elapsedSec)}
          </span>
          <button
            onClick={() => dispatch({ type: "SKIP_TO_CLEAR" })}
            className="h-7 px-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] flex items-center gap-1 transition"
            style={{ ...SANS, fontWeight: 500 }}
          >
            <SkipForward className="w-3 h-3" /> Skip
          </button>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="h-7 px-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] flex items-center gap-1 transition"
            style={{ ...SANS, fontWeight: 500 }}
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </>
      )}

      {state.phase === "resolved" && (
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="h-7 px-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 text-[11px] flex items-center gap-1.5 transition"
          style={{ ...SANS, fontWeight: 600 }}
        >
          <RotateCcw className="w-3.5 h-3.5" /> Replay demo
        </button>
      )}
    </div>
  );
}

// ============================================================
// DEMO NARRATOR — step-by-step contextual callouts during the demo
// ============================================================
function DemoNarrator() {
  const { state } = useDemo();
  const [collapsed, setCollapsed] = useState(false);
  const currentStep = state.narrative?.step;

  // Re-expand automatically when a new step arrives
  useEffect(() => { setCollapsed(false); }, [currentStep]);

  if (!state.narrative) return null;
  const { step, totalSteps, title, body } = state.narrative;

  return (
    <div className="fixed bottom-[60px] left-4 z-30 w-[320px] max-w-[calc(100vw-380px)]">
      <div className="bg-white border border-neutral-200 rounded-lg shadow-[0_14px_36px_-12px_rgba(0,0,0,0.22)] overflow-hidden">
        <div className="h-0.5 bg-[#17abe2]" />
        <div className="px-3.5 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-full bg-[#17abe2]/15 flex items-center justify-center shrink-0">
                <span className="text-[10px] text-[#17abe2]" style={{ ...MONO, fontWeight: 700 }}>{step}</span>
              </div>
              <span className="text-[10px] text-[#17abe2] uppercase tracking-[0.18em] truncate" style={{ ...MONO, fontWeight: 600 }}>
                Live · step {step} of {totalSteps}
              </span>
            </div>
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="w-5 h-5 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 shrink-0"
              aria-label={collapsed ? "Expand narrator" : "Collapse narrator"}
            >
              <ChevronDown className={`w-3 h-3 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </button>
          </div>

          {!collapsed && (
            <>
              <div className="text-[12.5px] text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</div>
              <div className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed" style={SANS}>{body}</div>
              <div className="mt-2.5 flex gap-0.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <span
                    key={i}
                    className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${i < step ? "bg-[#17abe2]" : "bg-neutral-200"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ROLE-AWARE SIDEBAR
// ============================================================
function Sidebar({ role, active, setActive, currentOrg, setCurrentOrgId }) {
  const ORG_NAV = [
    { id: "ops",       label: "Operations",   icon: Activity, badge: "1" },
    { id: "dispatch",  label: "Dispatch Log", icon: Bell },
    { id: "sounds",    label: "Sound Events", icon: Volume2 },
    { id: "workforce", label: "Workforce",    icon: Users },
    { id: "devices",   label: "Devices",      icon: Watch },
    { id: "reports",   label: "Reports",      icon: FileText },
    { id: "settings",  label: "Settings",     icon: Settings },
  ];

  const SUPER_NAV_PLATFORM = [
    { id: "platform", label: "Platform",      icon: Globe,     badge: "3" },
    { id: "orgs",     label: "Organizations", icon: Building2 },
    { id: "fleet",    label: "Fleet Ops",     icon: Rocket },
    { id: "health",   label: "System Health", icon: Server,    badge: "!" },
    { id: "support",  label: "Support Queue", icon: LifeBuoy,  badge: "7" },
    { id: "revenue",  label: "Revenue",       icon: DollarSign },
  ];
  const SUPER_NAV_TENANT = [
    { id: "ops",       label: "Operations",   icon: Activity },
    { id: "dispatch",  label: "Dispatch Log", icon: Bell },
    { id: "workforce", label: "Workforce",    icon: Users },
    { id: "devices",   label: "Devices",      icon: Watch },
    { id: "settings",  label: "Settings",     icon: Settings },
  ];

  const orgLabel = role === "super" ? "Impersonating" : "Facility";

  return (
    <aside className="w-60 bg-white border-r border-neutral-200 flex flex-col shrink-0">
      <div className="p-5 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#17abe2] flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm text-neutral-900 leading-none" style={{ ...SANS, fontWeight: 700, letterSpacing: "-0.01em" }}>
              SafeWave
            </div>
            <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>
              v2.4 · {role === "super" ? "Platform" : "Operations"}
            </div>
          </div>
        </div>
      </div>

      {/* Role badge — the unmistakable indicator */}
      <div className="px-3 pt-3">
        {role === "super" ? (
          <div className="flex items-center gap-2 px-2.5 py-2 rounded bg-neutral-900 text-white">
            <UserCog className="w-3.5 h-3.5" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px]" style={{ ...SANS, fontWeight: 600 }}>Super Admin</div>
              <div className="text-[9px] text-neutral-400" style={MONO}>SafeWave internal</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2.5 py-2 rounded bg-sky-50 text-sky-900 border border-sky-200">
            <Building2 className="w-3.5 h-3.5" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px]" style={{ ...SANS, fontWeight: 600 }}>Org Admin</div>
              <div className="text-[9px] text-sky-700 truncate" style={MONO}>{currentOrg.shortName} · safety lead</div>
            </div>
          </div>
        )}
      </div>

      {/* Facility block */}
      <div className="p-3 border-b border-neutral-100">
        <Eyebrow className="mb-2 px-1">{orgLabel}</Eyebrow>
        <FacilitySwitcher role={role} currentOrg={currentOrg} setCurrentOrgId={setCurrentOrgId} />
      </div>

      {/* Nav */}
      <div className="p-2 flex-1 overflow-y-auto">
        {role === "super" ? (
          <>
            <Eyebrow className="px-3 py-2">Platform</Eyebrow>
            {SUPER_NAV_PLATFORM.map((n) => (
              <NavItem key={n.id} item={n} active={active} setActive={setActive} />
            ))}
            <Eyebrow className="px-3 py-2 mt-2">Tenant context</Eyebrow>
            {SUPER_NAV_TENANT.map((n) => (
              <NavItem key={n.id} item={n} active={active} setActive={setActive} />
            ))}
          </>
        ) : (
          ORG_NAV.map((n) => (
            <NavItem key={n.id} item={n} active={active} setActive={setActive} />
          ))
        )}
      </div>

      {/* System status (super only) */}
      {role === "super" && (
        <div className="p-3 border-t border-neutral-100">
          <Eyebrow className="mb-2.5 px-1">Platform health</Eyebrow>
          <div className="space-y-1 px-1">
            {SYSTEM_HEALTH.slice(0, 4).map((s) => (
              <div key={s.service} className="flex items-center justify-between text-[10px]" style={MONO}>
                <span className="text-neutral-500 truncate">{s.service}</span>
                <span className={`flex items-center gap-1 ${s.status === "nominal" ? "text-emerald-700" : s.status === "degraded" ? "text-rose-700" : "text-amber-700"}`}>
                  <span className={`w-1 h-1 rounded-full ${s.status === "nominal" ? "bg-emerald-500" : s.status === "degraded" ? "bg-rose-500" : "bg-amber-500"}`} />
                  {s.status === "nominal" ? "OK" : s.status === "degraded" ? "DEG" : "!"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

function FacilitySwitcher({ role, currentOrg, setCurrentOrgId }) {
  const [open, setOpen] = useState(false);
  const canSwitch = role === "super";

  return (
    <div className="relative">
      <button
        onClick={() => canSwitch && setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded border transition ${
          canSwitch
            ? "bg-neutral-50 hover:bg-neutral-100 border-neutral-200"
            : "bg-neutral-50 border-neutral-200 cursor-default"
        }`}
      >
        <div className="flex-1 text-left min-w-0">
          <div className="text-xs text-neutral-900 truncate" style={{ ...SANS, fontWeight: 600 }}>
            {currentOrg.name}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5" style={MONO}>
            {currentOrg.plan} · {currentOrg.users} workers
          </div>
        </div>
        {canSwitch && (
          <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      {open && canSwitch && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-md shadow-[0_14px_32px_-10px_rgba(0,0,0,0.22)] z-40 overflow-hidden">
            <div className="px-3 py-2 border-b border-neutral-100 flex items-center justify-between">
              <Eyebrow>Switch tenant</Eyebrow>
              <span className="text-[10px] text-neutral-500" style={MONO}>{ORGS.length} orgs</span>
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {ORGS.map((o) => {
                const isCurrent = o.id === currentOrg.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => { setCurrentOrgId(o.id); setOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition ${
                      isCurrent ? "bg-sky-50" : "hover:bg-neutral-50"
                    }`}
                  >
                    <HealthDot status={o.health} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-neutral-900 truncate" style={{ ...SANS, fontWeight: 600 }}>{o.name}</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5" style={MONO}>{o.plan} · {o.users} workers · {o.bands} bands</div>
                    </div>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-[#17abe2] shrink-0" strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NavItem({ item, active, setActive }) {
  const Icon = item.icon;
  const isActive = active === item.id;
  return (
    <button
      onClick={() => setActive(item.id)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition ${
        isActive ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
      }`}
      style={{ ...SANS, fontWeight: isActive ? 600 : 500 }}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge && (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded ${
            item.badge === "!" ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
          }`}
          style={{ ...MONO, fontWeight: 600 }}
        >
          {item.badge}
        </span>
      )}
    </button>
  );
}

// ============================================================
// TOPBAR — ROLE AWARE
// ============================================================
function TopBar({ role, screen, setRole, currentOrg }) {
  const [time, setTime] = useState("14:32:08");
  useEffect(() => {
    const i = setInterval(() => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(i);
  }, []);

  const tenantLabel = `Tenant · ${currentOrg.shortName}`;
  const CRUMBS_ORG = {
    ops: ["Operations", "Situation Room"],
    dispatch: ["Operations", "Dispatch Log"],
    sounds: ["Operations", "Sound Events"],
    workforce: ["Manage", "Workforce"],
    devices: ["Manage", "Devices"],
    reports: ["Manage", "Reports & Compliance"],
    settings: ["Manage", "Settings"],
  };
  const CRUMBS_SUPER = {
    platform: ["Platform", "Overview"],
    orgs: ["Platform", "Organizations"],
    fleet: ["Platform", "Fleet Operations"],
    health: ["Platform", "System Health"],
    support: ["Platform", "Support Queue"],
    revenue: ["Platform", "Revenue"],
    ops: [tenantLabel, "Operations"],
    dispatch: [tenantLabel, "Dispatch Log"],
    workforce: [tenantLabel, "Workforce"],
    devices: [tenantLabel, "Devices"],
    settings: [tenantLabel, "Settings"],
  };
  const crumbs = role === "super" ? CRUMBS_SUPER : CRUMBS_ORG;
  const [section, page] = crumbs[screen] || ["—", "—"];

  return (
    <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-500" style={SANS}>{section}</span>
          <ChevronRight className="w-3 h-3 text-neutral-300" />
          <span className="text-neutral-900" style={{ ...SANS, fontWeight: 600 }}>{page}</span>
        </div>
        <div className="h-6 w-px bg-neutral-200" />
        <div className="flex items-center gap-5 text-xs" style={MONO}>
          <span className="text-neutral-500">
            <span className="text-neutral-400">LOCAL </span>
            <span className="text-neutral-900" style={{ fontWeight: 500 }}>{time}</span>
          </span>
          {role === "super" ? (
            <>
              <span className="text-neutral-500">
                <span className="text-neutral-400">ORGS </span>
                <span className="text-neutral-900" style={{ fontWeight: 500 }}>14</span>
              </span>
              <span className="text-neutral-500">
                <span className="text-neutral-400">MRR </span>
                <span className="text-emerald-700" style={{ fontWeight: 500 }}>$94.2k</span>
              </span>
            </>
          ) : (
            <>
              <span className="text-neutral-500">
                <span className="text-neutral-400">WORKERS </span>
                <span className="text-neutral-900" style={{ fontWeight: 500 }}>{currentOrg.users}</span>
              </span>
              <span className="text-neutral-500">
                <span className="text-neutral-400">BANDS </span>
                <span className="text-emerald-700" style={{ fontWeight: 500 }}>{currentOrg.bands}</span>
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Demo role switcher */}
        <div className="flex items-center gap-1 bg-neutral-100 rounded p-0.5">
          <button
            onClick={() => setRole("super")}
            className={`h-6 px-2.5 rounded flex items-center gap-1 text-[11px] transition ${
              role === "super" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"
            }`}
            style={{ ...SANS, fontWeight: 500 }}
          >
            <UserCog className="w-3 h-3" />
            Super Admin
          </button>
          <button
            onClick={() => setRole("org")}
            className={`h-6 px-2.5 rounded flex items-center gap-1 text-[11px] transition ${
              role === "org" ? "bg-[#17abe2] text-white" : "text-neutral-500 hover:text-neutral-900"
            }`}
            style={{ ...SANS, fontWeight: 500 }}
          >
            <Building2 className="w-3 h-3" />
            Org Admin
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            placeholder={role === "super" ? "Search orgs, users, tickets…" : "Search workers, bands, events…"}
            className="pl-9 pr-4 h-8 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-900 placeholder-neutral-400 w-56 focus:border-neutral-400 focus:outline-none"
            style={SANS}
          />
        </div>
        <div className="h-6 w-px bg-neutral-200" />
        <div className="flex items-center gap-2.5">
          <div className="text-right leading-tight">
            <div className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 600 }}>
              {role === "super" ? "Bogdan Shoyat" : "Jessica Morales"}
            </div>
            <div className="text-[10px] text-neutral-500" style={MONO}>
              {role === "super" ? "SafeWave · Founder" : `${currentOrg.shortName} · Safety Lead`}
            </div>
          </div>
          <div
            className={`w-7 h-7 rounded flex items-center justify-center text-white text-xs ${
              role === "super" ? "bg-neutral-900" : "bg-[#17abe2]"
            }`}
            style={{ ...SANS, fontWeight: 700 }}
          >
            {role === "super" ? "B" : "JM"}
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================================
// SHARED: OPERATIONS (used by both roles, with role gate on tools)
// ============================================================
function OperationsScreen({ role, currentOrg = CURRENT_ORG }) {
  const { state: demo, dispatch } = useDemo();
  const [workerFilter, setWorkerFilter] = useState("all");

  const ackedSet = new Set(demo.ackedIds);
  const isActive = demo.phase === "running";
  const isResolved = demo.phase === "resolved";
  const isDemoRelated = isActive || isResolved;

  // Overlay worker status based on demo ackedIds when demo is running
  const liveWorkers = WORKERS.map((w) => {
    if (!isDemoRelated) return w;
    if (ackedSet.has(w.id)) return { ...w };
    return { ...w, status: "pending", t: "—", method: "—" };
  });

  const filtered = workerFilter === "all"
    ? liveWorkers
    : liveWorkers.filter((w) => (workerFilter === "pending" ? w.status === "pending" : w.status === "ack"));

  const recipients = DEMO_TOTAL_RECIPIENTS;
  const ackCount = isDemoRelated ? demo.ackCount : ACTIVE_INCIDENT.ack;
  const pending = Math.max(0, recipients - ackCount);
  const pct = Math.round((ackCount / recipients) * 100);

  // Event stream: merge demo entries with static history (demo entries appear on top)
  const mergedStream = isDemoRelated
    ? [...demo.eventLog, ...STREAM].slice(0, 12)
    : STREAM;

  return (
    <div className="p-6 space-y-5">
      {role === "super" && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-900 text-white rounded-md">
          <Eye className="w-4 h-4" />
          <span className="text-xs" style={SANS}>
            Viewing <span style={{ fontWeight: 600 }}>{currentOrg.name}</span> as Super Admin. Actions are logged to audit trail.
          </span>
          <button className="ml-auto text-[11px] text-neutral-300 hover:text-white" style={{ ...SANS, fontWeight: 500 }}>
            Exit tenant view →
          </button>
        </div>
      )}

      {/* Incident banner */}
      {isResolved ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md px-5 py-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-emerald-900" style={{ ...SANS, fontWeight: 600 }}>
              Incident resolved · INC-8821
            </div>
            <div className="text-xs text-emerald-700 mt-0.5" style={SANS}>
              {demo.ackCount} of {recipients} acknowledged · median 2.8s · closed by J. Morales
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="text-[11px] text-emerald-800 hover:text-emerald-900 underline"
            style={{ ...SANS, fontWeight: 500 }}
          >
            Dismiss
          </button>
        </div>
      ) : (
        <div className={`bg-white border rounded-md overflow-hidden transition-colors ${isActive ? "border-amber-200 shadow-[0_4px_20px_-6px_rgba(217,119,6,0.18)]" : "border-neutral-200"}`}>
          <div className={`h-0.5 ${isActive ? "bg-amber-500 sw-stripe-pulse" : "bg-neutral-200"}`} />
          <div className="p-5">
            <div className="flex items-start justify-between gap-8">
              <div className="flex items-start gap-4 min-w-0">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 border ${isActive ? "bg-amber-50 border-amber-200" : "bg-neutral-50 border-neutral-200"}`}>
                  <Flame className={`w-5 h-5 ${isActive ? "text-amber-700" : "text-neutral-400"}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-amber-500 animate-pulse" : "bg-neutral-300"}`} />
                    <Eyebrow>{isActive ? "Active Incident · INC-8821" : "Standby · no active incident"}</Eyebrow>
                    <InfoTooltip text={INFO.opsIncident} />
                  </div>
                  <div className="text-xl text-neutral-900 mt-1.5" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.015em" }}>
                    {isActive ? "Fire Alarm" : "All clear"}
                    <span className="text-neutral-400 mx-2 font-normal">·</span>
                    <span className="text-neutral-600 font-normal">{isActive ? "Radiology" : "Facility nominal"}</span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1.5" style={SANS}>
                    {isActive
                      ? `Elapsed ${formatElapsed(demo.elapsedSec)} · Source: sound cascade · 14 devices · 96% confidence`
                      : `Last incident resolved 14 min ago · ${DEMO_TARGET_ACKS}/${recipients} acknowledged · median 2.8s`}
                  </div>
                </div>
              </div>

              {isActive ? (
                <div className="flex items-stretch gap-6 shrink-0">
                  <div>
                    <Eyebrow>Acknowledged</Eyebrow>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-2xl text-neutral-900 tabular-nums" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>{ackCount}</span>
                      <span className="text-xs text-neutral-500" style={SANS}>/ {recipients}</span>
                      <span className="text-xs text-emerald-700 ml-1 tabular-nums" style={MONO}>{pct}%</span>
                    </div>
                    <div className="mt-2 h-1 w-32 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="w-px bg-neutral-200" />
                  <div>
                    <Eyebrow>Pending</Eyebrow>
                    <div className="text-2xl text-amber-700 mt-1.5 tabular-nums" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>{pending}</div>
                    <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>auto-escalate @ 60s</div>
                  </div>
                  <div className="w-px bg-neutral-200" />
                  <div>
                    <Eyebrow>Elapsed</Eyebrow>
                    <div className="text-2xl text-neutral-900 mt-1.5 tabular-nums" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>
                      {formatElapsed(demo.elapsedSec)}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>incident age</div>
                  </div>
                  <div className="w-px bg-neutral-200" />
                  <div className="flex items-end gap-2">
                    <Button
                      variant={demo.clearHint ? "amber" : "primary"}
                      onClick={() => dispatch({ type: "ALL_CLEAR" })}
                      className={demo.clearHint ? "sw-alert-pulse" : ""}
                    >
                      Send All Clear
                    </Button>
                    <Button variant="secondary">Escalate</Button>
                    <Button variant="secondary" className="!px-0 !w-9"><MoreHorizontal className="w-4 h-4" /></Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <Eyebrow>Last drill · 12 hr ago</Eyebrow>
                    <div className="text-sm text-neutral-900 mt-1" style={{ ...SANS, fontWeight: 600 }}>98% ack · 3.1s median</div>
                  </div>
                  <Button
                    variant="amber"
                    icon={PlayCircle}
                    onClick={() => dispatch({ type: "START" })}
                  >
                    Simulate incident
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Metrics */}
      <Card>
        <div className="grid grid-cols-6 divide-x divide-neutral-100">
          {METRICS_24H.map((m, i) => {
            const TrendIcon = m.trend === "up" ? TrendingUp : m.trend === "down" ? TrendingDown : null;
            const deltaColor = m.positive ? "text-emerald-700" : "text-amber-700";
            return (
              <div key={i} className="px-5 py-4">
                <Eyebrow>{m.label}</Eyebrow>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-xl text-neutral-900" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.015em" }}>{m.value}</span>
                  <span className={`text-[10px] flex items-center gap-0.5 ${deltaColor}`} style={MONO}>
                    {TrendIcon && <TrendIcon className="w-2.5 h-2.5" />}{m.delta}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8 space-y-5">
          <Card>
            <CardHeader eyebrow="Situational view" title={isActive ? "Facility — Radiology active" : "Facility — Main floor"} info={INFO.opsMap} />
            <div className="p-4"><div className="aspect-[16/9]"><FacilityMap /></div></div>
          </Card>

          <Card>
            <CardHeader
              eyebrow={isActive ? "Incident · Radiology" : "Radiology · Team snapshot"}
              title={isActive ? "Worker response" : "Workers on shift"}
              info={INFO.opsWorkers}
              right={
                <div className="flex items-center gap-1.5">
                  {[
                    { id: "all",     label: "All",     count: liveWorkers.length },
                    { id: "ack",     label: "Ack",     count: liveWorkers.filter((w) => w.status === "ack").length },
                    { id: "pending", label: "Pending", count: liveWorkers.filter((w) => w.status === "pending").length },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setWorkerFilter(f.id)}
                      className={`h-7 px-2.5 rounded text-[11px] border transition ${
                        workerFilter === f.id
                          ? "bg-neutral-900 border-neutral-900 text-white"
                          : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
                      }`}
                      style={{ ...SANS, fontWeight: 500 }}
                    >
                      {f.label}<span className="ml-1.5 text-neutral-400" style={MONO}>{f.count}</span>
                    </button>
                  ))}
                </div>
              }
            />
            <div>
              <div className="grid grid-cols-[1fr_100px_80px_60px_70px] gap-3 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/50 text-[10px] uppercase tracking-[0.12em] text-neutral-500" style={MONO}>
                <span>Worker</span><span>Group</span><span>Method</span><span className="text-right">Time</span><span className="text-right">Status</span>
              </div>
              {filtered.map((w) => {
                const justAcked = isDemoRelated && ackedSet.has(w.id);
                return (
                  <div
                    key={w.id}
                    className={`grid grid-cols-[1fr_100px_80px_60px_70px] gap-3 px-5 py-2.5 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition-colors duration-300 items-center ${justAcked ? "sw-row-flash" : ""}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] shrink-0 border transition-colors duration-300 ${
                        w.status === "ack" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800"
                      }`} style={{ ...SANS, fontWeight: 600 }}>
                        {w.name.split(" ").map((p) => p[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-neutral-900 truncate" style={{ ...SANS, fontWeight: 500 }}>{w.name}</div>
                        <div className="text-[10px] text-neutral-500 truncate" style={MONO}>{w.id}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-neutral-600 truncate" style={SANS}>{w.group}</div>
                    <div className="text-[11px] text-neutral-600" style={SANS}>{w.method === "—" ? <span className="text-neutral-300">—</span> : w.method}</div>
                    <div className="text-xs text-neutral-900 text-right" style={MONO}>{w.t === "—" ? <span className="text-neutral-300">—</span> : w.t}</div>
                    <div className="text-right"><StatusPill status={w.status} label={w.status === "ack" ? "ACK" : "WAIT"} /></div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="col-span-4 space-y-5">
          <Card>
            <CardHeader
              eyebrow="Live"
              title="Event stream"
              info={INFO.opsStream}
              infoAlign="right"
              right={
                <div className="flex items-center gap-1.5 text-[10px]" style={MONO}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`} />
                  <span className={isActive ? "text-emerald-700" : "text-neutral-500"}>{isActive ? "RECORDING" : "STANDBY"}</span>
                </div>
              }
            />
            <div className="max-h-[340px] overflow-y-auto">
              {mergedStream.map((e, i) => {
                const typeColor = { ACK: "text-emerald-700", DSP: "text-amber-700", SND: "text-sky-700", CLR: "text-emerald-700" };
                const isLive = isDemoRelated && i < demo.eventLog.length;
                const key = e.id || `s-${i}`;
                return (
                  <div
                    key={key}
                    className={`flex items-start gap-3 px-5 py-2 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition ${isLive ? "sw-row-flash" : ""}`}
                  >
                    <span className="text-[10px] text-neutral-400 pt-0.5 w-14 shrink-0" style={MONO}>{e.t}</span>
                    <span className={`text-[10px] pt-0.5 w-7 shrink-0 ${typeColor[e.type] || "text-neutral-400"}`} style={{ ...MONO, fontWeight: 500 }}>{e.type}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-neutral-800 truncate" style={{ ...SANS, fontWeight: 500 }}>{e.who}</div>
                      <div className="text-[11px] text-neutral-500 truncate" style={SANS}>{e.meta}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader eyebrow="Quick dispatch" title="New notification" info={INFO.opsDispatch} infoAlign="right" />
            <div className="p-5">
              <Eyebrow className="mb-2">Template</Eyebrow>
              <div className="grid grid-cols-5 gap-1.5 mb-4">
                {TEMPLATES.map((t, i) => {
                  const Icon = t.icon;
                  return (
                    <button key={t.id} className={`p-2 rounded border transition ${
                      i === 0 ? "bg-neutral-900 border-neutral-900 text-white" : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
                    }`} title={t.name}>
                      <Icon className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  );
                })}
              </div>
              <Eyebrow className="mb-2">Target</Eyebrow>
              <select className="w-full h-9 bg-white border border-neutral-200 rounded px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-none mb-4" style={SANS} defaultValue="zone-b">
                <option value="all">All facility · 421</option>
                <option value="zone-b">Radiology · 84</option>
                <option value="supervisors">Supervisors · 12</option>
              </select>
              <Button variant="amber" icon={Send} className="w-full">Dispatch · 84 workers</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SUPER ADMIN: PLATFORM OVERVIEW
// ============================================================
function PlatformOverviewScreen({ onEnterTenant }) {
  return (
    <div className="p-6">
      <PageHeader
        title="Platform Overview"
        info={INFO.platform}
        subtitle="SafeWave-wide operations across all client organizations"
        actions={
          <>
            <Button variant="secondary" icon={Calendar} size="md">Last 30 days</Button>
            <Button variant="primary" icon={Download} size="md">Platform report</Button>
          </>
        }
      />

      <Card className="mb-5">
        <div className="grid grid-cols-6 divide-x divide-neutral-100">
          {PLATFORM_METRICS.map((m, i) => {
            const TrendIcon = m.trend === "up" ? TrendingUp : m.trend === "down" ? TrendingDown : null;
            const deltaColor = m.positive ? "text-emerald-700" : "text-amber-700";
            return (
              <div key={i} className="px-5 py-4">
                <Eyebrow>{m.label}</Eyebrow>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-xl text-neutral-900" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.015em" }}>{m.value}</span>
                  <span className={`text-[10px] flex items-center gap-0.5 ${deltaColor}`} style={MONO}>
                    {TrendIcon && <TrendIcon className="w-2.5 h-2.5" />}{m.delta}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-8">
          <Card>
            <CardHeader
              eyebrow="Customer organizations"
              title="Active tenants"
              info={INFO.platformTenants}
              right={<Button variant="secondary" size="sm" icon={Plus}>New org</Button>}
            />
            <div>
              <div className="grid grid-cols-[1fr_100px_100px_100px_100px_90px] gap-3 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/50 text-[10px] uppercase tracking-[0.12em] text-neutral-500" style={MONO}>
                <span>Organization</span>
                <span>Workers</span>
                <span>Bands</span>
                <span>MRR</span>
                <span>Last incident</span>
                <span className="text-right">Health</span>
              </div>
              {ORGS.map((o, i) => (
                <button
                  key={i}
                  onClick={() => onEnterTenant && onEnterTenant(o.id)}
                  className="w-full text-left grid grid-cols-[1fr_100px_100px_100px_100px_90px] gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition items-center cursor-pointer"
                >
                  <div>
                    <div className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 600 }}>{o.name}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5" style={MONO}>{o.plan} · {o.contract}</div>
                  </div>
                  <span className="text-[11px] text-neutral-900" style={MONO}>{o.users}</span>
                  <span className="text-[11px] text-neutral-900" style={MONO}>{o.bands}</span>
                  <span className="text-[11px] text-neutral-900" style={{ ...MONO, fontWeight: 500 }}>${o.mrr.toLocaleString()}</span>
                  <span className="text-[11px] text-neutral-500" style={MONO}>{o.lastIncident}</span>
                  <div className="flex items-center justify-end gap-1.5">
                    <HealthDot status={o.health} />
                    <span className={`text-[10px] ${
                      o.health === "nominal" ? "text-emerald-700" : o.health === "degraded" ? "text-rose-700" : "text-amber-700"
                    }`} style={MONO}>
                      {o.health}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-4 space-y-5">
          <Card>
            <CardHeader eyebrow="Needs attention" title="Open alerts" info={INFO.platformAlerts} infoAlign="right" />
            <div>
              {[
                { org: "Target DC-42",  msg: "Active fire alarm incident",           ago: "now", sev: "high" },
                { org: "NYU Campus",    msg: "BLE Bridge p99 elevated (890ms)",      ago: "1h",  sev: "med"  },
                { org: "Target DC-42",  msg: "3 bands failing firmware update",      ago: "2h",  sev: "high" },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition">
                  <div className={`w-7 h-7 rounded shrink-0 flex items-center justify-center border ${
                    a.sev === "high" ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}>
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 600 }}>{a.org}</div>
                    <div className="text-[11px] text-neutral-600 mt-0.5 truncate" style={SANS}>{a.msg}</div>
                  </div>
                  <span className="text-[10px] text-neutral-400" style={MONO}>{a.ago}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader eyebrow="This week" title="Platform activity" info={INFO.platformActivity} infoAlign="right" />
            <div className="p-5 space-y-4">
              {[
                { l: "Dispatches sent",    v: "1,284" },
                { l: "Acknowledgments",    v: "1,241" },
                { l: "Sound events",       v: "328" },
                { l: "Bands registered",   v: "42" },
                { l: "New users",          v: "184" },
                { l: "Support tickets",    v: "7" },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-neutral-600" style={SANS}>{m.l}</span>
                  <span className="text-sm text-neutral-900" style={{ ...MONO, fontWeight: 500 }}>{m.v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SUPER ADMIN: ORGANIZATIONS
// ============================================================
function OrgsScreen({ onEnterTenant }) {
  return (
    <div className="p-6">
      <PageHeader
        title="Organizations"
        info={INFO.orgs}
        subtitle="All client organizations, their plans, health, and access"
        actions={
          <>
            <Button variant="secondary" icon={Download} size="md">Export</Button>
            <Button variant="primary" icon={Plus} size="md">Onboard org</Button>
          </>
        }
      />

      <Card>
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input placeholder="Search orgs…" className="pl-9 pr-3 h-8 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-900 w-64 focus:border-neutral-400 focus:outline-none" style={SANS} />
            </div>
            <Button variant="secondary" size="sm" icon={Filter}>All plans</Button>
            <Button variant="secondary" size="sm" icon={Filter}>All health</Button>
          </div>
          <span className="text-[10px] text-neutral-500" style={MONO}>Showing 6 of 14 orgs</span>
        </div>

        <div className="grid grid-cols-[1fr_100px_100px_100px_100px_100px_120px_120px] gap-3 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/50 text-[10px] uppercase tracking-[0.12em] text-neutral-500" style={MONO}>
          <span>Organization</span>
          <span>Plan</span>
          <span>Workers</span>
          <span>Bands</span>
          <span>MRR</span>
          <span>Health</span>
          <span>Contract</span>
          <span className="text-right">Actions</span>
        </div>
        {ORGS.map((o, i) => (
          <div key={i} className="grid grid-cols-[1fr_100px_100px_100px_100px_100px_120px_120px] gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition items-center">
            <div>
              <div className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 600 }}>{o.name}</div>
              <div className="text-[10px] text-neutral-500 mt-0.5" style={MONO}>Signed {o.signup}</div>
            </div>
            <span className="text-[11px] text-neutral-700" style={{ ...SANS, fontWeight: 500 }}>{o.plan}</span>
            <span className="text-[11px] text-neutral-900" style={MONO}>{o.users}</span>
            <span className="text-[11px] text-neutral-900" style={MONO}>{o.bands}</span>
            <span className="text-[11px] text-neutral-900" style={{ ...MONO, fontWeight: 500 }}>${o.mrr.toLocaleString()}</span>
            <div className="flex items-center gap-1.5">
              <HealthDot status={o.health} />
              <span className={`text-[10px] ${
                o.health === "nominal" ? "text-emerald-700" : o.health === "degraded" ? "text-rose-700" : "text-amber-700"
              }`} style={MONO}>
                {o.health}
              </span>
            </div>
            <span className="text-[11px] text-neutral-500" style={MONO}>{o.contract}</span>
            <div className="flex items-center justify-end gap-1">
              <button
                onClick={() => onEnterTenant && onEnterTenant(o.id)}
                className="h-7 px-2 rounded text-[11px] text-neutral-700 hover:bg-neutral-100 flex items-center gap-1 transition"
                style={{ ...SANS, fontWeight: 500 }}
              >
                <LogIn className="w-3 h-3" /> Enter
              </button>
              <button className="w-7 h-7 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ============================================================
// SUPER ADMIN: FLEET OPS
// ============================================================
function FleetScreen() {
  return (
    <div className="p-6">
      <PageHeader
        title="Fleet Operations"
        info={INFO.fleet}
        subtitle="Firmware rollouts, device inventory, and OTA pipeline across all organizations"
        actions={
          <>
            <Button variant="secondary" icon={GitBranch} size="md">Release notes</Button>
            <Button variant="primary" icon={Rocket} size="md">Push OTA v2.4.2</Button>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-5 mb-5">
        <Card className="p-5">
          <Eyebrow>Total fleet</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>2,847</div>
          <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>across 14 orgs</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>On v2.4.1 (latest)</Eyebrow>
          <div className="text-2xl text-emerald-700 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>2,619</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>92% rollout complete</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>On v2.3.8 (previous)</Eyebrow>
          <div className="text-2xl text-amber-700 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>213</div>
          <div className="text-[10px] text-amber-700 mt-1" style={MONO}>pending update</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Unassigned</Eyebrow>
          <div className="text-2xl text-sky-700 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>15</div>
          <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>in warehouse</div>
        </Card>
      </div>

      <Card>
        <CardHeader eyebrow="v2.4.1 adoption" title="Firmware rollout by org" info={INFO.fleetRollout} />
        <div>
          <div className="grid grid-cols-[1fr_80px_80px_80px_1fr_60px] gap-3 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/50 text-[10px] uppercase tracking-[0.12em] text-neutral-500" style={MONO}>
            <span>Organization</span>
            <span className="text-right">Total</span>
            <span className="text-right">Current</span>
            <span className="text-right">Previous</span>
            <span>Progress</span>
            <span className="text-right">%</span>
          </div>
          {FIRMWARE_ROLLOUT.map((f, i) => (
            <div key={i} className="grid grid-cols-[1fr_80px_80px_80px_1fr_60px] gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition items-center">
              <span className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 500 }}>{f.org}</span>
              <span className="text-[11px] text-neutral-700 text-right" style={MONO}>{f.total}</span>
              <span className="text-[11px] text-emerald-700 text-right" style={MONO}>{f.current}</span>
              <span className="text-[11px] text-amber-700 text-right" style={MONO}>{f.previous}</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${f.pct === 100 ? "bg-emerald-500" : f.pct >= 90 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${f.pct}%` }} />
                </div>
              </div>
              <span className="text-[11px] text-neutral-900 text-right" style={{ ...MONO, fontWeight: 500 }}>{f.pct}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// SUPER ADMIN: SYSTEM HEALTH
// ============================================================
function SystemHealthScreen() {
  return (
    <div className="p-6">
      <PageHeader
        title="System Health"
        info={INFO.health}
        subtitle="Platform infrastructure metrics — FCM, Firestore, BLE bridge, ML pipelines"
        actions={<Button variant="secondary" icon={Calendar} size="md">Last 24 hours</Button>}
      />

      <div className="grid grid-cols-4 gap-5 mb-5">
        <Card className="p-5">
          <Eyebrow>Overall uptime</Eyebrow>
          <div className="text-2xl text-emerald-700 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>99.97%</div>
          <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>30d rolling</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Services nominal</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>7 / 8</div>
          <div className="text-[10px] text-amber-700 mt-1" style={MONO}>1 degraded</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Errors · 24h</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>54</div>
          <div className="text-[10px] text-rose-700 mt-1" style={MONO}>47 from BLE Bridge</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Avg p99 latency</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>238ms</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>under 500ms SLA</div>
        </Card>
      </div>

      <Card>
        <CardHeader eyebrow="Infrastructure" title="Service status" info={INFO.healthServices} />
        <div>
          <div className="grid grid-cols-[1fr_120px_100px_100px_100px_80px] gap-3 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/50 text-[10px] uppercase tracking-[0.12em] text-neutral-500" style={MONO}>
            <span>Service</span>
            <span>Region</span>
            <span className="text-right">p99</span>
            <span className="text-right">Errors · 24h</span>
            <span className="text-right">Uptime</span>
            <span className="text-right">Status</span>
          </div>
          {SYSTEM_HEALTH.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_120px_100px_100px_100px_80px] gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition items-center">
              <div className="flex items-center gap-2.5">
                {s.service.includes("FCM") || s.service.includes("Cloud") ? <Zap className="w-3.5 h-3.5 text-neutral-400" /> :
                 s.service.includes("Firestore") ? <Database className="w-3.5 h-3.5 text-neutral-400" /> :
                 s.service.includes("BLE") ? <Radio className="w-3.5 h-3.5 text-neutral-400" /> :
                 s.service.includes("ML") ? <Cpu className="w-3.5 h-3.5 text-neutral-400" /> :
                 <Server className="w-3.5 h-3.5 text-neutral-400" />}
                <span className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 500 }}>{s.service}</span>
              </div>
              <span className="text-[11px] text-neutral-600" style={MONO}>{s.region}</span>
              <span className="text-[11px] text-neutral-900 text-right" style={MONO}>{s.p99}</span>
              <span className={`text-[11px] text-right ${s.errors > 10 ? "text-rose-700" : s.errors > 0 ? "text-amber-700" : "text-neutral-500"}`} style={MONO}>
                {s.errors}
              </span>
              <span className="text-[11px] text-neutral-900 text-right" style={{ ...MONO, fontWeight: 500 }}>{s.uptime}</span>
              <div className="flex justify-end">
                <StatusPill status={s.status} label={s.status.toUpperCase()} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// SUPER ADMIN: SUPPORT QUEUE
// ============================================================
function SupportScreen() {
  return (
    <div className="p-6">
      <PageHeader
        title="Support Queue"
        info={INFO.support}
        subtitle="Customer tickets across all SafeWave organizations"
        actions={
          <>
            <Button variant="secondary" icon={Filter} size="md">Assigned to me</Button>
            <Button variant="primary" icon={Plus} size="md">New ticket</Button>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-5 mb-5">
        <Card className="p-5">
          <Eyebrow>Open tickets</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>7</div>
          <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>across 5 orgs</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>High priority</Eyebrow>
          <div className="text-2xl text-rose-700 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>2</div>
          <div className="text-[10px] text-rose-700 mt-1" style={MONO}>SLA countdown active</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Avg response</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>38m</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>well under 2h SLA</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Resolved · 7d</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>23</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>94% CSAT</div>
        </Card>
      </div>

      <Card>
        <CardHeader eyebrow="All tickets" title="Active queue" info={INFO.supportQueue} />
        <div>
          <div className="grid grid-cols-[90px_140px_1fr_80px_80px_120px] gap-3 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/50 text-[10px] uppercase tracking-[0.12em] text-neutral-500" style={MONO}>
            <span>ID</span>
            <span>Organization</span>
            <span>Subject</span>
            <span>Priority</span>
            <span>Age</span>
            <span>Agent</span>
          </div>
          {SUPPORT_QUEUE.map((t, i) => (
            <div key={i} className="grid grid-cols-[90px_140px_1fr_80px_80px_120px] gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition items-center">
              <span className="text-[11px] text-neutral-700" style={MONO}>{t.id}</span>
              <span className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 500 }}>{t.org}</span>
              <span className="text-xs text-neutral-700 truncate" style={SANS}>{t.subject}</span>
              <StatusPill status={t.pri} label={t.pri.toUpperCase()} />
              <span className="text-[11px] text-neutral-500" style={MONO}>{t.age}</span>
              <span className="text-[11px] text-neutral-700" style={SANS}>
                {t.agent === "—" ? <span className="text-rose-700">Unassigned</span> : t.agent}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// SUPER ADMIN: REVENUE
// ============================================================
function RevenueScreen() {
  return (
    <div className="p-6">
      <PageHeader
        title="Revenue"
        info={INFO.revenue}
        subtitle="Platform MRR, ARR, and per-customer contribution"
        actions={<Button variant="primary" icon={Download} size="md">Export P&L</Button>}
      />

      <div className="grid grid-cols-4 gap-5 mb-5">
        <Card className="p-5">
          <Eyebrow>MRR</Eyebrow>
          <div className="text-3xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.025em" }}>$94,224</div>
          <div className="text-[10px] text-emerald-700 mt-1 flex items-center gap-0.5" style={MONO}>
            <TrendingUp className="w-2.5 h-2.5" /> +$8,400 vs last month
          </div>
        </Card>
        <Card className="p-5">
          <Eyebrow>ARR</Eyebrow>
          <div className="text-3xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.025em" }}>$1.13M</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>projected run rate</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>ARPA</Eyebrow>
          <div className="text-3xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.025em" }}>$6,730</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>avg revenue per org</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Churn · 90d</Eyebrow>
          <div className="text-3xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.025em" }}>0%</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>0 lost orgs</div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8">
          <Card>
            <CardHeader eyebrow="Per customer" title="Revenue contribution" info={INFO.revenueByCust} />
            <div>
              <div className="grid grid-cols-[1fr_100px_120px_120px_80px] gap-3 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/50 text-[10px] uppercase tracking-[0.12em] text-neutral-500" style={MONO}>
                <span>Organization</span>
                <span>Plan</span>
                <span className="text-right">MRR</span>
                <span>% of total</span>
                <span className="text-right">Signup</span>
              </div>
              {[...ORGS].sort((a, b) => b.mrr - a.mrr).map((o, i) => {
                const total = ORGS.reduce((s, x) => s + x.mrr, 0);
                const pct = Math.round((o.mrr / total) * 100);
                return (
                  <div key={i} className="grid grid-cols-[1fr_100px_120px_120px_80px] gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition items-center">
                    <span className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 500 }}>{o.name}</span>
                    <span className="text-[11px] text-neutral-600" style={SANS}>{o.plan}</span>
                    <span className="text-sm text-neutral-900 text-right" style={{ ...MONO, fontWeight: 600 }}>${o.mrr.toLocaleString()}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] text-neutral-700 w-8 text-right" style={MONO}>{pct}%</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 text-right" style={MONO}>{o.signup}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="col-span-4 space-y-5">
          <Card>
            <CardHeader eyebrow="Revenue by plan" title="Plan mix" info={INFO.revenuePlanMix} infoAlign="right" />
            <div className="p-5 space-y-4">
              {[
                { p: "Enterprise", orgs: 2, mrr: 30480, pct: 32 },
                { p: "Growth",     orgs: 3, mrr: 21670, pct: 23 },
                { p: "Starter",    orgs: 1, mrr:  3760, pct: 4  },
                { p: "Other",      orgs: 8, mrr: 38314, pct: 41 },
              ].map((p, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 500 }}>{p.p}</span>
                    <span className="text-xs text-neutral-700" style={{ ...MONO, fontWeight: 500 }}>${p.mrr.toLocaleString()}</span>
                  </div>
                  <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${p.pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-neutral-500" style={MONO}>{p.orgs} orgs</span>
                    <span className="text-[10px] text-neutral-500" style={MONO}>{p.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader eyebrow="Pipeline" title="In negotiation" info={INFO.revenuePipeline} infoAlign="right" />
            <div>
              {[
                { n: "FedEx SmartPost",       v: "$22k MRR", stage: "Contract" },
                { n: "Kroger DC Network",     v: "$18k MRR", stage: "Pilot"    },
                { n: "Home Depot — 3 sites",  v: "$34k MRR", stage: "Demo"     },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-neutral-50 last:border-b-0">
                  <div>
                    <div className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 500 }}>{d.n}</div>
                    <div className="text-[10px] text-neutral-500" style={MONO}>{d.stage}</div>
                  </div>
                  <span className="text-[11px] text-emerald-700" style={{ ...MONO, fontWeight: 500 }}>{d.v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ORG ADMIN: DISPATCH LOG (simplified version)
// ============================================================
function DispatchLogScreen() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const filtered = DISPATCH_HISTORY.filter((d) => selectedFilter === "all" || d.status === selectedFilter);

  return (
    <div className="p-6">
      <PageHeader
        title="Dispatch Log"
        info={INFO.dispatch}
        subtitle="Every alert, drill, and system notification at this facility"
        actions={
          <>
            <Button variant="secondary" icon={Filter} size="md">Filter</Button>
            <Button variant="secondary" icon={Download} size="md">Export CSV</Button>
            <Button variant="primary" icon={Plus} size="md">New dispatch</Button>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-5 mb-5">
        <Card className="p-5">
          <Eyebrow>Sent · 7 days</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>84</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>+12 vs prior week</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Ack rate · 7 days</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>96%</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>+2pt</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Critical dispatched</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>6</div>
          <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>2 drills, 4 real</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Failed delivery</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>0</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>0% of total</div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-neutral-100">
          {[
            { id: "all",     label: "All" },
            { id: "active",  label: "Active" },
            { id: "closed",  label: "Closed" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`h-7 px-3 rounded text-[11px] border transition ${
                selectedFilter === f.id
                  ? "bg-neutral-900 border-neutral-900 text-white"
                  : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
              }`}
              style={{ ...SANS, fontWeight: 500 }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[80px_1fr_180px_150px_120px_140px_100px_60px] gap-3 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/50 text-[10px] uppercase tracking-[0.12em] text-neutral-500" style={MONO}>
          <span>ID</span><span>Type</span><span>Zone / Target</span><span>Sent</span><span>By</span><span>Ack rate</span><span className="text-right">Recipients</span><span className="text-right">Status</span>
        </div>
        {filtered.map((d, i) => (
          <div key={i} className="grid grid-cols-[80px_1fr_180px_150px_120px_140px_100px_60px] gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition items-center">
            <span className="text-[11px] text-neutral-600" style={MONO}>{d.id}</span>
            <div className="flex items-center gap-2 min-w-0">
              <PriorityDot priority={d.priority} />
              <span className="text-xs text-neutral-900 truncate" style={{ ...SANS, fontWeight: 500 }}>{d.type}</span>
            </div>
            <span className="text-[11px] text-neutral-600 truncate" style={SANS}>{d.zone}</span>
            <span className="text-[11px] text-neutral-600" style={MONO}>{d.sentAt}</span>
            <span className="text-[11px] text-neutral-600 truncate" style={SANS}>{d.by}</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${d.pct >= 95 ? "bg-emerald-500" : d.pct >= 85 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${d.pct}%` }} />
              </div>
              <span className="text-[11px] text-neutral-900 w-8 text-right" style={{ ...MONO, fontWeight: 500 }}>{d.pct}%</span>
            </div>
            <span className="text-[11px] text-neutral-900 text-right" style={MONO}>
              {d.ack} <span className="text-neutral-400">/ {d.recipients}</span>
            </span>
            <div className="flex justify-end"><StatusPill status={d.status} label={d.status.toUpperCase()} /></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ============================================================
// ORG ADMIN: WORKFORCE
// ============================================================
function WorkforceScreen() {
  const [tab, setTab] = useState("workers");

  return (
    <div className="p-6">
      <PageHeader
        title="Workforce"
        info={INFO.workforce}
        subtitle="Workers, groups, and role permissions at this facility"
        actions={
          <>
            <Button variant="secondary" icon={Mail} size="md">Invite users</Button>
            <Button variant="primary" icon={Plus} size="md">
              {tab === "groups" ? "Add group" : tab === "roles" ? "Audit roles" : "Add worker"}
            </Button>
          </>
        }
      />

      <div className="flex items-center gap-1 mb-5 border-b border-neutral-200">
        {[
          { id: "workers", label: "Workers", count: ALL_WORKERS.length },
          { id: "groups",  label: "Groups",  count: 6 },
          { id: "roles",   label: "Roles",   count: 4 },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`h-9 px-4 text-xs transition border-b-2 -mb-px ${
              tab === t.id ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
            style={{ ...SANS, fontWeight: tab === t.id ? 600 : 500 }}
          >
            {t.label}<span className="ml-2 text-[10px] text-neutral-400" style={MONO}>{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "workers" && <WorkforceWorkers />}
      {tab === "groups"  && <WorkforceGroups />}
      {tab === "roles"   && <WorkforceRoles />}
    </div>
  );
}

function WorkforceWorkers() {
  return (
    <Card>
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input placeholder="Filter workers…" className="pl-9 pr-3 h-8 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-900 w-64 focus:border-neutral-400 focus:outline-none" style={SANS} />
          </div>
          <Button variant="secondary" size="sm" icon={Filter}>All roles</Button>
          <Button variant="secondary" size="sm" icon={Filter}>All groups</Button>
        </div>
        <span className="text-[10px] text-neutral-500" style={MONO}>
          {ALL_WORKERS.length} workers · {ALL_WORKERS.filter((w) => w.status === "online").length} online
        </span>
      </div>
      <div className="grid grid-cols-[1fr_180px_120px_110px_80px_100px] gap-3 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/50 text-[10px] uppercase tracking-[0.12em] text-neutral-500" style={MONO}>
        <span>Worker</span><span>Group</span><span>Role</span><span>Band</span><span>Status</span><span>Last seen</span>
      </div>
      {ALL_WORKERS.map((w, i) => (
        <div key={i} className="grid grid-cols-[1fr_180px_120px_110px_80px_100px] gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition items-center">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] shrink-0 border ${
              w.status === "online" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-neutral-100 border-neutral-200 text-neutral-600"
            }`} style={{ ...SANS, fontWeight: 600 }}>
              {w.name.split(" ").map((p) => p[0]).join("")}
            </div>
            <div className="min-w-0">
              <div className="text-xs text-neutral-900 truncate" style={{ ...SANS, fontWeight: 500 }}>{w.name}</div>
              <div className="text-[10px] text-neutral-500 truncate" style={MONO}>{w.email}</div>
            </div>
          </div>
          <span className="text-[11px] text-neutral-600 truncate" style={SANS}>{w.group}</span>
          <span className="text-[11px] text-neutral-600" style={SANS}>{w.role}</span>
          <span className="text-[11px] text-neutral-700" style={MONO}>
            {w.band === "—" ? <span className="text-neutral-300">Unassigned</span> : w.band}
          </span>
          <StatusPill status={w.status} label={w.status.toUpperCase()} />
          <span className="text-[11px] text-neutral-500" style={MONO}>{w.lastSeen}</span>
        </div>
      ))}
    </Card>
  );
}

function WorkforceGroups() {
  const groups = [
    { name: "Radiology · Day",             type: "zone",  count: 28, lastDrill: 98,  response: "2.1s", lead: "J. Morales" },
    { name: "Emergency · All shifts",      type: "zone",  count: 62, lastDrill: 96,  response: "3.4s", lead: "M. Ortega"  },
    { name: "Supervisors — Night",         type: "role",  count: 7,  lastDrill: 100, response: "1.4s", lead: "J. Morales" },
    { name: "New-Hire Cohort · Mar 2026",  type: "shift", count: 19, lastDrill: 92,  response: "5.2s", lead: "M. Ortega"  },
    { name: "Safety Leads",                type: "role",  count: 4,  lastDrill: 100, response: "1.1s", lead: "J. Morales" },
    { name: "ICU · Day Shift",             type: "shift", count: 34, lastDrill: 95,  response: "3.8s", lead: "T. Williams"},
  ];
  const typeColor = {
    zone:  "bg-sky-50 border-sky-200 text-sky-800",
    role:  "bg-neutral-100 border-neutral-200 text-neutral-700",
    shift: "bg-amber-50 border-amber-200 text-amber-800",
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {groups.map((g, i) => (
        <Card key={i} className="p-5 hover:border-neutral-300 transition cursor-pointer">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm text-neutral-900 truncate" style={{ ...SANS, fontWeight: 600 }}>{g.name}</div>
              <span className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded border mt-2 ${typeColor[g.type]}`} style={{ ...MONO, fontWeight: 500 }}>
                {g.type.toUpperCase()}
              </span>
            </div>
            <button className="w-7 h-7 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-400 shrink-0">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-2xl text-neutral-900 tabular-nums" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>{g.count}</span>
            <span className="text-[11px] text-neutral-500" style={SANS}>members</span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-500" style={SANS}>Last drill ack</span>
              <span className={`text-[11px] ${g.lastDrill >= 95 ? "text-emerald-700" : "text-amber-700"}`} style={{ ...MONO, fontWeight: 500 }}>{g.lastDrill}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-500" style={SANS}>Avg response</span>
              <span className="text-[11px] text-neutral-900" style={{ ...MONO, fontWeight: 500 }}>{g.response}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-500" style={SANS}>Lead</span>
              <span className="text-[11px] text-neutral-700" style={SANS}>{g.lead}</span>
            </div>
          </div>
        </Card>
      ))}
      <button className="border border-dashed border-neutral-300 rounded-md p-5 flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 transition min-h-[196px]">
        <Plus className="w-5 h-5" />
        <span className="text-xs" style={{ ...SANS, fontWeight: 500 }}>New group</span>
      </button>
    </div>
  );
}

function WorkforceRoles() {
  const capabilities = [
    "Dispatch critical alerts",
    "Dispatch standard alerts",
    "Manage users & groups",
    "Manage devices (band assignment)",
    "Export compliance reports",
    "Configure notification templates",
    "Acknowledge alerts",
    "Billing & integrations",
    "Multi-org access & impersonation",
    "Push firmware OTA across fleet",
    "View platform health & revenue",
  ];
  const matrix = [
    [true,  true,  true,  false],
    [true,  true,  true,  false],
    [true,  true,  false, false],
    [true,  true,  false, false],
    [true,  true,  false, false],
    [true,  true,  false, false],
    [true,  true,  true,  true],
    [true,  false, false, false],
    [true,  false, false, false],
    [true,  false, false, false],
    [true,  false, false, false],
  ];
  const roles = [
    { name: "Super Admin", sub: "SafeWave internal" },
    { name: "Org Admin",   sub: "Customer lead"      },
    { name: "Supervisor",  sub: "Facility manager"   },
    { name: "Worker",      sub: "Band holder"        },
  ];

  return (
    <Card>
      <CardHeader
        eyebrow="Role-based access"
        title="Permission matrix"
        info={INFO.rolesMatrix}
        right={<span className="text-[10px] text-neutral-500" style={MONO}>{capabilities.length} capabilities · {roles.length} roles</span>}
      />
      <div>
        <div className="grid grid-cols-[1fr_130px_130px_130px_130px] gap-3 px-5 py-3 border-b border-neutral-100 bg-neutral-50/50" style={MONO}>
          <span className="text-[10px] uppercase tracking-[0.12em] text-neutral-500 self-end">Capability</span>
          {roles.map((r) => (
            <div key={r.name} className="text-center">
              <div className="text-[11px] text-neutral-900" style={{ ...SANS, fontWeight: 600 }}>{r.name}</div>
              <div className="text-[10px] text-neutral-500 mt-0.5" style={MONO}>{r.sub}</div>
            </div>
          ))}
        </div>
        {capabilities.map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_130px_130px_130px_130px] gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition items-center">
            <span className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 500 }}>{c}</span>
            {matrix[i].map((v, j) => (
              <div key={j} className="flex justify-center">
                {v
                  ? <Check className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                  : <span className="text-neutral-300" style={MONO}>—</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================
// ORG ADMIN: DEVICES
// ============================================================
function deriveZone(group) {
  if (!group) return "—";
  const zone = group.split(" · ")[0];
  if (zone === "Radiology") return "Rad";
  if (zone === "Emergency") return "ER";
  if (zone === "ICU") return "ICU";
  if (zone === "Pediatrics") return "Peds";
  if (zone === "Surgery") return "Surg";
  if (zone === "Cardiology") return "Cardio";
  if (zone === "Safety Leads" || zone === "Supervisors") return "All";
  return zone.slice(0, 8);
}

function DevicesScreen() {
  const [devices, setDevices] = useState(DEVICES);
  const [assignModal, setAssignModal] = useState(null);

  const handleAssign = (deviceId, workerName) => {
    setDevices((prev) =>
      prev.map((d) => {
        // If this worker was already paired with another band, free that band
        if (workerName && d.id !== deviceId && d.assignedTo === workerName) {
          return { ...d, assignedTo: "—", zone: "—", status: "unassigned" };
        }
        if (d.id === deviceId) {
          const worker = ALL_WORKERS.find((w) => w.name === workerName);
          return {
            ...d,
            assignedTo: workerName,
            zone: deriveZone(worker?.group),
            status: worker?.status === "offline" ? "offline" : "online",
          };
        }
        return d;
      })
    );
    setAssignModal(null);
  };

  const handleUnassign = (deviceId) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId ? { ...d, assignedTo: "—", zone: "—", status: "unassigned" } : d
      )
    );
    setAssignModal(null);
  };

  const assignedCount = devices.filter((d) => d.assignedTo !== "—").length;
  const unassignedCount = devices.length - assignedCount;

  return (
    <div className="p-6">
      <PageHeader
        title="Devices"
        info={INFO.devices}
        subtitle="SafeWave bands assigned to this facility"
        actions={
          <>
            <Button variant="secondary" icon={Download} size="md">Export</Button>
            <Button variant="primary" icon={Plus} size="md">Register band</Button>
          </>
        }
      />

      <div className="grid grid-cols-5 gap-5 mb-5">
        <Card className="p-5">
          <Eyebrow>Total bands</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>386</div>
          <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>312 assigned</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Online</Eyebrow>
          <div className="text-2xl text-emerald-700 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>312</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>81% online rate</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Unassigned</Eyebrow>
          <div className="text-2xl text-sky-700 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>74</div>
          <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>ready to deploy</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Low battery</Eyebrow>
          <div className="text-2xl text-amber-700 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>7</div>
          <div className="text-[10px] text-amber-700 mt-1" style={MONO}>below 20%</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Firmware v2.4.1</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>92%</div>
          <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>28 on older v2.3.8</div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/50">
          <span className="text-[10px] uppercase tracking-[0.12em] text-neutral-500" style={MONO}>
            Band roster · this view
          </span>
          <span className="text-[10px] text-neutral-500" style={MONO}>
            {assignedCount} assigned · {unassignedCount} unassigned
          </span>
        </div>
        <div className="grid grid-cols-[90px_90px_100px_1fr_90px_80px_80px_90px] gap-3 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/50 text-[10px] uppercase tracking-[0.12em] text-neutral-500" style={MONO}>
          <span>Band ID</span><span>Status</span><span>Battery</span><span>Assigned to</span><span>Zone</span><span>Firmware</span><span>Last seen</span><span className="text-right">Action</span>
        </div>
        {devices.map((d, i) => (
          <div key={i} className="grid grid-cols-[90px_90px_100px_1fr_90px_80px_80px_90px] gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition items-center">
            <span className="text-[11px] text-neutral-900" style={{ ...MONO, fontWeight: 500 }}>{d.id}</span>
            <StatusPill status={d.status} label={d.status.toUpperCase()} />
            <div className="flex items-center gap-2">
              <div className="w-10 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${d.battery >= 50 ? "bg-emerald-500" : d.battery >= 20 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${d.battery}%` }} />
              </div>
              <span className={`text-[11px] ${d.battery < 20 ? "text-rose-700" : "text-neutral-700"}`} style={MONO}>{d.battery}%</span>
            </div>
            <span className="text-xs text-neutral-700 truncate" style={SANS}>
              {d.assignedTo === "—" ? <span className="text-neutral-400">Unassigned</span> : d.assignedTo}
            </span>
            <span className="text-[11px] text-neutral-600" style={SANS}>
              {d.zone === "—" ? <span className="text-neutral-300">—</span> : d.zone}
            </span>
            <span className={`text-[11px] ${d.firmware === "2.4.1" ? "text-neutral-600" : "text-amber-700"}`} style={MONO}>{d.firmware}</span>
            <span className="text-[11px] text-neutral-500" style={MONO}>{d.lastSeen}</span>
            <div className="flex justify-end">
              <button
                onClick={() => setAssignModal(d)}
                className={`h-7 px-2.5 rounded text-[11px] border transition ${
                  d.assignedTo === "—"
                    ? "bg-[#17abe2] hover:bg-[#1396c7] text-white border-[#17abe2]"
                    : "bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-300"
                }`}
                style={{ ...SANS, fontWeight: 500 }}
              >
                {d.assignedTo === "—" ? "Assign" : "Reassign"}
              </button>
            </div>
          </div>
        ))}
      </Card>

      {assignModal && (
        <AssignBandModal
          device={assignModal}
          onAssign={(workerName) => handleAssign(assignModal.id, workerName)}
          onUnassign={() => handleUnassign(assignModal.id)}
          onClose={() => setAssignModal(null)}
        />
      )}
    </div>
  );
}

function AssignBandModal({ device, onAssign, onUnassign, onClose }) {
  const [query, setQuery] = useState("");
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const filtered = ALL_WORKERS.filter((w) => {
    if (!q) return true;
    return (
      w.name.toLowerCase().includes(q) ||
      w.id.toLowerCase().includes(q) ||
      w.email.toLowerCase().includes(q) ||
      w.group.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-[0_24px_60px_-12px_rgba(0,0,0,0.3)] border border-neutral-200 w-[560px] max-h-[80vh] flex flex-col">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-500" style={MONO}>Assign band</div>
            <div className="text-sm text-neutral-900 mt-1 flex items-center gap-2" style={{ ...SANS, fontWeight: 600 }}>
              <span style={MONO}>{device.id}</span>
              <span className="text-neutral-300">·</span>
              <span className="text-xs text-neutral-500" style={{ ...SANS, fontWeight: 400 }}>
                {device.assignedTo === "—" ? "Currently unassigned" : `Currently paired with ${device.assignedTo}`}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-neutral-100">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              autoFocus
              placeholder="Search by name, ID, email, or group…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 h-9 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-900 focus:border-neutral-400 focus:outline-none"
              style={SANS}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center text-[11px] text-neutral-500" style={SANS}>
              No workers match "{query}"
            </div>
          ) : (
            filtered.map((w) => {
              const isCurrent = device.assignedTo === w.name;
              const hasOtherBand = !isCurrent && w.band !== "—" && w.band !== device.id;
              return (
                <button
                  key={w.id}
                  onClick={() => !isCurrent && onAssign(w.name)}
                  disabled={isCurrent}
                  className={`w-full flex items-center gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 transition text-left ${
                    isCurrent ? "bg-[#17abe2]/5 cursor-default" : "hover:bg-neutral-50 cursor-pointer"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] shrink-0 border ${
                    w.status === "online" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-neutral-100 border-neutral-200 text-neutral-600"
                  }`} style={{ ...SANS, fontWeight: 600 }}>
                    {w.name.split(" ").map((p) => p[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-neutral-900 truncate" style={{ ...SANS, fontWeight: 500 }}>{w.name}</div>
                    <div className="text-[10px] text-neutral-500 truncate" style={MONO}>{w.id} · {w.group}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#17abe2]" style={{ ...MONO, fontWeight: 500 }}>
                        <Check className="w-3 h-3" /> CURRENT
                      </span>
                    ) : hasOtherBand ? (
                      <div className="text-[10px] text-amber-700" style={MONO}>paired · {w.band}</div>
                    ) : w.band === "—" ? (
                      <div className="text-[10px] text-neutral-400" style={MONO}>no band</div>
                    ) : null}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50 rounded-b-lg">
          {device.assignedTo !== "—" ? (
            <button
              onClick={onUnassign}
              className="h-7 px-2.5 rounded text-[11px] border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 transition"
              style={{ ...SANS, fontWeight: 500 }}
            >
              Unassign band
            </button>
          ) : (
            <span className="text-[10px] text-neutral-400" style={MONO}>
              Selecting a worker will pair them immediately
            </span>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ORG ADMIN: REPORTS
// ============================================================
function ReportsScreen() {
  return (
    <div className="p-6">
      <PageHeader
        title="Reports & Compliance"
        info={INFO.reports}
        subtitle="Audit trails, drill reports, and compliance posture for this facility"
        actions={<Button variant="primary" icon={Download} size="md">Export audit pack</Button>}
      />

      <div className="grid grid-cols-4 gap-5 mb-5">
        <Card className="p-5">
          <Eyebrow>30d drills</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>12</div>
          <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>across 7 groups</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Avg ack rate</Eyebrow>
          <div className="text-2xl text-emerald-700 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>95%</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>+3pt vs Q3</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Avg response</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>4.4s</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>well below 30s SLA</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Audit entries</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>2,841</div>
          <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>immutable log</div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8">
          <Card>
            <CardHeader eyebrow="History" title="Drill & incident reports" info={INFO.reportsDrills} />
            <div className="grid grid-cols-[1fr_100px_120px_80px_100px_80px] gap-3 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/50 text-[10px] uppercase tracking-[0.12em] text-neutral-500" style={MONO}>
              <span>Event</span><span>Type</span><span>Ack rate</span><span>Response</span><span className="text-right">Recipients</span><span className="text-right">Report</span>
            </div>
            {DRILL_REPORTS.map((r, i) => (
              <div key={i} className="grid grid-cols-[1fr_100px_120px_80px_100px_80px] gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition items-center">
                <div>
                  <div className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 500 }}>{r.label}</div>
                  <div className="text-[10px] text-neutral-500" style={MONO}>{r.date}</div>
                </div>
                <span className="text-[11px] text-neutral-600" style={SANS}>{r.type}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${r.rate >= 95 ? "bg-emerald-500" : r.rate >= 85 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${r.rate}%` }} />
                  </div>
                  <span className="text-[11px] text-neutral-900" style={{ ...MONO, fontWeight: 500 }}>{r.rate}%</span>
                </div>
                <span className="text-[11px] text-neutral-700" style={MONO}>{r.avg}s</span>
                <span className="text-[11px] text-neutral-700 text-right" style={MONO}>{r.count}</span>
                <button className="text-[11px] text-neutral-900 hover:underline text-right" style={{ ...SANS, fontWeight: 500 }}>PDF →</button>
              </div>
            ))}
          </Card>
        </div>
        <div className="col-span-4">
          <Card>
            <CardHeader eyebrow="Compliance" title="Audit posture" info={INFO.reportsPosture} infoAlign="right" />
            {[
              { label: "HIPAA",             status: "In review",       color: "text-amber-700",  dot: "bg-amber-500"   },
              { label: "SOC 2 Type II",     status: "Observation Q2",  color: "text-neutral-700", dot: "bg-neutral-400" },
              { label: "ADA · WCAG 2.1 AA", status: "Compliant",       color: "text-emerald-700", dot: "bg-emerald-500" },
              { label: "GDPR · CCPA",       status: "Compliant",       color: "text-emerald-700", dot: "bg-emerald-500" },
              { label: "ISO 27001",         status: "Not started",     color: "text-neutral-400", dot: "bg-neutral-300" },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                  <span className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 500 }}>{c.label}</span>
                </div>
                <span className={`text-[11px] ${c.color}`} style={MONO}>{c.status}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ORG ADMIN: SOUND EVENTS (reused)
// ============================================================
function SoundEventsScreen() {
  const SOUND_EVENTS = [
    { id: "SND-204", type: "Fire Alarm",         conf: 96, devices: 14, zone: "Radiology",      time: "14:32:06", cascaded: true  },
    { id: "SND-203", type: "Smoke Detector",     conf: 88, devices: 3,  zone: "Break Room",     time: "14:31:22", cascaded: false },
    { id: "SND-202", type: "Ventilator Alarm",   conf: 92, devices: 1,  zone: "ICU",            time: "13:22:41", cascaded: false },
    { id: "SND-201", type: "Fire Alarm (drill)", conf: 99, devices: 312,zone: "Facility-wide",  time: "10:00:03", cascaded: true  },
    { id: "SND-200", type: "Smoke Detector",     conf: 81, devices: 2,  zone: "Nurses' Station",time: "09:44:17", cascaded: false },
    { id: "SND-198", type: "Custom: IV pump",    conf: 94, devices: 2,  zone: "Surgery",        time: "Oct 21",   cascaded: false },
  ];
  return (
    <div className="p-6">
      <PageHeader
        title="Sound Events"
        info={INFO.sounds}
        subtitle="On-device ML detection log. Audio never leaves the worker's phone."
        actions={<Button variant="secondary" icon={Download} size="md">Export</Button>}
      />
      <div className="grid grid-cols-4 gap-5 mb-5">
        <Card className="p-5">
          <Eyebrow>Events · 24h</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>47</div>
          <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>4 cascaded</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Avg confidence</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>94%</div>
          <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>6 models active</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Custom profiles</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>3</div>
          <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>Hospital-specific</div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Dismissed · 24h</Eyebrow>
          <div className="text-2xl text-neutral-900 mt-2" style={{ ...SANS, fontWeight: 600, letterSpacing: "-0.02em" }}>1</div>
          <div className="text-[10px] text-neutral-500 mt-1" style={MONO}>2% of total</div>
        </Card>
      </div>
      <Card>
        <CardHeader eyebrow="All events" title="Detection log" info={INFO.soundLog} />
        {SOUND_EVENTS.map((s) => (
          <div key={s.id} className="px-5 py-4 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                <Volume2 className="w-5 h-5 text-sky-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-500" style={MONO}>{s.id}</span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-[10px] text-neutral-500" style={MONO}>{s.time}</span>
                </div>
                <div className="text-sm text-neutral-900 mt-0.5" style={{ ...SANS, fontWeight: 600 }}>{s.type}</div>
                <div className="text-xs text-neutral-500 mt-0.5" style={SANS}>{s.zone} · {s.devices} {s.devices === 1 ? "device" : "devices"} detected</div>
              </div>
              <div className="flex items-center gap-5 shrink-0">
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <Eyebrow>Confidence</Eyebrow>
                    <span className="text-[11px] text-neutral-900" style={{ ...MONO, fontWeight: 500 }}>{s.conf}%</span>
                  </div>
                  <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: `${s.conf}%` }} />
                  </div>
                </div>
                <StatusPill status={s.cascaded ? "alert" : "closed"} label={s.cascaded ? "CASCADED" : "LOGGED"} />
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ============================================================
// ORG ADMIN: SETTINGS
// ============================================================
function SettingsScreen({ currentOrg = CURRENT_ORG }) {
  const [section, setSection] = useState("org");
  const SECTIONS = [
    { id: "org",          label: "Organization",           icon: Building2 },
    { id: "templates",    label: "Notification templates", icon: Bell      },
    { id: "escalation",   label: "Escalation rules",       icon: AlertTriangle },
    { id: "billing",      label: "Billing",                icon: CreditCard },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Settings" info={INFO.settings} subtitle="Organization configuration, templates, escalation, integrations, and billing" />
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-3">
          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-100">
              <Eyebrow className="mb-1">{currentOrg.name}</Eyebrow>
              <div className="text-xs text-neutral-900 mt-0.5" style={{ ...SANS, fontWeight: 600 }}>
                {currentOrg.plan} · {currentOrg.contract}
              </div>
            </div>
            <div className="p-1.5">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                const isActive = section === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSection(s.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs transition ${
                      isActive ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    }`}
                    style={{ ...SANS, fontWeight: isActive ? 600 : 500 }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="flex-1 text-left">{s.label}</span>
                    {isActive && <ChevronRight className="w-3 h-3 text-neutral-400" />}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="col-span-9">
          {section === "org"        && <SettingsOrg currentOrg={currentOrg} />}
          {section === "templates"  && <SettingsTemplates />}
          {section === "escalation" && <SettingsEscalation />}
          {section === "billing"    && <SettingsBilling />}
        </div>
      </div>
    </div>
  );
}

function SettingsOrg({ currentOrg = CURRENT_ORG }) {
  const fields = [
    { label: "Facility name",    value: currentOrg.name },
    { label: "Client",           value: currentOrg.client },
    { label: "Facility type",    value: currentOrg.type },
    { label: "Timezone",         value: "America/New_York (EST)" },
    { label: "Address",          value: currentOrg.addr },
    { label: "Primary contact",  value: currentOrg.contact },
  ];
  return (
    <Card>
      <CardHeader
        eyebrow="Organization"
        title="Facility details"
        info={INFO.settingsOrg}
        right={<span className="text-[10px] text-emerald-700" style={MONO}>Autosaved · 2m ago</span>}
      />
      <div className="p-6 grid grid-cols-2 gap-5">
        {fields.map((f, i) => (
          <div key={i}>
            <Eyebrow className="mb-1.5">{f.label}</Eyebrow>
            <input
              defaultValue={f.value}
              className="w-full h-9 bg-white border border-neutral-200 rounded px-3 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-none"
              style={SANS}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

function SettingsTemplates() {
  const data = [
    { name: "Fire Alarm",         priority: "critical", pattern: "3× strong · short-short-long",   msg: "Fire alarm activated in {{zone}}. Evacuate via nearest exit.", icon: Flame          },
    { name: "Evacuation",         priority: "critical", pattern: "Continuous",                      msg: "Full facility evacuation. Exit immediately to rally point.",   icon: AlertTriangle  },
    { name: "Shelter",            priority: "critical", pattern: "2× long · long-long",             msg: "Shelter in place. Remain indoors until all-clear.",            icon: Shield         },
    { name: "All Clear",          priority: "standard", pattern: "1× soft",                         msg: "All clear — resume normal operations.",                        icon: CheckCircle2   },
    { name: "Shift Change",       priority: "info",     pattern: "1× pulse",                        msg: "Shift change — {{incoming}} starts, {{outgoing}} clocks out.", icon: Radio          },
    { name: "Custom · Belt stop", priority: "standard", pattern: "2× short",                        msg: "Belt stopped at {{line}}. Maintenance please respond.",        icon: Volume2        },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base text-neutral-900" style={{ ...SANS, fontWeight: 600 }}>Notification templates</h2>
          <p className="text-xs text-neutral-500 mt-0.5" style={SANS}>
            Pre-built and custom alert templates used across Operations and Dispatch.
          </p>
        </div>
        <Button variant="primary" icon={Plus} size="md">New template</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {data.map((t, i) => {
          const Icon = t.icon;
          const priStyle =
            t.priority === "critical" ? "bg-amber-50 border-amber-200 text-amber-800" :
            t.priority === "info"     ? "bg-sky-50 border-sky-200 text-sky-800" :
                                        "bg-neutral-50 border-neutral-200 text-neutral-700";
          return (
            <Card key={i} className="p-5 hover:border-neutral-300 transition cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-md bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-neutral-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-neutral-900" style={{ ...SANS, fontWeight: 600 }}>{t.name}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded border ${priStyle}`} style={{ ...MONO, fontWeight: 500 }}>
                        {t.priority.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-neutral-500" style={MONO}>{t.pattern}</span>
                    </div>
                  </div>
                </div>
                <button className="w-7 h-7 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-400 shrink-0">
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-neutral-600 mt-3 leading-relaxed" style={SANS}>{t.msg}</p>
            </Card>
          );
        })}
        <button className="border border-dashed border-neutral-300 rounded-md p-5 flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 transition min-h-[148px]">
          <Plus className="w-4 h-4" />
          <span className="text-xs" style={{ ...SANS, fontWeight: 500 }}>New custom template</span>
        </button>
      </div>
    </div>
  );
}

function SettingsEscalation() {
  const chain = [
    { step: "Resend alert",          delay: "10s",  target: "Original recipients",     icon: Bell     },
    { step: "Notify supervisors",    delay: "30s",  target: "4 supervisors on shift",  icon: UserCog  },
    { step: "Create incident draft", delay: "45s",  target: "Dispatch log",            icon: FileText },
    { step: "Email org admin",       delay: "60s",  target: "j.morales@amazon.com",    icon: Mail     },
    { step: "Page on-call SafeWave", delay: "120s", target: "SafeWave ops",            icon: Radio    },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base text-neutral-900" style={{ ...SANS, fontWeight: 600 }}>Escalation rules</h2>
        <p className="text-xs text-neutral-500 mt-0.5" style={SANS}>
          If an alert remains unacknowledged, SafeWave escalates in this order.
        </p>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-3 gap-5 mb-5">
          <div>
            <Eyebrow className="mb-1.5">Initial timeout</Eyebrow>
            <input defaultValue="10 seconds" className="w-full h-9 bg-white border border-neutral-200 rounded px-3 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-none" style={SANS} />
          </div>
          <div>
            <Eyebrow className="mb-1.5">Backoff between steps</Eyebrow>
            <input defaultValue="15 seconds" className="w-full h-9 bg-white border border-neutral-200 rounded px-3 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-none" style={SANS} />
          </div>
          <div>
            <Eyebrow className="mb-1.5">Stop if ack rate ≥</Eyebrow>
            <input defaultValue="90%" className="w-full h-9 bg-white border border-neutral-200 rounded px-3 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-none" style={SANS} />
          </div>
        </div>

        <Eyebrow className="mb-3">Chain</Eyebrow>
        <div className="space-y-2">
          {chain.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-md">
                <GripVertical className="w-4 h-4 text-neutral-400 cursor-move" />
                <span className="text-[10px] text-neutral-500 w-5" style={MONO}>{i + 1}.</span>
                <div className="w-7 h-7 rounded bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-neutral-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 600 }}>{c.step}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5 truncate" style={SANS}>{c.target}</div>
                </div>
                <div className="text-right shrink-0">
                  <Eyebrow>After</Eyebrow>
                  <div className="text-xs text-neutral-900 mt-0.5" style={{ ...MONO, fontWeight: 500 }}>{c.delay}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function SettingsBilling() {
  const invoices = [
    { month: "October 2026",   amount: "$12,420.00", status: "Upcoming" },
    { month: "September 2026", amount: "$12,420.00", status: "Paid"     },
    { month: "August 2026",    amount: "$12,420.00", status: "Paid"     },
    { month: "July 2026",      amount: "$12,420.00", status: "Paid"     },
    { month: "June 2026",      amount: "$12,420.00", status: "Paid"     },
    { month: "May 2026",       amount: "$12,420.00", status: "Paid"     },
  ];
  const usage = [
    { label: "Workers",    used: 421,  max: 500,   unit: "" },
    { label: "Bands",      used: 386,  max: 500,   unit: "" },
    { label: "Dispatches", used: 1247, max: null,  unit: "/ unlimited" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base text-neutral-900" style={{ ...SANS, fontWeight: 600 }}>Billing</h2>
        <p className="text-xs text-neutral-500 mt-0.5" style={SANS}>
          Read-only view · contact SafeWave to change plan terms.
        </p>
      </div>

      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <Eyebrow>Current plan</Eyebrow>
            <div className="text-xl text-neutral-900 mt-1" style={{ ...SANS, fontWeight: 600 }}>Enterprise · 3-year contract</div>
            <div className="text-xs text-neutral-500 mt-1" style={SANS}>Signed Mar 2026 · renews Mar 2029</div>
          </div>
          <div className="text-right">
            <Eyebrow>MRR</Eyebrow>
            <div className="text-xl text-neutral-900 mt-1 tabular-nums" style={{ ...SANS, fontWeight: 600 }}>$12,420</div>
            <div className="text-[10px] text-emerald-700 mt-1" style={MONO}>locked rate</div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <Eyebrow className="mb-4">Usage · October</Eyebrow>
        <div className="grid grid-cols-3 gap-5">
          {usage.map((u, i) => {
            const pct = u.max ? Math.round((u.used / u.max) * 100) : 0;
            return (
              <div key={i}>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-neutral-600" style={SANS}>{u.label}</span>
                  <span className="text-xs text-neutral-900 tabular-nums" style={{ ...MONO, fontWeight: 600 }}>
                    {u.used.toLocaleString()} {u.max ? <span className="text-neutral-400">/ {u.max}</span> : <span className="text-neutral-400">{u.unit}</span>}
                  </span>
                </div>
                {u.max && (
                  <div className="mt-2 h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHeader
          eyebrow="Invoices"
          title="Billing history"
          right={<Button variant="secondary" size="sm" icon={Download}>Download all</Button>}
        />
        <div>
          <div className="grid grid-cols-[1fr_140px_100px_80px] gap-3 px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/50 text-[10px] uppercase tracking-[0.12em] text-neutral-500" style={MONO}>
            <span>Period</span>
            <span className="text-right">Amount</span>
            <span>Status</span>
            <span className="text-right">PDF</span>
          </div>
          {invoices.map((inv, i) => (
            <div key={i} className="grid grid-cols-[1fr_140px_100px_80px] gap-3 px-5 py-3 border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/60 transition items-center">
              <div>
                <div className="text-xs text-neutral-900" style={{ ...SANS, fontWeight: 500 }}>{inv.month}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5" style={MONO}>Invoice SW-{String(20240001 + i)}</div>
              </div>
              <span className="text-xs text-neutral-900 text-right tabular-nums" style={{ ...MONO, fontWeight: 500 }}>{inv.amount}</span>
              <span className={`text-[11px] ${inv.status === "Paid" ? "text-emerald-700" : "text-amber-700"}`} style={MONO}>{inv.status}</span>
              <div className="flex justify-end">
                <button className="text-[11px] text-neutral-700 hover:text-neutral-900 flex items-center gap-1" style={{ ...SANS, fontWeight: 500 }}>
                  <Download className="w-3 h-3" /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// ROOT
// ============================================================
export default function SafewaveDashboard() {
  const [role, setRole] = useState("org"); // "org" or "super"
  const [active, setActive] = useState("ops");
  const [currentOrgId, setCurrentOrgId] = useState("mih1");
  const currentOrg = ORGS.find((o) => o.id === currentOrgId) || ORGS[0];

  // Reset active screen when role changes to a valid default
  useEffect(() => {
    if (role === "super") setActive("platform");
    else setActive("ops");
  }, [role]);

  const orgScreens = {
    ops:       <OperationsScreen role="org"  currentOrg={currentOrg} />,
    dispatch:  <DispatchLogScreen />,
    sounds:    <SoundEventsScreen />,
    workforce: <WorkforceScreen />,
    devices:   <DevicesScreen />,
    reports:   <ReportsScreen />,
    settings:  <SettingsScreen currentOrg={currentOrg} />,
  };

  const superScreens = {
    platform:  <PlatformOverviewScreen onEnterTenant={(id) => { setCurrentOrgId(id); setActive("ops"); }} />,
    orgs:      <OrgsScreen onEnterTenant={(id) => { setCurrentOrgId(id); setActive("ops"); }} />,
    fleet:     <FleetScreen />,
    health:    <SystemHealthScreen />,
    support:   <SupportScreen />,
    revenue:   <RevenueScreen />,
    // Tenant context screens
    ops:       <OperationsScreen role="super" currentOrg={currentOrg} />,
    dispatch:  <DispatchLogScreen />,
    workforce: <WorkforceScreen />,
    devices:   <DevicesScreen />,
    settings:  <SettingsScreen currentOrg={currentOrg} />,
  };

  const screens = role === "super" ? superScreens : orgScreens;
  const currentScreen = screens[active] || screens[role === "super" ? "platform" : "ops"];

  return (
    <DemoProvider>
      <div className="h-screen bg-neutral-50 text-neutral-900 flex flex-col overflow-hidden" style={SANS}>
        <style>{FONTS}</style>
        <div className="flex flex-1 min-h-0">
          <Sidebar
            role={role}
            active={active}
            setActive={setActive}
            currentOrg={currentOrg}
            setCurrentOrgId={setCurrentOrgId}
          />
          <main className="flex-1 flex flex-col min-w-0">
            <TopBar role={role} screen={active} setRole={setRole} currentOrg={currentOrg} />
            <div className="flex-1 overflow-y-auto">{currentScreen}</div>
          </main>
        </div>
        <DemoNarrator />
        <MobileCompanion />
        <DemoControlBar />
      </div>
    </DemoProvider>
  );
}