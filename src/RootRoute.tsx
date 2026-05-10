import { Navigate, Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";

import { lazy, Suspense } from "react";
import MemberOnlyLayout from "./components/layout/MemberOnlyLayout";
import GlobalLoader from "./components/GlobalLoader";

const ProjectListPage = lazy(() =>
  import("./pages/ProjectListPage").then((m) => ({
    default: m.ProjectListPage,
  })),
);
const CreateProjectPage = lazy(() =>
  import("./pages/CreateProjectPage").then((m) => ({
    default: m.CreateProjectPage,
  })),
);
const ProjectDetailPage = lazy(() =>
  import("./pages/ProjectDetailPage").then((m) => ({
    default: m.ProjectDetailPage,
  })),
);
const JoinProjectPage = lazy(() =>
  import("./pages/JoinProjectPage").then((m) => ({
    default: m.JoinProjectPage,
  })),
);

export default function RootRoute() {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/join/:id" element={<JoinProjectPage />} />

        <Route element={<MemberOnlyLayout />}>
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
