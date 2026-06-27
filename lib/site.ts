export const siteConfig = {
  name: "Optiminastic",
  product: "Project O2",
  tagline: "Financial Intelligence Built for Modern Businesses",
  description:
    "A premium finance platform for modern businesses — automated onboarding, invoice intelligence, multi-level approvals, and audit-ready financial control.",
  url: "https://optiminastic.example",
  email: "hello@optiminastic.com",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const services = [
  {
    title: "Financial Strategy",
    slug: "financial-strategy",
    description:
      "Capital structure, runway modelling and board-ready forecasting built around how your business actually moves.",
  },
  {
    title: "Wealth Advisory",
    slug: "wealth-advisory",
    description:
      "Discreet, long-horizon stewardship of personal and corporate wealth across cycles and jurisdictions.",
  },
  {
    title: "Corporate Finance",
    slug: "corporate-finance",
    description:
      "M&A readiness, fundraising and treasury operations executed with institutional precision.",
  },
  {
    title: "Investment Planning",
    slug: "investment-planning",
    description:
      "Allocation frameworks tuned to risk appetite, liquidity needs and the long game.",
  },
  {
    title: "Risk Analysis",
    slug: "risk-analysis",
    description:
      "Continuous exposure monitoring, scenario stress-testing and compliance you can defend.",
  },
  {
    title: "Digital Transformation",
    slug: "digital-transformation",
    description:
      "Finance operations re-engineered — automated, reconciled and audit-ready by design.",
  },
] as const;

export interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
}

export const stats: Stat[] = [
  { value: 2.4, suffix: "B", prefix: "$", label: "Assets under guidance", decimals: 1 },
  { value: 99.98, suffix: "%", label: "Reconciliation accuracy", decimals: 2 },
  { value: 340, suffix: "+", label: "Modern businesses served" },
  { value: 18, suffix: " yrs", label: "Compounding expertise" },
];

export const process = [
  { step: "01", title: "Discover", body: "We map every flow of capital, obligation and risk across your business." },
  { step: "02", title: "Analyze", body: "Data is reconciled, modelled and pressure-tested against reality." },
  { step: "03", title: "Strategize", body: "A clear, defensible financial strategy — built for your horizon." },
  { step: "04", title: "Execute", body: "Approvals, payments and compliance run on a single source of truth." },
  { step: "05", title: "Optimize", body: "Continuous tuning as conditions, markets and ambitions evolve." },
] as const;

export const caseStudies = [
  {
    title: "Restructuring a $400M treasury",
    sector: "Manufacturing",
    metric: "31% cash efficiency",
    body: "Consolidated fragmented banking into one reconciled, approval-governed ledger.",
  },
  {
    title: "Onboarding 1,200 vendors in 90 days",
    sector: "Logistics",
    metric: "0 compliance gaps",
    body: "Automated KYC, tax verification and bank validation across a national network.",
  },
  {
    title: "Audit-ready in a single quarter",
    sector: "SaaS",
    metric: "100% trail coverage",
    body: "Every payment traced from request to bank match with leadership oversight.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "It feels less like finance software and more like a quiet, brilliant colleague. Everything is where it should be.",
    name: "Aarav Mehta",
    role: "CFO, Northwind Capital",
  },
  {
    quote:
      "The approval trail alone changed how our board sees risk. Nothing leaves the company unseen.",
    name: "Lena Okafor",
    role: "CEO, Vertex Logistics",
  },
  {
    quote:
      "Reconciliation went from a week of dread to something that simply happens. Calm, exact, beautiful.",
    name: "Daniel Roy",
    role: "Finance Director, Halo SaaS",
  },
] as const;

export const insights = [
  {
    title: "The quiet architecture of trustworthy finance",
    category: "Perspective",
    readTime: "6 min",
    excerpt: "Why the most advanced financial systems are the ones you never notice working.",
  },
  {
    title: "Reconciliation as a design problem",
    category: "Engineering",
    readTime: "9 min",
    excerpt: "Matching money to reality is less about data and more about composition.",
  },
  {
    title: "Approvals without friction",
    category: "Operations",
    readTime: "5 min",
    excerpt: "How two signatures can protect a company without slowing it down.",
  },
] as const;
