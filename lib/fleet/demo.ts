// Fleet portal demo data — shown when NEXT_PUBLIC_STAFF_DEMO=1.
// Purely presentational. No data is read from or written to the database.

export type ChairStatus = "active" | "charging" | "idle" | "maintenance";

export interface FleetChair {
  serial: string;
  location: string;
  zone: string;
  batteryPct: number;
  status: ChairStatus;
  lastActive: string; // ISO
  nextServiceDate: string; // ISO date
  alert: boolean;
  alertMessage?: string;
  serviceHistory: { date: string; action: string; tech: string }[];
}

export interface FleetOrg {
  slug: string;
  name: string;
  type: string;
  contactName: string;
  contactEmail: string;
  chairs: FleetChair[];
}

const NHS_CHAIRS: FleetChair[] = [
  {
    serial: "CEN-NHS-001", location: "Ward 4A", zone: "North Wing",
    batteryPct: 82, status: "active", lastActive: "2026-06-22T10:14:00Z",
    nextServiceDate: "2026-09-01", alert: false,
    serviceHistory: [
      { date: "2026-03-10", action: "6-month service completed", tech: "James Okafor" },
      { date: "2025-09-08", action: "Initial setup & staff training", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-NHS-002", location: "Ward 4A", zone: "North Wing",
    batteryPct: 14, status: "idle", lastActive: "2026-06-22T07:30:00Z",
    nextServiceDate: "2026-09-01", alert: true, alertMessage: "Battery critical — plug in before next use",
    serviceHistory: [
      { date: "2026-03-10", action: "6-month service completed", tech: "James Okafor" },
      { date: "2025-09-08", action: "Initial setup & staff training", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-NHS-003", location: "Outpatients", zone: "East Wing",
    batteryPct: 61, status: "charging", lastActive: "2026-06-21T16:45:00Z",
    nextServiceDate: "2026-09-15", alert: false,
    serviceHistory: [
      { date: "2026-03-22", action: "Control module calibration", tech: "Centaur Fleet Team" },
      { date: "2025-09-22", action: "Initial setup", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-NHS-004", location: "Outpatients", zone: "East Wing",
    batteryPct: 0, status: "maintenance", lastActive: "2026-06-18T11:00:00Z",
    nextServiceDate: "2026-06-22", alert: true, alertMessage: "Service overdue — booked for 24 Jun",
    serviceHistory: [
      { date: "2026-06-18", action: "Joystick fault reported — awaiting parts", tech: "James Okafor" },
      { date: "2026-03-10", action: "6-month service completed", tech: "James Okafor" },
    ],
  },
  {
    serial: "CEN-NHS-005", location: "Radiology", zone: "Ground Floor",
    batteryPct: 95, status: "active", lastActive: "2026-06-22T10:55:00Z",
    nextServiceDate: "2026-10-01", alert: false,
    serviceHistory: [
      { date: "2026-04-05", action: "6-month service completed", tech: "Centaur Fleet Team" },
      { date: "2025-10-01", action: "Initial setup", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-NHS-006", location: "Radiology", zone: "Ground Floor",
    batteryPct: 73, status: "idle", lastActive: "2026-06-22T09:10:00Z",
    nextServiceDate: "2026-10-01", alert: false,
    serviceHistory: [
      { date: "2026-04-05", action: "6-month service completed", tech: "Centaur Fleet Team" },
      { date: "2025-10-01", action: "Initial setup", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-NHS-007", location: "Main Entrance", zone: "Reception",
    batteryPct: 44, status: "active", lastActive: "2026-06-22T10:50:00Z",
    nextServiceDate: "2026-11-01", alert: false,
    serviceHistory: [
      { date: "2026-05-01", action: "6-month service completed", tech: "James Okafor" },
      { date: "2025-11-01", action: "Initial setup", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-NHS-008", location: "Main Entrance", zone: "Reception",
    batteryPct: 18, status: "idle", lastActive: "2026-06-22T08:00:00Z",
    nextServiceDate: "2026-11-01", alert: true, alertMessage: "Low battery — charge recommended",
    serviceHistory: [
      { date: "2026-05-01", action: "6-month service completed", tech: "James Okafor" },
      { date: "2025-11-01", action: "Initial setup", tech: "Centaur Fleet Team" },
    ],
  },
];

const STADIUM_CHAIRS: FleetChair[] = [
  {
    serial: "CEN-STD-001", location: "Accessible Entrance A", zone: "Level 1",
    batteryPct: 100, status: "charging", lastActive: "2026-06-21T22:30:00Z",
    nextServiceDate: "2026-08-15", alert: false,
    serviceHistory: [
      { date: "2026-02-12", action: "Pre-season service & check", tech: "Centaur Fleet Team" },
      { date: "2025-08-15", action: "Initial fleet setup", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-STD-002", location: "Accessible Entrance A", zone: "Level 1",
    batteryPct: 100, status: "charging", lastActive: "2026-06-21T22:30:00Z",
    nextServiceDate: "2026-08-15", alert: false,
    serviceHistory: [
      { date: "2026-02-12", action: "Pre-season service & check", tech: "Centaur Fleet Team" },
      { date: "2025-08-15", action: "Initial fleet setup", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-STD-003", location: "Family Stand", zone: "Level 2",
    batteryPct: 88, status: "idle", lastActive: "2026-06-21T22:15:00Z",
    nextServiceDate: "2026-08-15", alert: false,
    serviceHistory: [
      { date: "2026-02-12", action: "Pre-season service & check", tech: "Centaur Fleet Team" },
      { date: "2025-08-15", action: "Initial fleet setup", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-STD-004", location: "Family Stand", zone: "Level 2",
    batteryPct: 9, status: "idle", lastActive: "2026-06-21T21:40:00Z",
    nextServiceDate: "2026-08-15", alert: true, alertMessage: "Battery critical — charge overnight",
    serviceHistory: [
      { date: "2026-02-12", action: "Pre-season service & check", tech: "Centaur Fleet Team" },
      { date: "2025-08-15", action: "Initial fleet setup", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-STD-005", location: "VIP Lounge", zone: "Level 3",
    batteryPct: 77, status: "idle", lastActive: "2026-06-21T22:45:00Z",
    nextServiceDate: "2026-08-15", alert: false,
    serviceHistory: [
      { date: "2026-02-12", action: "Pre-season service & check", tech: "Centaur Fleet Team" },
      { date: "2025-08-15", action: "Initial fleet setup", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-STD-006", location: "VIP Lounge", zone: "Level 3",
    batteryPct: 0, status: "maintenance", lastActive: "2026-06-19T18:00:00Z",
    nextServiceDate: "2026-06-20", alert: true, alertMessage: "Frame inspection required — out of service",
    serviceHistory: [
      { date: "2026-06-19", action: "Frame scuff reported — inspection booked", tech: "Centaur Fleet Team" },
      { date: "2026-02-12", action: "Pre-season service & check", tech: "Centaur Fleet Team" },
    ],
  },
];

const CARE_CHAIRS: FleetChair[] = [
  {
    serial: "CEN-RCH-001", location: "Lounge", zone: "Ground Floor",
    batteryPct: 67, status: "active", lastActive: "2026-06-22T10:30:00Z",
    nextServiceDate: "2026-10-10", alert: false,
    serviceHistory: [
      { date: "2026-04-10", action: "6-month service completed", tech: "James Okafor" },
      { date: "2025-10-10", action: "Initial setup & carer training", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-RCH-002", location: "Dining Room", zone: "Ground Floor",
    batteryPct: 51, status: "active", lastActive: "2026-06-22T09:55:00Z",
    nextServiceDate: "2026-10-10", alert: false,
    serviceHistory: [
      { date: "2026-04-10", action: "6-month service completed", tech: "James Okafor" },
      { date: "2025-10-10", action: "Initial setup & carer training", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-RCH-003", location: "Garden Room", zone: "Ground Floor",
    batteryPct: 22, status: "charging", lastActive: "2026-06-22T08:45:00Z",
    nextServiceDate: "2026-10-10", alert: false,
    serviceHistory: [
      { date: "2026-04-10", action: "6-month service completed", tech: "James Okafor" },
      { date: "2025-10-10", action: "Initial setup", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-RCH-004", location: "Room 14", zone: "First Floor",
    batteryPct: 88, status: "idle", lastActive: "2026-06-22T07:20:00Z",
    nextServiceDate: "2026-12-01", alert: false,
    serviceHistory: [
      { date: "2026-06-01", action: "New unit setup", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-RCH-005", location: "Room 22", zone: "First Floor",
    batteryPct: 11, status: "idle", lastActive: "2026-06-22T06:30:00Z",
    nextServiceDate: "2026-12-01", alert: true, alertMessage: "Low battery — please charge",
    serviceHistory: [
      { date: "2026-06-01", action: "New unit setup", tech: "Centaur Fleet Team" },
    ],
  },
  {
    serial: "CEN-RCH-006", location: "Therapy Room", zone: "Ground Floor",
    batteryPct: 0, status: "maintenance", lastActive: "2026-06-20T14:00:00Z",
    nextServiceDate: "2026-06-22", alert: true, alertMessage: "Scheduled annual service today",
    serviceHistory: [
      { date: "2026-06-22", action: "Annual service — in progress", tech: "James Okafor" },
      { date: "2025-06-15", action: "Initial setup & carer training", tech: "Centaur Fleet Team" },
    ],
  },
];

export const FLEET_ORGS: FleetOrg[] = [
  {
    slug: "nhs-trust",
    name: "Northgate NHS Trust",
    type: "NHS Trust / Hospital",
    contactName: "Patricia Hewitt",
    contactEmail: "p.hewitt@northgatenhs.example",
    chairs: NHS_CHAIRS,
  },
  {
    slug: "city-stadium",
    name: "City Stadium",
    type: "Stadium & venue",
    contactName: "Marcus Webb",
    contactEmail: "access@citystadium.example",
    chairs: STADIUM_CHAIRS,
  },
  {
    slug: "riverside-care",
    name: "Riverside Care Home",
    type: "Care home",
    contactName: "Aisling Byrne",
    contactEmail: "aisling@riversidecare.example",
    chairs: CARE_CHAIRS,
  },
];

export function getOrg(slug: string): FleetOrg | undefined {
  return FLEET_ORGS.find((o) => o.slug === slug);
}

export function getChair(slug: string, serial: string): FleetChair | undefined {
  return getOrg(slug)?.chairs.find((c) => c.serial === serial);
}

export function alertCount(org: FleetOrg): number {
  return org.chairs.filter((c) => c.alert).length;
}
