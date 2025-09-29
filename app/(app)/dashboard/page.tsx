import { KPICards } from "@/components/kpi-cards";
import QuickDeduct from "@/components/quick-deduct";

export default function DashboardPage(){
  return (
    <div className="space-y-6">
      <KPICards />
      <QuickDeduct />
    </div>
  );
}
