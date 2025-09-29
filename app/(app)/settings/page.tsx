export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-xl font-semibold">Settings</div>
        <p className="text-sm opacity-70">Roles, notifications, and integrations.</p>
      </div>

      <section className="space-y-2">
        <div className="font-medium">Roles & Access</div>
        <p className="text-sm opacity-70">Coming soon: map Supabase Auth users to roles (admin/operator/viewer).</p>
      </section>

      <section className="space-y-2">
        <div className="font-medium">Notifications</div>
        <p className="text-sm opacity-70">Configure low-stock thresholds and package alerts.</p>
      </section>

      <section className="space-y-2">
        <div className="font-medium">Integrations</div>
        <ul className="list-disc ml-5 text-sm">
          <li>AfterShip/Shippo API key (for packages)</li>
          <li>Resend API key (for email notifications)</li>
        </ul>
      </section>
    </div>
  );
}
