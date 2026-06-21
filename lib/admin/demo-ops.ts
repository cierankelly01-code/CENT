/**
 * SAMPLE/DEMO data for Centaur Robotics staff operations dashboard.
 * Paired with lib/admin/demo.ts (DEMO_MODE).
 * Safe to delete to remove demo data.
 */

export type DemoQuote = {
  ref: string;
  customer: string;
  total: string;
  status: "Draft" | "Sent" | "Accepted" | "Expired";
  sentAt: string;
  validUntil: string;
  lines: { item: string; qty: number; price: string }[];
};

export const demoQuotes: DemoQuote[] = [
  {
    ref: "Q-1042",
    customer: "Royal Sussex Hospital Trust",
    total: "£21,840",
    status: "Accepted",
    sentAt: "2026-05-28",
    validUntil: "2026-07-28",
    lines: [
      { item: "Centaur base unit (standard geometry)", qty: 2, price: "£16,000" },
      { item: "Seat width customization (420mm)", qty: 2, price: "£800" },
      { item: "Premium leather upholstery (Oxford Black)", qty: 2, price: "£1,600" },
      { item: "Joystick control module", qty: 2, price: "£1,200" },
      { item: "Delivery & installation (2 sites)", qty: 1, price: "£2,240" },
    ],
  },
  {
    ref: "Q-1051",
    customer: "Greenslade Property Ltd",
    total: "£18,400",
    status: "Sent",
    sentAt: "2026-06-15",
    validUntil: "2026-07-15",
    lines: [
      { item: "Centaur base unit (standard geometry)", qty: 1, price: "£16,000" },
      { item: "Seat width customization (470mm)", qty: 1, price: "£800" },
      { item: "Composite finish (Titanium Grey)", qty: 1, price: "£600" },
      { item: "App control integration", qty: 1, price: "£1,200" },
      { item: "Delivery & installation (single)", qty: 1, price: "£800" },
    ],
  },
  {
    ref: "Q-1048",
    customer: "Bristol City Council",
    total: "£19,600",
    status: "Draft",
    sentAt: "—",
    validUntil: "2026-07-20",
    lines: [
      { item: "Centaur base unit (standard geometry)", qty: 1, price: "£16,000" },
      { item: "Seat width customization (420mm)", qty: 1, price: "£800" },
      { item: "Premium leather upholstery (Navy)", qty: 1, price: "£800" },
      { item: "Joystick control module", qty: 1, price: "£1,200" },
      { item: "Delivery & installation (single)", qty: 1, price: "£800" },
    ],
  },
  {
    ref: "Q-1035",
    customer: "Westfield Care Homes",
    total: "£37,200",
    status: "Accepted",
    sentAt: "2026-05-10",
    validUntil: "2026-08-10",
    lines: [
      { item: "Centaur base unit (standard geometry)", qty: 2, price: "£16,000" },
      { item: "Seat width customization (420mm + 470mm)", qty: 2, price: "£1,600" },
      { item: "Premium leather upholstery (Oxford Black, Navy)", qty: 2, price: "£1,600" },
      { item: "Joystick control module", qty: 2, price: "£1,200" },
      { item: "App control integration", qty: 2, price: "£1,200" },
      { item: "Delivery & installation (2 sites)", qty: 1, price: "£4,000" },
    ],
  },
  {
    ref: "Q-1052",
    customer: "Manchester Disability Services",
    total: "£16,800",
    status: "Expired",
    sentAt: "2026-04-20",
    validUntil: "2026-06-20",
    lines: [
      { item: "Centaur base unit (standard geometry)", qty: 1, price: "£16,000" },
      { item: "Basic assembly & testing", qty: 1, price: "£800" },
    ],
  },
  {
    ref: "Q-1053",
    customer: "Nottingham University Hospital NHS",
    total: "£20,400",
    status: "Sent",
    sentAt: "2026-06-12",
    validUntil: "2026-07-12",
    lines: [
      { item: "Centaur base unit (standard geometry)", qty: 1, price: "£16,000" },
      { item: "Seat width customization (450mm)", qty: 1, price: "£800" },
      { item: "Premium leather upholstery (Charcoal)", qty: 1, price: "£800" },
      { item: "Joystick control module", qty: 1, price: "£1,200" },
      { item: "Delivery & installation (single)", qty: 1, price: "£800" },
    ],
  },
];

export type DemoPart = {
  sku: string;
  name: string;
  supplier: string;
  inStock: number;
  reorderAt: number;
  onOrder: number;
  lead: string;
  status: "In stock" | "Low" | "Needs ordering";
};

