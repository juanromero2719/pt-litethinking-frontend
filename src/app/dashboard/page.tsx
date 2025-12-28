import LogoutButton from "@/components/auth/LogoutButton";

export default function DashboardPage() {
  return (
    <div style={{ padding: 24, display: "grid", gap: 12 }}>
      <h1>Dashboard (protegido)</h1>
      <LogoutButton />
    </div>
  );
}
