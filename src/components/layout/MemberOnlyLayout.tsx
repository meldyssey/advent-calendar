import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router";
import GlobalLoader from "../GlobalLoader";

export default function MemberOnlyLayout() {
  const { user, loading } = useAuth();
  if (loading) return <GlobalLoader />;
  if (!user) return <Navigate to={"/"} replace={true} />;

  return <Outlet />;
}