export const demoParts: DemoPart[] = [
  {
    sku: "MOT-2KW-R",
    name: "Drive motor 2kW (right)",
    supplier: "Falconhurst Motors Ltd",
    inStock: 8,
    reorderAt: 5,
    onOrder: 0,
    lead: "8 wks",
    status: "In stock",
  },
  {
    sku: "MOT-2KW-L",
    name: "Drive motor 2kW (left)",
    supplier: "Falconhurst Motors Ltd",
    inStock: 8,
    reorderAt: 5,
    onOrder: 0,
    lead: "8 wks",
    status: "In stock",
  },
  {
    sku: "BATT-48V-50",
    name: "Battery pack 48V 50Ah lithium",
    supplier: "Pennine Energy Systems",
    inStock: 3,
    reorderAt: 5,
    onOrder: 10,
    lead: "6 wks",
    status: "Low",
  },
  {
    sku: "CTRL-MAIN-V3",
    name: "Main control module (V3.2)",
    supplier: "Boundary Ridge Electronics",
    inStock: 12,
    reorderAt: 8,
    onOrder: 0,
    lead: "4 wks",
    status: "In stock",
  },
  {
    sku: "GYRO-IMU-9DOF",
    name: "Gyroscope/IMU 9-DOF board",
    supplier: "Boundary Ridge Electronics",
    inStock: 2,
    reorderAt: 4,
    onOrder: 0,
    lead: "5 wks",
    status: "Needs ordering",
  },
  {
    sku: "FRAME-SEAT-STD",
    name: "Seat frame assembly (standard)",
    supplier: "Sutherland Composites",
    inStock: 7,
    reorderAt: 6,
    onOrder: 0,
    lead: "10 wks",
    status: "In stock",
  },
  {
    sku: "STAB-LEGS-PAIR",
    name: "Stabilizer legs (pair, fail-safe)",
    supplier: "Sutherland Composites",
    inStock: 14,
    reorderAt: 8,
    onOrder: 0,
    lead: "10 wks",
    status: "In stock",
  },
  {
    sku: "WHEEL-FOAM-425",
    name: "Pneumatic wheel & tyre (425mm, pair)",
    supplier: "Highland Traction Ltd",
    inStock: 4,
    reorderAt: 6,
    onOrder: 8,
    lead: "6 wks",
    status: "Low",
  },
  {
    sku: "UPHOLSTER-LEATHER",
    name: "Premium leather upholstery roll (Oxford Black)",
    supplier: "Croft Leather & Textiles",
    inStock: 5,
    reorderAt: 3,
    onOrder: 0,
    lead: "12 wks",
    status: "In stock",
  },
  {
    sku: "JOYSTICK-STD",
    name: "Standard joystick module with grip",
    supplier: "Boundary Ridge Electronics",
    inStock: 6,
    reorderAt: 4,
    onOrder: 5,
    lead: "4 wks",
    status: "In stock",
  },
];

export type DemoPO = {
  ref: string;
  supplier: string;
  items: string;
  total: string;
  status: "Draft" | "Sent" | "Acknowledged" | "In transit" | "Received";
  eta: string;
};

export const demoPurchaseOrders: DemoPO[] = [
  {
    ref: "PO-3071",
    supplier: "Falconhurst Motors Ltd",
    items: "Drive motor 2kW ×20 (10 pairs)",
    total: "£12,400",
    status: "Received",
    eta: "—",
  },
  {
    ref: "PO-3089",
    supplier: "Pennine Energy Systems",
    items: "Battery pack 48V 50Ah ×10",
    total: "£8,900",
    status: "In transit",
    eta: "2026-07-02",
  },
  {
    ref: "PO-3094",
    supplier: "Boundary Ridge Electronics",
    items: "Gyroscope/IMU 9-DOF ×15, Joystick modules ×10",
    total: "£6,200",
    status: "Acknowledged",
    eta: "2026-07-18",
  },
  {
    ref: "PO-3101",
    supplier: "Sutherland Composites",
    items: "Seat frame assembly ×12, Stabilizer legs ×24",
    total: "£14,600",
    status: "Sent",
    eta: "2026-08-15",
  },
  {
    ref: "PO-3108",
    supplier: "Highland Traction Ltd",
    items: "Pneumatic wheel & tyre (425mm) ×16",
    total: "£4,800",
    status: "Acknowledged",
    eta: "2026-07-09",
  },
  {
    ref: "PO-3112",
    supplier: "Croft Leather & Textiles",
    items: "Premium leather upholstery rolls ×6",
    total: "£7,200",
    status: "Draft",
    eta: "—",
  },
];

export type DemoReorderSuggestion = {
  part: string;
  supplier: string;
  qty: number;
  reason: string;
  status: "Awaiting approval" | "Auto-approved" | "Ordered";
};

