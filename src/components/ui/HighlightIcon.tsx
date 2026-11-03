import {
  CheckCircle2,
  FlaskConical,
  Gauge,
  LayoutDashboard,
  MapPin,
  RefreshCw,
  Rocket,
  Search,
  Server,
  Share2,
  ShieldCheck,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import type { Highlight } from "@/content/types";

const icons: Record<Highlight["icon"], React.ComponentType<{ className?: string }>> = {
  layout: LayoutDashboard,
  refresh: RefreshCw,
  share: Share2,
  server: Server,
  rocket: Rocket,
  workflow: Workflow,
  users: Users,
  check: CheckCircle2,
  shield: ShieldCheck,
  map: MapPin,
  zap: Zap,
  test: FlaskConical,
  search: Search,
  gauge: Gauge,
};

export function HighlightIcon({ name, className }: { name: Highlight["icon"]; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden />;
}
