import { Header } from "./Header";
import { Outlet } from "react-router";

export default function GlobalLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
