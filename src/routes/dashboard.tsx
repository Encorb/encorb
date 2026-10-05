import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardRedirect,
});

function DashboardRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (user.role === "buyer") {
      navigate({ to: "/dashboard/buyer" });
    } else if (user.role === "seller") {
      navigate({ to: "/dashboard/seller" });
    } else {
      navigate({ to: "/dashboard/admin" });
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
    </div>
  );
}