export const demoReorderSuggestions: DemoReorderSuggestion[] = [
  {
    part: "Battery pack 48V 50Ah lithium",
    supplier: "Pennine Energy Systems",
    qty: 15,
    reason: "Below reorder point (3 of 5). 4 builds in July require batteries. Already 10 on order; suggest +15 for Aug–Sep buffer.",
    status: "Ordered",
  },
  {
    part: "Gyroscope/IMU 9-DOF board",
    supplier: "Boundary Ridge Electronics",
    qty: 12,
    reason: "Critical: 2 of 4 in stock. 2 builds in July need gyros. PO-3094 covers 15 arriving late July; suggest +12 for safety stock.",
    status: "Awaiting approval",
  },
  {
    part: "Pneumatic wheel & tyre (425mm, pair)",
    supplier: "Highland Traction Ltd",
    qty: 10,
    reason: "Low stock (4 pairs). 3 Q2 orders in build. PO-3108 has 8 pairs in transit; suggest +10 for Aug–Sep.",
    status: "Auto-approved",
  },
  {
    part: "Stabilizer legs (pair, fail-safe)",
    supplier: "Sutherland Composites",
    qty: 20,
    reason: "Usage trending up: 2 per build × 8 expected Q3 builds = 16 needed. Current 14 + incoming 24 from PO-3101 sufficient, but suggest +20 for Q4.",
    status: "Awaiting approval",
  },
  {
    part: "Premium leather upholstery roll (Oxford Black)",
    supplier: "Croft Leather & Textiles",
    qty: 8,
    reason: "5 in stock; 3 builds in July request premium leather. PO-3112 (draft) will add 6. Suggest +8 for Navy/Charcoal variants.",
    status: "Awaiting approval",
  },
];

export type DemoSupplier = {
  name: string;
  supplies: string;
  lead: string;
  onTime: string;
  status: "Preferred" | "Active" | "Review";
};

export const demoSuppliers: DemoSupplier[] = [
  {
    name: "Falconhurst Motors Ltd",
    supplies: "Drive motors, motor controllers",
    lead: "8 wks",
    onTime: "98%",
    status: "Preferred",
  },
  {
    name: "Pennine Energy Systems",
    supplies: "Battery packs, charging systems",
    lead: "6 wks",
    onTime: "94%",
    status: "Preferred",
  },
  {
    name: "Boundary Ridge Electronics",
    supplies: "Control modules, gyroscopes, joysticks, sensors",
    lead: "4–5 wks",
    onTime: "96%",
    status: "Preferred",
  },
  {
    name: "Sutherland Composites",
    supplies: "Frame assemblies, stabilizer legs, composite parts",
    lead: "10 wks",
    onTime: "91%",
    status: "Active",
  },
  {
    name: "Highland Traction Ltd",
    supplies: "Wheels, tyres, pneumatic assemblies",
    lead: "6 wks",
    onTime: "89%",
    status: "Active",
  },
  {
    name: "Croft Leather & Textiles",
    supplies: "Premium leather, upholstery, trim materials",
    lead: "12 wks",
    onTime: "93%",
    status: "Preferred",
  },
];

export type DemoProductionItem = {
  ref: string;
  customer: string;
  stage: "Awaiting parts" | "Ready to build" | "In build" | "QA" | "Ready to ship";
  partsReady: boolean;
  due: string;
};

export const demoProduction: DemoProductionItem[] = [
  {
    ref: "CEN-7K2Q4",
    customer: "Royal Sussex Hospital Trust",
    stage: "In build",
    partsReady: true,
    due: "2026-06-28",
  },
  {
    ref: "CEN-7K2Q4",
    customer: "Royal Sussex Hospital Trust",
    stage: "QA",
    partsReady: true,
    due: "2026-06-28",
  },
  {
    ref: "CEN-4M8P2",
    customer: "Westfield Care Homes",
    stage: "Ready to build",
    partsReady: true,
    due: "2026-07-05",
  },
  {
    ref: "CEN-4M8P2",
    customer: "Westfield Care Homes",
    stage: "Awaiting parts",
    partsReady: false,
    due: "2026-07-05",
  },
  {
    ref: "CEN-9QR3T",
    customer: "Greenslade Property Ltd",
    stage: "Ready to ship",
    partsReady: true,
    due: "2026-06-24",
  },
  {
    ref: "CEN-2H6N8",
    customer: "Bristol City Council",
    stage: "Awaiting parts",
    partsReady: false,
    due: "2026-07-12",
  },
  {
    ref: "CEN-5T9W1",
    customer: "Nottingham University Hospital NHS",
    stage: "Ready to build",
    partsReady: true,
    due: "2026-07-18",
  },
  {
    ref: "CEN-5T9W1",
    customer: "Nottingham University Hospital NHS",
    stage: "In build",
    partsReady: true,
    due: "2026-07-25",
  },
];
